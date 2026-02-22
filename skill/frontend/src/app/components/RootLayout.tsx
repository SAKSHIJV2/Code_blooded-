import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  User,
  LogOut,
  BrainCircuit,
  Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", path: "/app", icon: LayoutDashboard },
  { label: "Take Assessment", path: "/app/assessment", icon: BookOpen },
  { label: "Simulator", path: "/app/simulator", icon: BookOpen },
  { label: "Analytics", path: "/app/analytics", icon: BarChart3 },
  { label: "Profile", path: "/app/profile", icon: User },
];

export function RootLayout() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <BrainCircuit size={24} />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">
            SkillGate <span className="text-cyan-500 italic">AI</span>
          </span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-100 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavLink
            to="/"
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg hover:bg-red-50 text-slate-600 hover:text-red-600 transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Log out</span>
          </NavLink>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-gray-50">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}