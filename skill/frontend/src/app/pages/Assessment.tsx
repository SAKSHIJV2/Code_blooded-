import React, { useState, useEffect } from "react";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  Hash,
  Activity,
} from "lucide-react";
import { Badge, Button } from "../components/ui";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export function Assessment() {
  const navigate = useNavigate();

  const [isStarted, setIsStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [currentStep, setCurrentStep] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [answers, setAnswers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const USER_ID = "user_123";
  const ATTEMPT_ID = "ATTEMPT_001";

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (!isStarted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  /* ---------------- START ---------------- */
  const startAssessment = async () => {
    try {
      setLoading(true);

      const response = await fetch("http://127.0.0.1:8000/generate-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty_mode: "Mixed" }),
      });

      const data = await response.json();
      setQuestions(data.questions);
      setIsStarted(true);
      setLoading(false);
    } catch (error) {
      console.error("Error generating test:", error);
      setLoading(false);
    }
  };
  const getAnswer = (questionId: string) => {
    const found = answers.find((a) => a.question_id === questionId);
    return found ? found.user_answer : "";
  };

  /* ---------------- SAVE TO BACKEND ---------------- */
  const saveAnswerToBackend = async (
    questionId: string,
    answer: any,
    timeTaken: number = 30,
  ) => {
    try {
      await fetch("http://127.0.0.1:8000/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: USER_ID,
          attempt_id: ATTEMPT_ID,
          question_id: questionId,
          answer: answer,
          time: timeTaken,
        }),
      });
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  /* ---------------- LOCAL + LIVE SAVE ---------------- */
  const saveAnswer = (questionId: string, answer: any) => {
    setAnswers((prev) => [
      ...prev.filter((a) => a.question_id !== questionId),
      { question_id: questionId, user_answer: answer },
    ]);

    saveAnswerToBackend(questionId, answer);
  };

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    const payload = {
      attempt_id: ATTEMPT_ID,
      user_id: USER_ID,
      answers: answers,
    };

    const response = await fetch("http://127.0.0.1:8000/submit-attempt", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const report = await response.json();
    navigate("/app/evaluation", { state: { report } });
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      {!isStarted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white p-10 rounded-2xl border shadow-sm mt-20 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">DSA Mastery Challenge</h2>

          <Button
            variant="gradient"
            size="lg"
            onClick={startAssessment}
            disabled={loading}
          >
            {loading ? "Loading..." : "Start Assessment"}
          </Button>
        </motion.div>
      ) : (
        <div>
          {/* HEADER */}
          <header className="flex justify-between items-center mb-6 p-6 bg-white rounded-xl border">
            <h2 className="font-bold">
              Question {currentStep + 1} of {questions.length}
            </h2>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              {formatTime(timeLeft)}
            </div>
          </header>

          {/* QUESTION */}
          {questions.length > 0 &&
            (() => {
              const q = questions[currentStep];
              const type = q?.question_type
                ?.replace(/\s+/g, "_")
                ?.toUpperCase();

              return (
                <section className="bg-white p-8 rounded-xl border shadow-sm">
                  <div className="flex gap-3 mb-4">
                    <Badge>
                      <Hash size={12} /> {q?.topic}
                    </Badge>
                    <Badge>
                      <Activity size={12} /> {q?.difficulty}
                    </Badge>
                    <Badge>{q?.question_type}</Badge>
                  </div>

                  <h3 className="text-lg font-semibold mb-6">{q?.question}</h3>

                  {/* CODE DISPLAY */}
                  {type === "CODE_TRACE" && q?.code && (
                    <pre className="bg-slate-900 text-slate-200 p-4 rounded-lg overflow-x-auto mb-6 text-sm">
                      <code>{q.code}</code>
                    </pre>
                  )}

                  {/* MCQ */}
                  {type === "MCQ" &&
                    q?.options?.map((opt: string) => (
                      <div key={opt} className="mb-3">
                        <label className="flex gap-2">
                          <input
                            type="radio"
                            name={q.id}
                            checked={getAnswer(q.id)?.includes(opt)}
                            onChange={() => saveAnswer(q.id, [opt])}
                          />
                          {opt}
                        </label>
                      </div>
                    ))}

                  {/* MSQ */}
                  {type === "MSQ" &&
                    q?.options?.map((opt: string) => (
                      <div key={opt} className="mb-3">
                        <label className="flex gap-2">
                          <input
                            type="checkbox"
                            checked={getAnswer(q.id)?.includes(opt)}
                            onChange={(e) => {
                              const existing = getAnswer(q.id) || [];
                              let updated = [...existing];

                              if (e.target.checked) updated.push(opt);
                              else updated = updated.filter((v) => v !== opt);

                              saveAnswer(q.id, updated);
                            }}
                          />
                          {opt}
                        </label>
                      </div>
                    ))}

                  {/* SHORT ANSWER */}
                  {type === "SHORT_ANSWER" && (
                    <textarea
                      value={getAnswer(q.id)}
                      onChange={(e) => saveAnswer(q.id, e.target.value)}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "6px",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  )}

                  {/* REASONING */}
                  {type === "REASONING" && (
                    <textarea
                      value={getAnswer(q.id)}
                      onChange={(e) => saveAnswer(q.id, e.target.value)}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "6px",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  )}

                  {/* CODE TRACE INPUT */}
                  {type === "CODE_TRACE" && (
                    <input
                      value={getAnswer(q.id)}
                      onChange={(e) => saveAnswer(q.id, e.target.value)}
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        borderRadius: "6px",
                        width: "100%",
                        outline: "none",
                      }}
                    />
                  )}
                </section>
              );
            })()}

          {/* FOOTER */}
          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
            >
              <ChevronLeft size={18} /> Previous
            </Button>

            {currentStep < questions.length - 1 ? (
              <Button
                variant="primary"
                onClick={() => setCurrentStep((prev) => prev + 1)}
              >
                Next <ChevronRight size={18} />
              </Button>
            ) : (
              <Button variant="gradient" onClick={handleSubmit}>
                Submit <Send size={18} />
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
