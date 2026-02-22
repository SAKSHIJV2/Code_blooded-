import React from 'react';
import { 
  History, 
  Search, 
  ChevronRight, 
  Calendar, 
  Clock, 
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { Badge, Button, cn } from '../components/ui';
import { motion } from 'motion/react';
import { Link } from 'react-router';

const attempts = [
  {
    id: "ATT-782",
    title: "Python Mastery Challenge",
    date: "20 Feb 2026",
    score: 88,
    status: "Completed",
    duration: "42 mins",
    readiness: "Industry Ready"
  },
  {
    id: "ATT-654",
    title: "Data Structures Fundamentals",
    date: "12 Feb 2026",
    score: 74,
    status: "Completed",
    duration: "38 mins",
    readiness: "Almost Ready"
  },
  {
    id: "ATT-512",
    title: "Java Core Concepts",
    date: "05 Feb 2026",
    score: 92,
    status: "Completed",
    duration: "45 mins",
    readiness: "Industry Ready"
  },
  {
    id: "ATT-409",
    title: "Algorithm Design Sprint",
    date: "28 Jan 2026",
    score: 61,
    status: "Completed",
    duration: "50 mins",
    readiness: "Developing"
  }
];

export function Attempts() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assessment History</h1>
          <p className="text-slate-500">Track your progress and review previous evaluations.</p>
        </div>
        <div className="relative max-w-sm w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search attempts..." 
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue transition-all"
          />
        </div>
      </header>

      <div className="grid gap-4">
        {attempts.map((attempt, idx) => (
          <motion.div 
            key={attempt.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-primary-blue/30 transition-all"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-primary-blue group-hover:bg-primary-blue group-hover:text-white transition-colors">
                  <History size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{attempt.title}</h3>
                    <Badge 
                      variant={attempt.readiness === "Industry Ready" ? "ready" : attempt.readiness === "Almost Ready" ? "almost" : "developing"}
                    >
                      {attempt.readiness}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {attempt.date}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} /> {attempt.duration}</span>
                    <span className="text-slate-300">|</span>
                    <span className="font-medium text-slate-700">ID: {attempt.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</p>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-slate-900">{attempt.score}%</span>
                    <div className="w-1.5 h-8 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "w-full rounded-full transition-all duration-1000",
                          attempt.score > 85 ? "bg-success-emerald" : attempt.score > 70 ? "bg-accent-cyan" : "bg-warning-amber"
                        )}
                        style={{ height: `${attempt.score}%`, marginTop: `${100 - attempt.score}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link to="/app/evaluation">
                    <Button variant="outline" size="sm" className="gap-2">
                      <FileText size={16} /> Report
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" className="w-9 h-9 p-0 rounded-full">
                    <ChevronRight size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-primary-blue/5 border border-primary-blue/10 p-8 rounded-3xl relative overflow-hidden group">
        <div className="absolute -right-10 -bottom-10 opacity-5 group-hover:scale-110 transition-transform">
           <History size={200} />
        </div>
        <div className="relative z-10 max-w-2xl">
           <h3 className="text-xl font-bold text-primary-blue mb-2">Want to improve your score?</h3>
           <p className="text-slate-600 mb-6">
             Our AI suggests focusing on <span className="font-bold text-slate-900">Dynamic Programming</span> and <span className="font-bold text-slate-900">Graph Theory</span> based on your last 3 attempts.
           </p>
           <Link to="/app/assessment">
             <Button variant="gradient" className="gap-2">
               Take Practice Test <ArrowUpRight size={18} />
             </Button>
           </Link>
        </div>
      </div>
    </div>
  );
}
