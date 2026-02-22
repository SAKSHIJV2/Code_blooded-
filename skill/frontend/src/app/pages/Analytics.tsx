import React from "react";
import { useLocation } from "react-router";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  Cell,
  PieChart,
  Pie,
} from "recharts";
import {
  TrendingUp,
  Target,
  BarChart3,
  Layers,
  Brain,
  Award,
  Zap,
  Activity,
} from "lucide-react";
import { Badge, Button, cn } from "../components/ui";
import { motion } from "motion/react";

const COLORS = ["#1E3A8A", "#22D3EE", "#10B981", "#F59E0B", "#EF4444"];

export function Analytics() {
  const location = useLocation();
  const report = location.state?.report;

  /* -------- Dynamic Performance Trend -------- */
  const performanceTrend = report
    ? [
        {
          name: "Current",
          score: report.features?.accuracy ?? 0,
          avg: 75,
        },
      ]
    : [];

  /* -------- Dynamic Topic Distribution -------- */
  const topicDistribution = report
    ? Object.entries(report.topic_wise_performance_percent || {}).map(
        ([name, value]) => ({
          name,
          value,
        }),
      )
    : [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Advanced Analytics
          </h1>
          <p className="text-slate-500">
            A deep dive into your technical readiness metrics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            Download Report
          </Button>
          <Button variant="gradient" size="sm" className="gap-2">
            Upgrade to Pro
          </Button>
        </div>
      </header>

      {/* -------- Metric Cards -------- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Overall Score",
            val: `${report?.features?.accuracy ?? 0}%`,
            change: "",
            icon: Target,
            color: "text-primary-blue",
          },
          {
            label: "Conceptual",
            val: `${report?.features?.conceptual_score ?? 0}%`,
            change: "",
            icon: Brain,
            color: "text-accent-cyan",
          },
          {
            label: "Logical",
            val: `${report?.features?.logical_score ?? 0}%`,
            change: "",
            icon: Zap,
            color: "text-success-emerald",
          },
          {
            label: "Speed",
            val: `${report?.features?.speed_score ?? 0}%`,
            change: "",
            icon: Activity,
            color: "text-warning-amber",
          },
        ].map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-widest mb-3">
              <metric.icon size={14} className={metric.color} /> {metric.label}
            </div>
            <span className="text-2xl font-black text-slate-900">
              {metric.val}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* -------- Score Trend -------- */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold">Performance Trend</h3>
              <p className="text-sm text-slate-500">
                Score vs. Community Average
              </p>
            </div>
          </div>

          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceTrend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="score" stroke="#1E3A8A" />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#e2e8f0"
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* -------- Topic Skill Pie -------- */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold mb-8">Skill Distribution</h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={topicDistribution}
                  innerRadius={80}
                  outerRadius={100}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {topicDistribution.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-4xl font-black text-slate-900">
                {report?.features?.accuracy ?? 0}
              </span>
              <span className="text-xs font-bold text-slate-400 uppercase">
                Composite
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* -------- AI Insight -------- */}
      <div className="bg-slate-900 p-10 rounded-3xl text-white">
        <h3 className="text-2xl font-bold mb-4">AI Predictive Insight</h3>
        <p className="text-slate-400 leading-relaxed">
          {report?.summary ??
            "AI will generate insights based on your performance."}
        </p>
      </div>

      {/* -------- Benchmark -------- */}
      <div className="bg-white p-10 rounded-3xl border border-slate-200 shadow-sm">
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <BarChart3 size={24} className="text-primary-blue" />
          Competitive Benchmarking
        </h3>

        {[
          {
            label: "Logic Accuracy",
            val: report?.features?.logical_score ?? 0,
          },
          {
            label: "Conceptual",
            val: report?.features?.conceptual_score ?? 0,
          },
          {
            label: "Speed",
            val: report?.features?.speed_score ?? 0,
          },
        ].map((item, i) => (
          <div key={i} className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="font-bold text-slate-600">{item.label}</span>
              <span className="font-black text-slate-900">{item.val}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${item.val}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-primary-blue rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
