import React from 'react';
import {
  ResponsiveContainer, BarChart, Bar, Tooltip as RechartsTooltip, XAxis, YAxis, CartesianGrid, Legend
} from 'recharts';
import {
  Play, CheckSquare, TrendingUp, Flame, Timer, CalendarDays, ArrowRight, Zap, Bug, Clock, Activity
} from 'lucide-react';

export function Dashboard() {
  return (
    <div className="space-y-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Project Dashboard</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Sprint: <span className="text-primary-blue font-bold font-mono">#DELTA-04</span> | End Date: Feb 25
          </p>
        </div>
        <button className="bg-primary-blue hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-primary-blue/20">
          <Play size={18} fill="currentColor" /> Resume Simulation
        </button>
      </div>

      {/* GRID LAYOUT FOR METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* 1. WEEKLY PERFORMANCE GRAPH (8 cols) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Activity className="text-primary-blue" /> Weekly Performance
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <RechartsTooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="tasks" name="Tasks Completed" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={32} />
                <Bar dataKey="bugs" name="Bugs Fixed" fill="#10b981" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. BUG FIX SPEED (4 cols) */}
        <div className="md:col-span-4 space-y-6 flex flex-col justify-between">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex-1 flex flex-col justify-center border-t-4 border-t-red-500">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center border border-red-100">
                <Bug size={24} />
              </div>
            </div>
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Average Bug Fix Time</h3>
            <div className="text-5xl font-black text-slate-900 mb-8">1.8<span className="text-2xl text-slate-400"> hrs</span></div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                <span className="text-sm font-bold text-emerald-900 flex items-center gap-2"><Zap size={16} /> Fastest Fix</span>
                <span className="font-black text-emerald-600">22 mins</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-sm font-bold text-slate-700 flex items-center gap-2"><Clock size={16} /> Slowest Fix</span>
                <span className="font-black text-slate-600">5.2 hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. TOTAL TASKS COMPLETED (4 cols) */}
        <div className="md:col-span-4 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-primary-blue/30 transition-colors group">
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <CheckSquare size={24} />
            </div>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Total Tasks Completed</h3>
          <div className="text-5xl font-black text-slate-900 group-hover:text-primary-blue transition-colors">142</div>
          <p className="text-sm text-slate-400 mt-2 font-medium">Across 8 simulated sprints</p>
        </div>

        {/* 4. ACTIVITY & CONSISTENCY (8 cols) */}
        <div className="md:col-span-8 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-primary-blue/30 transition-colors flex flex-col">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-6">Developer Streak</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            <div className="flex flex-col justify-center items-center text-center p-4 bg-orange-50 rounded-2xl border border-orange-100 h-full">
              <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center mb-3">
                <Flame size={24} className="fill-current" />
              </div>
              <span className="font-bold text-orange-900 text-sm mb-1">Coding Streak</span>
              <span className="text-2xl font-black text-orange-600">6 Days</span>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-4 bg-blue-50 rounded-2xl border border-blue-100 h-full">
              <div className="w-12 h-12 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center mb-3">
                <Timer size={24} />
              </div>
              <span className="font-bold text-blue-900 text-sm mb-1">This Week</span>
              <span className="text-2xl font-black text-blue-600">9.5 hrs</span>
            </div>

            <div className="flex flex-col justify-center items-center text-center p-4 bg-emerald-50 rounded-2xl border border-emerald-100 h-full">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-3">
                <CalendarDays size={24} />
              </div>
              <span className="font-bold text-emerald-900 text-sm mb-1">Active Days</span>
              <span className="text-2xl font-black text-emerald-600">5 / 7</span>
            </div>
          </div>
        </div>

        {/* 5. SKILL PROGRESSION (12 cols) */}
        <div className="md:col-span-12 bg-white border border-slate-200 rounded-3xl p-8 shadow-sm hover:border-primary-blue/30 transition-colors">
          <div className="flex justify-between items-end mb-6">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Skill Progression</h3>
            <div className="flex items-center gap-7 pr-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <span>Before</span>
              <span>Now</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SkillProgressionRow skill="Debugging" before={52} now={72} />
            <SkillProgressionRow skill="Code Quality" before={48} now={65} />
            <SkillProgressionRow skill="Problem Solving" before={60} now={80} />
          </div>
        </div>

      </div>
    </div>
  );
}

// --- SUB-COMPONENTS --- //

function SkillProgressionRow({ skill, before, now }: { skill: string, before: number, now: number }) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all group">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shadow-sm">
          <Zap size={14} className="text-slate-400 group-hover:text-primary-blue transition-colors" />
        </div>
        <span className="font-bold text-slate-700">{skill}</span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="text-sm font-black text-slate-400 w-10 text-right">{before}%</span>
        <ArrowRight size={14} className="text-emerald-500" />
        <span className="text-lg font-black text-emerald-600 w-12 text-right">{now}%</span>
      </div>
    </div>
  );
}

// --- MOCK DATA --- //

const weeklyData = [
  { day: 'Mon', tasks: 4, bugs: 1 },
  { day: 'Tue', tasks: 6, bugs: 2 },
  { day: 'Wed', tasks: 5, bugs: 0 },
  { day: 'Thu', tasks: 8, bugs: 3 },
  { day: 'Fri', tasks: 6, bugs: 1 },
  { day: 'Sat', tasks: 3, bugs: 0 },
  { day: 'Sun', tasks: 2, bugs: 0 },
];