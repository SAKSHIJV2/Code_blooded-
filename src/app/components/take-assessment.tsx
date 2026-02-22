import React, { useState, useEffect } from "react";
import {
    Clock,
    ChevronLeft,
    ChevronRight,
    Send,
    Hash,
    Activity,
    Brain,
    Award,
    ChevronDown,
    ChevronUp,
    BarChart4,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Radar } from "react-chartjs-2";
import {
    Chart,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
} from "chart.js";

Chart.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
);

function RadarChart({ features }: any) {
    const data = {
        labels: ["Accuracy", "Conceptual", "Logical", "Speed"],
        datasets: [
            {
                label: "Skill Profile",
                data: [
                    features?.accuracy || 0,
                    features?.conceptual_score || 0,
                    features?.logical_score || 0,
                    features?.speed_score || 0
                ],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1,
            }
        ]
    };

    return <Radar data={data} />;
}

// Fallback UI components in case they are missing from ui folder
const Button = ({ children, variant, size, onClick, disabled, className = "" }: any) => {
    const base = "flex items-center gap-2 font-bold justify-center rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed";
    const variants: any = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/20",
        gradient: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30",
        outline: "bg-white border text-gray-700 hover:bg-gray-50 border-gray-200"
    };
    const sizes: any = {
        lg: "px-6 py-3 text-lg",
        md: "px-4 py-2"
    };
    return (
        <button className={`${base} ${variants[variant || 'primary']} ${sizes[size || 'md']} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};

const Badge = ({ children }: any) => (
    <span className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-700 rounded-lg">
        {children}
    </span>
);

export function TakeAssessment({ onComplete }: { onComplete?: (score: number) => void }) {
    const [isStarted, setIsStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(1500);
    const [currentStep, setCurrentStep] = useState(0);
    const [questions, setQuestions] = useState<any[]>([]);
    const [answers, setAnswers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [isSubmitComplete, setIsSubmitComplete] = useState<any>(null); // To replace navigate navigation

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

    /* ---------------- LOCAL SAVE ---------------- */
    const saveAnswerToBackend = async (questionId: string, answer: any) => {
        try {
            await fetch("http://127.0.0.1:8000/submit-answer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: USER_ID,
                    attempt_id: ATTEMPT_ID,
                    question_id: questionId,
                    answer: answer,
                    time: 30,
                }),
            });
        } catch (error) {
            console.error("Error saving answer:", error);
        }
    };

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

        try {
            const response = await fetch("http://127.0.0.1:8000/submit-attempt", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const report = await response.json();
            setIsSubmitComplete(report); // Display inline instead of navigate so the activeTab isn't strictly broken
            if (onComplete && report?.features?.accuracy) {
                onComplete(report.features.accuracy);
            }
        } catch (e) {
            setIsSubmitComplete({ summary: "We received your test, but report generation failed!" });
        }
    };

    // Evaluation Screen UI Fallback (NOW USING PHASE 1 EXACT ORIGINAL LAYOUT)
    if (isSubmitComplete) {
        const report = isSubmitComplete;
        const accuracy = report?.features?.accuracy ?? 0;

        const evalQuestions = [
            {
                id: 1,
                title: "AI Feedback Summary",
                userAnswer: "Based on your responses, your performance was analysed.",
                aiScore: accuracy,
                aiFeedback: report?.paragraph ?? "AI feedback will appear here.",
                signals: [
                    `Conceptual: ${report?.features?.conceptual_score ?? "--"}`,
                    `Logical: ${report?.features?.logical_score ?? "--"}`,
                    `Speed: ${report?.features?.speed_score ?? "--"}`,
                ],
            },
        ];

        return (
            <div className="space-y-8 max-w-6xl mx-auto pb-20 p-8">
                {/* HEADER */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold">Assessment Evaluation</h1>
                        <p className="text-slate-500">
                            AI-driven performance insights
                        </p>
                    </div>
                </header>

                {/* MAIN SCORE + CHART */}
                <div className="grid md:grid-cols-12 gap-8">
                    {/* SCORE CARD */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="md:col-span-5 bg-white p-10 rounded-3xl border shadow-sm flex flex-col items-center"
                    >
                        <div className="text-center">
                            {/* BIG SCORE */}
                            <div className="text-7xl font-black text-blue-600 mb-2">
                                {accuracy.toFixed(0)}%
                            </div>

                            <p className="text-slate-500 mb-6">
                                Overall Performance
                            </p>

                            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-500 text-white font-bold">
                                <Award size={18} />
                                {accuracy > 80 ? "Industry Ready" : "Needs Improvement"}
                            </div>
                        </div>
                    </motion.div>

                    {/* AI SUMMARY + CHART */}
                    <div className="md:col-span-7 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border shadow-sm">
                            <div className="flex items-center gap-2 mb-4">
                                <Brain size={20} className="text-blue-600" />
                                <h3 className="font-bold text-lg">AI Summary</h3>
                            </div>

                            {/* PARAGRAPH */}
                            <p className="text-slate-600 leading-relaxed mb-6">
                                {report?.paragraph ??
                                    "Complete the test to see AI feedback."}
                            </p>

                            {/* RADAR */}
                            {report?.features && (
                                <div className="max-w-md mx-auto">
                                    <RadarChart features={report.features} />
                                </div>
                            )}
                        </div>

                        {/* METRICS */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {[
                                {
                                    label: "Accuracy",
                                    value: report?.features?.accuracy,
                                },
                                {
                                    label: "Conceptual",
                                    value: report?.features?.conceptual_score,
                                },
                                {
                                    label: "Logical",
                                    value: report?.features?.logical_score,
                                },
                                {
                                    label: "Speed",
                                    value: report?.features?.speed_score,
                                },
                            ].map((item, i) => (
                                <div
                                    key={i}
                                    className="bg-white p-4 rounded-xl border text-center"
                                >
                                    <p className="text-xs text-slate-400 uppercase">
                                        {item.label}
                                    </p>
                                    <p className="text-xl font-bold">
                                        {item.value ?? "--"}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI FEEDBACK SECTION */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2">
                        <BarChart4 size={20} className="text-blue-600" />
                        <h3 className="font-bold text-xl">
                            Detailed AI Insights
                        </h3>
                    </div>

                    {evalQuestions.map((q, idx) => (
                        <div
                            key={q.id}
                            className="bg-white border rounded-xl overflow-hidden"
                        >
                            <button
                                onClick={() =>
                                    setCurrentStep(currentStep === idx ? -1 : idx)
                                }
                                className="w-full p-6 flex justify-between"
                            >
                                <div>
                                    <h4 className="font-bold text-left">{q.title}</h4>
                                    <p className="text-sm text-slate-500 text-left">
                                        Click to view insights
                                    </p>
                                </div>

                                {currentStep === idx ? (
                                    <ChevronUp />
                                ) : (
                                    <ChevronDown />
                                )}
                            </button>

                            <AnimatePresence>
                                {currentStep === idx && (
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: "auto" }}
                                        exit={{ height: 0 }}
                                        className="p-6 border-t bg-slate-50"
                                    >
                                        <div className="space-y-4 text-left">
                                            {/* AI TEXT */}
                                            <div className="p-4 bg-white rounded-xl border">
                                                {q.aiFeedback}
                                            </div>

                                            {/* SIGNALS */}
                                            <div className="flex flex-wrap gap-2">
                                                {q.signals.map((s, i) => (
                                                    <Badge key={i}>{s}</Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </section>

                <footer className="pt-10 flex justify-center">
                    <Button variant="outline" onClick={() => { setIsSubmitComplete(null); setIsStarted(false); setAnswers([]); setQuestions([]); }}>
                        Retake Assessment
                    </Button>
                </footer>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full max-w-5xl mx-auto p-8">
            {!isStarted ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm mt-10 text-center"
                >
                    <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Activity size={32} />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">DSA Mastery Challenge</h2>
                    <p className="text-slate-500 mb-8 max-w-md mx-auto">Determine your core engineering capacity across data structures, logic parsing, and problem-solving constraints.</p>
                    <div className="flex justify-center">
                        <Button
                            variant="gradient"
                            size="lg"
                            onClick={startAssessment}
                            disabled={loading}
                        >
                            {loading ? "Generating Unique Test..." : "Start Assessment"}
                        </Button>
                    </div>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {/* HEADER */}
                    <header className="flex flex-col md:flex-row justify-between md:items-center gap-4 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <h2 className="font-bold text-slate-800 text-lg">
                            Question <span className="text-blue-600">{currentStep + 1}</span> of {questions.length}
                        </h2>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl font-mono text-slate-700 font-bold">
                            <Clock size={16} className="text-slate-400" />
                            {formatTime(timeLeft)}
                        </div>
                    </header>

                    {/* QUESTION */}
                    {questions.length > 0 &&
                        (() => {
                            const q = questions[currentStep];
                            const type = q?.question_type
                                ?.replace(/\s+/g, "_")
                                ?.toUpperCase() || "MCQ";

                            return (
                                <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <Badge>
                                            <Hash size={12} /> {q?.topic || "Algorithms"}
                                        </Badge>
                                        <Badge>
                                            <Activity size={12} /> {q?.difficulty || "Medium"}
                                        </Badge>
                                        <Badge className="bg-blue-50 text-blue-700">{q?.question_type || "Multiple Choice"}</Badge>
                                    </div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-6 leading-relaxed">{q?.question}</h3>

                                    {/* CODE DISPLAY */}
                                    {type === "CODE_TRACE" && q?.code && (
                                        <pre className="bg-slate-900 text-slate-200 p-6 rounded-xl overflow-x-auto mb-6 text-sm font-mono leading-relaxed border border-slate-800">
                                            <code>{q.code}</code>
                                        </pre>
                                    )}

                                    {/* MCQ */}
                                    {type === "MCQ" &&
                                        q?.options?.map((opt: string) => (
                                            <label key={opt} className={`flex items-start gap-4 p-4 rounded-xl border mb-3 cursor-pointer transition-all ${getAnswer(q.id)?.includes(opt) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                                <input
                                                    type="radio"
                                                    name={q.id}
                                                    className="mt-1 w-4 h-4 text-blue-600 accent-blue-600"
                                                    checked={getAnswer(q.id)?.includes(opt) || false}
                                                    onChange={() => saveAnswer(q.id, [opt])}
                                                />
                                                <span className="text-slate-700 font-medium">{opt}</span>
                                            </label>
                                        ))}

                                    {/* MSQ */}
                                    {type === "MSQ" &&
                                        q?.options?.map((opt: string) => (
                                            <label key={opt} className={`flex items-start gap-4 p-4 rounded-xl border mb-3 cursor-pointer transition-all ${getAnswer(q.id)?.includes(opt) ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'}`}>
                                                <input
                                                    type="checkbox"
                                                    className="mt-1 w-4 h-4 text-blue-600 rounded accent-blue-600"
                                                    checked={getAnswer(q.id)?.includes(opt) || false}
                                                    onChange={(e) => {
                                                        const existing = getAnswer(q.id) || [];
                                                        let updated = [...existing];
                                                        if (e.target.checked) updated.push(opt);
                                                        else updated = updated.filter((v: any) => v !== opt);
                                                        saveAnswer(q.id, updated);
                                                    }}
                                                />
                                                <span className="text-slate-700 font-medium">{opt}</span>
                                            </label>
                                        ))}

                                    {/* SHORT ANSWER / REASONING / TRACE */}
                                    {["SHORT_ANSWER", "REASONING", "CODE_TRACE"].includes(type) && (
                                        <textarea
                                            value={getAnswer(q.id) || ""}
                                            onChange={(e) => saveAnswer(q.id, e.target.value)}
                                            placeholder="Type your answer here..."
                                            className="w-full min-h-[160px] p-4 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-y text-slate-700"
                                        />
                                    )}
                                </section>
                            );
                        })()}

                    {/* FOOTER */}
                    <div className="flex justify-between items-center mt-8 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
                        <Button
                            variant="outline"
                            onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                            disabled={currentStep === 0}
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
