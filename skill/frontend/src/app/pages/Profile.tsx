import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  Camera, 
  CheckCircle2, 
  Globe, 
  Award,
  BookOpen,
  ArrowUpRight,
  LogOut,
  Mail,
  Linkedin,
  Github
} from 'lucide-react';
import { Badge, Button, cn } from '../components/ui';
import { motion } from 'motion/react';

export function Profile() {
  const [activeTab, setActiveTab] = useState('account');

  const profileData = {
    name: "Alex Johnson",
    role: "Senior Full Stack Candidate",
    email: "alex.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=2070",
    stats: [
      { label: "Assessments", val: 12, icon: BookOpen },
      { label: "Badges Earned", val: 8, icon: Award },
      { label: "Readiness Score", val: "88%", icon: Shield },
    ]
  };

  const tabs = [
    { id: 'account', label: 'Account Settings', icon: User },
    { id: 'security', label: 'Security & Privacy', icon: Shield },
    { id: 'billing', label: 'Subscription & Billing', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-blue/5 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
           <div className="relative group">
              <div className="w-32 h-32 rounded-3xl overflow-hidden border-4 border-white shadow-xl">
                 <img 
                    src={profileData.avatar} 
                    alt={profileData.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                 />
              </div>
              <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary-blue text-white rounded-xl flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                 <Camera size={18} />
              </button>
           </div>
           <div>
              <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                 <h1 className="text-3xl font-bold tracking-tight text-slate-900">{profileData.name}</h1>
                 <Badge variant="ready" className="py-1 px-4 text-xs font-bold uppercase tracking-widest">Industry Ready</Badge>
              </div>
              <p className="text-slate-500 font-medium mb-6">{profileData.role}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                 <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary-blue transition-colors cursor-pointer group">
                    <Mail size={16} /> {profileData.email}
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary-blue transition-colors cursor-pointer">
                    <Linkedin size={16} /> /in/alexjohnson
                 </div>
                 <div className="flex items-center gap-2 text-sm text-slate-400 hover:text-primary-blue transition-colors cursor-pointer">
                    <Github size={16} /> @alexj-dev
                 </div>
              </div>
           </div>
        </div>

        <div className="flex gap-4 relative z-10 self-center md:self-auto">
           <Button variant="outline" className="gap-2">Edit Profile</Button>
           <Button variant="gradient" className="gap-2 shadow-none">Upgrade Account</Button>
        </div>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-2">
           {tabs.map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-blue text-white shadow-lg shadow-primary-blue/20 translate-x-1" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                 <tab.icon size={18} />
                 {tab.label}
              </button>
           ))}
           <div className="pt-6 mt-6 border-t border-slate-200">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-error-red hover:bg-error-red/5 transition-colors">
                 <LogOut size={18} />
                 Log out
              </button>
           </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-8">
           {/* Summary Stats Area */}
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {profileData.stats.map((stat, i) => (
                 <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                       <div className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-primary-blue border border-slate-100">
                          <stat.icon size={20} />
                       </div>
                       <ArrowUpRight size={16} className="text-slate-300" />
                    </div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</p>
                 </div>
              ))}
           </div>

           <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                 <h3 className="text-xl font-bold">Profile Details</h3>
                 <Button variant="ghost" size="sm" className="text-primary-blue font-bold">Save Changes</Button>
              </div>
              <div className="p-8 space-y-8">
                 <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                       <input 
                         type="text" 
                         defaultValue={profileData.name} 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                       <input 
                         type="email" 
                         defaultValue={profileData.email} 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company / University</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Stanford University" 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue transition-all"
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Location</label>
                       <input 
                         type="text" 
                         defaultValue="San Francisco, CA" 
                         className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue transition-all"
                       />
                    </div>
                 </div>
                 
                 <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Short Bio</label>
                    <textarea 
                      rows={4} 
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-blue/10 focus:border-primary-blue transition-all"
                      placeholder="Tell us about your technical background..."
                    ></textarea>
                 </div>

                 <div className="pt-8 border-t border-slate-100">
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                       <CheckCircle2 size={18} className="text-success-emerald" /> 
                       Public Profile Options
                    </h4>
                    <div className="flex flex-col sm:flex-row gap-8">
                       <div className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked id="show-readiness" className="w-5 h-5 accent-primary-blue rounded-md border-slate-300" />
                          <label htmlFor="show-readiness" className="text-sm font-medium text-slate-600">Show readiness level to recruiters</label>
                       </div>
                       <div className="flex items-center gap-3">
                          <input type="checkbox" defaultChecked id="show-score" className="w-5 h-5 accent-primary-blue rounded-md border-slate-300" />
                          <label htmlFor="show-score" className="text-sm font-medium text-slate-600">Show overall assessment score</label>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
