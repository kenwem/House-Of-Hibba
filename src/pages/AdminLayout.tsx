import React, { useState } from "react";
import { Link, useNavigate, useLocation, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useIdleTimer } from "../hooks/useIdleTimer";
import { 
  LayoutDashboard, 
  FileText, 
  ShoppingBag, 
  GraduationCap, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Image,
  Users,
  MessageSquare,
  Briefcase,
  Star,
  Calendar,
  Layers,
  ChevronRight,
  ArrowLeft,
  Film
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { siteConfig } from "../config/siteConfig";

const navItems = [
  { group: "Overview", items: [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
  ]},
  { group: "Collections & Inventory", items: [
    { name: "Collections Gallery", path: "/admin/projects", icon: Image },
  ]},
  { group: "Services & Training", items: [
    { name: "Trainings", path: "/admin/trainings", icon: GraduationCap },
    { name: "Services", path: "/admin/services", icon: Briefcase },
  ]},
  { group: "System", items: [
    { name: "Settings", path: "/admin/settings", icon: Settings },
  ]}
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // 30 minute idle timeout
  useIdleTimer(30 * 60 * 1000);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#565656] flex text-slate-300">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 bg-[#121212] border border-[#252525] rounded-lg text-white"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 left-0 h-screen bg-[#121212] border-r border-[#252525] transition-all duration-300 z-40 ${
          isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Logo Area */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500 flex flex-shrink-0 items-center justify-center text-white font-bold">
                H
              </div>
              {isSidebarOpen && (
                <span className="font-bold text-white tracking-tight truncate">
                  HIBBA ADMIN
                </span>
              )}
            </div>
          </div>

          {/* Nav Links */}
          <div className="px-4 py-4 border-b border-slate-800">
             <Link 
               to="/" 
               className="flex items-center gap-3 px-3 py-2.5 bg-slate-950 border border-slate-800 hover:border-pink-500/50 rounded-xl text-slate-400 hover:text-white transition-all group"
             >
                <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                {isSidebarOpen && <span className="text-sm font-bold">Go To Website</span>}
             </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-grow overflow-y-auto p-4 space-y-8 scrollbar-hide">
            {navItems.map((group, idx) => (
              <div key={idx} className="space-y-2">
                {isSidebarOpen && (
                  <h3 className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {group.group}
                  </h3>
                )}
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all group ${
                          isActive 
                            ? 'bg-pink-500/10 text-pink-500 border border-pink-500/20' 
                            : 'hover:bg-slate-800 text-slate-400 hover:text-white border border-transparent'
                        }`}
                      >
                        <item.icon size={20} className={isActive ? 'text-pink-500' : 'text-slate-500 group-hover:text-pink-400 transition-colors'} />
                        {isSidebarOpen && <span className="font-medium text-sm truncate">{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer / User */}
          <div className="p-4 border-t border-slate-800 space-y-2">
            {isSidebarOpen && (
              <div className="px-3 py-2 mb-2 flex items-center gap-3 bg-slate-950/50 rounded-xl border border-slate-800">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-xs">
                  {user?.email?.[0].toUpperCase()}
                </div>
                <div className="text-xs truncate">
                  <p className="font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
                </div>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-500 transition-all group"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span className="font-medium text-sm">Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow min-w-0 bg-[#565656] min-h-screen">
        <div className="max-w-6xl mx-auto p-4 md:p-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
