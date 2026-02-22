import React, { useState } from "react";
import { useLocation, Link } from "react-router";
import {
  Brain,
  Award,
  ChevronDown,
  ChevronUp,
  BarChart4,
  ChevronLeft,
} from "lucide-react";
import { Badge, Button, cn } from "../components/ui";
import { motion, AnimatePresence } from "motion/react";
import RadarChart from "../components/RadarChart";

export function Evaluation() {
  const location = useLocation();
  const report = location.state?.report;
  const [expanded, setExpanded] = useState<number | null>(null);

  const accuracy = report?.features?.accuracy ?? 0;

  const questions = [
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
    <div className="space-y-8 max-w-6xl mx-auto pb-20">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-blue text-sm font-bold mb-4"
          >
            <ChevronLeft size={16} /> Back to Dashboard
          </Link>

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
            <div className="text-7xl font-black text-primary-blue mb-2">
              {accuracy.toFixed(0)}%
            </div>

            <p className="text-slate-500 mb-6">
              Overall Performance
            </p>

            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-success-emerald text-white font-bold">
              <Award size={18} />
              {accuracy > 80 ? "Industry Ready" : "Needs Improvement"}
            </div>
          </div>
        </motion.div>

        {/* AI SUMMARY + CHART */}
        <div className="md:col-span-7 space-y-6">

          <div className="bg-white p-6 rounded-3xl border shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain size={20} className="text-primary-blue" />
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
          <BarChart4 size={20} className="text-primary-blue" />
          <h3 className="font-bold text-xl">
            Detailed AI Insights
          </h3>
        </div>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="bg-white border rounded-xl overflow-hidden"
          >
            <button
              onClick={() =>
                setExpanded(expanded === idx ? null : idx)
              }
              className="w-full p-6 flex justify-between"
            >
              <div>
                <h4 className="font-bold">{q.title}</h4>
                <p className="text-sm text-slate-500">
                  Click to view insights
                </p>
              </div>

              {expanded === idx ? (
                <ChevronUp />
              ) : (
                <ChevronDown />
              )}
            </button>

            <AnimatePresence>
              {expanded === idx && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "auto" }}
                  exit={{ height: 0 }}
                  className="p-6 border-t bg-slate-50"
                >
                  <div className="space-y-4">

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
        <Link to="/app">
          <Button variant="outline">
            Return to Dashboard
          </Button>
        </Link>
      </footer>
    </div>
  );
}