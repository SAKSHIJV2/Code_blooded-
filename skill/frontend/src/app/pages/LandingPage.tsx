import React from 'react';
import { Link } from 'react-router';
import { 
  ArrowRight, 
  BrainCircuit, 
  CheckCircle2, 
  Code2, 
  BarChart, 
  Zap, 
  ShieldCheck,
  Globe,
  Star,
  BookOpen
} from 'lucide-react';
import { Button, cn, Badge } from '../components/ui';
import { motion } from 'motion/react';

export function LandingPage() {
  const features = [
    {
      title: "Weighted Scoring",
      desc: "Questions are dynamically weighted based on complexity and core logic.",
      icon: BarChart
    },
    {
      title: "Topic-wise Analytics",
      desc: "Granular breakdown of your performance across DSA, Python, and Java.",
      icon: Code2
    },
    {
      title: "AI Semantic Evaluation",
      desc: "Our AI evaluates your reasoning, not just your final code output.",
      icon: BrainCircuit
    },
    {
      title: "Interview Simulation Mode",
      desc: "Practice in a high-pressure environment that mimics real FAANG interviews.",
      icon: Zap
    }
  ];

  return (
    <div className="min-h-screen bg-bg-light text-slate-900 font-sans selection:bg-accent-cyan/30">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <nav className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary-blue rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary-blue/30">
              <BrainCircuit size={20} />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">SkillGate <span className="text-accent-cyan italic">AI</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-primary-blue transition-colors">How It Works</a>
            <a href="#features" className="text-sm font-medium text-slate-600 hover:text-primary-blue transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-primary-blue transition-colors">Pricing</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/app">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">Log In</Button>
            </Link>
            <Link to="/app">
              <Button variant="gradient" size="sm">Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-blue/5 border border-primary-blue/10 text-primary-blue text-xs font-bold uppercase tracking-wider mb-8">
              New: AI-Powered Java Assessment
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-slate-950 max-w-4xl mx-auto leading-[1.1] mb-8">
              Measure Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-blue to-accent-cyan">Real Technical</span> Readiness
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-12 leading-relaxed">
              AI-powered evaluation beyond MCQs. We analyze your logic, edge-case reasoning, and code efficiency to give you an industry-ready score.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/app/assessment">
                <Button variant="gradient" size="lg" className="w-full sm:w-auto gap-2 group">
                  Start Assessment <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                View Demo Report
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-20 w-full max-w-5xl rounded-2xl overflow-hidden border border-slate-200 shadow-2xl bg-white"
          >
            <div className="aspect-video bg-slate-900/5 flex items-center justify-center relative">
               <div className="absolute inset-0 bg-gradient-to-tr from-primary-blue/5 to-accent-cyan/5"></div>
               <img 
                 src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2070" 
                 alt="SkillGate Dashboard" 
                 className="w-full h-full object-cover opacity-90 mix-blend-overlay"
               />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-sm border border-slate-100 animate-bounce">
                     <div className="w-12 h-12 rounded-full bg-success-emerald/10 flex items-center justify-center text-success-emerald">
                        <ShieldCheck size={24} />
                     </div>
                     <div className="text-left">
                        <p className="text-sm font-bold">AI Assessment Complete</p>
                        <p className="text-xs text-slate-500">Readiness: Industry Ready (92%)</p>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-slate-600">Three simple steps to measure your professional readiness.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              { 
                step: "01", 
                title: "Take Skill Gate", 
                desc: "Challenge yourself with custom assessments in Python, Java, or DSA.",
                icon: BookOpen
              },
              { 
                step: "02", 
                title: "AI Evaluates Thinking", 
                desc: "Our neural engines analyze your logic patterns and problem-solving approach.",
                icon: BrainCircuit
              },
              { 
                step: "03", 
                title: "Get Readiness Report", 
                desc: "Receive a detailed breakdown and professional readiness classification.",
                icon: BarChart
              }
            ].map((item, idx) => (
              <div key={idx} className="relative p-8 rounded-2xl bg-bg-light border border-slate-200 hover:border-primary-blue/30 transition-all group">
                <span className="text-5xl font-black text-slate-100 absolute -top-4 left-6 group-hover:text-primary-blue/5 transition-colors">{item.step}</span>
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-blue shadow-sm border border-slate-100 mb-6">
                    <item.icon size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
                Designed for the <span className="text-primary-blue italic">Next Generation</span> of Engineers
              </h2>
              <div className="grid sm:grid-cols-2 gap-8">
                {features.map((feature, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="w-10 h-10 bg-accent-cyan/10 rounded-lg flex items-center justify-center text-accent-cyan">
                      <feature.icon size={20} />
                    </div>
                    <h4 className="font-bold text-lg">{feature.title}</h4>
                    <p className="text-sm text-slate-600 leading-relaxed">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-primary-blue rounded-3xl -rotate-3 scale-95 opacity-5"></div>
              <div className="relative bg-white border border-slate-200 rounded-3xl p-8 shadow-xl">
                 <div className="flex items-center justify-between mb-8">
                    <span className="font-bold">Topic Analysis</span>
                    <Badge variant="ready">AI Verified</Badge>
                 </div>
                 <div className="space-y-6">
                    {[
                      { label: "Data Structures", val: 88, color: "bg-primary-blue" },
                      { label: "Algorithms", val: 92, color: "bg-accent-cyan" },
                      { label: "System Design", val: 76, color: "bg-slate-400" },
                      { label: "Logic Flow", val: 95, color: "bg-success-emerald" }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-slate-600">{item.label}</span>
                          <span className="font-bold">{item.val}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${item.val}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            className={cn("h-full rounded-full", item.color)}
                          ></motion.div>
                        </div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-24">
          <div className="col-span-2 md:col-span-1">
             <div className="flex items-center gap-2 mb-6">
                <BrainCircuit size={24} className="text-primary-blue" />
                <span className="text-xl font-bold">SkillGate <span className="text-accent-cyan italic">AI</span></span>
             </div>
             <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Redefining technical evaluation with neural logic assessment. Trusted by over 100+ global tech organizations.
             </p>
             <div className="flex gap-4">
               {/* Social placeholders */}
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-blue transition-colors cursor-pointer">
                  <Globe size={16} />
               </div>
               <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:text-primary-blue transition-colors cursor-pointer">
                  <Star size={16} />
               </div>
             </div>
          </div>
          
          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-400">Platform</h5>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary-blue transition-colors">Skill Assessments</a></li>
              <li><a href="#" className="hover:text-primary-blue transition-colors">Practice Library</a></li>
              <li><a href="#" className="hover:text-primary-blue transition-colors">Interview Prep</a></li>
              <li><a href="#" className="hover:text-primary-blue transition-colors">Roadmaps</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-400">Company</h5>
            <ul className="space-y-4 text-sm text-slate-600">
              <li><a href="#" className="hover:text-primary-blue transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-blue transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-blue transition-colors">Legal & Privacy</a></li>
              <li><a href="#" className="hover:text-primary-blue transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h5 className="font-bold mb-6 text-sm uppercase tracking-wider text-slate-400">Contact</h5>
            <ul className="space-y-4 text-sm text-slate-600">
              <li>support@skillgate.ai</li>
              <li>+1 (555) 123-4567</li>
              <li className="flex items-center gap-2 text-primary-blue font-bold">
                <CheckCircle2 size={16} />
                Uptime: 99.9%
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto pt-12 mt-12 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-slate-400 text-sm">&copy; 2026 SkillGate AI. All rights reserved.</p>
           <div className="flex gap-8 text-xs font-medium text-slate-400">
             <a href="#" className="hover:text-slate-900">Privacy Policy</a>
             <a href="#" className="hover:text-slate-900">Terms of Service</a>
             <a href="#" className="hover:text-slate-900">Cookie Policy</a>
           </div>
        </div>
      </footer>
    </div>
  );
}
