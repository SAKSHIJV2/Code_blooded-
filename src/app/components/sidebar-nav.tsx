import { Home, Map, BarChart3, User, BrainCircuit, Target, Lock } from 'lucide-react';

interface SidebarNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isJourneyUnlocked: boolean;
}

export function SidebarNav({ activeTab, setActiveTab, isJourneyUnlocked }: SidebarNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'assessment', label: 'Take Assessment', icon: Target },
    { id: 'journey', label: 'Developer Journey', icon: Map, locked: !isJourneyUnlocked },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <nav className="w-64 bg-white border-r border-gray-200 h-full p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="bg-[#1C3A8A] text-white p-2.5 rounded-2xl shadow-sm">
          <BrainCircuit className="w-7 h-7" strokeWidth={2} />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0B192C]">
            SkillGate <span className="text-[#00D2FF] italic">AI</span>
          </h1>
        </div>
      </div>

      <div className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (!item.locked) setActiveTab(item.id);
              }}
              className={`
                w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all
                ${item.locked ? 'opacity-50 cursor-not-allowed' : ''}
                ${isActive && !item.locked
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
                }
              `}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </div>
              {item.locked && <Lock className="w-4 h-4 text-gray-400" />}
            </button>
          );
        })}
      </div>

      <div className="mt-auto pt-8 border-t border-gray-200">
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <p className="text-xs text-gray-500 mb-1">Current Level</p>
          <p className="font-semibold text-gray-900">Level 3 - Developer</p>
          <div className="mt-2 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-3/5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>
        </div>
      </div>
    </nav>
  );
}
