import { useState, useEffect } from "react";
import { fetchData } from "../../services/firestore";
import { 
  Users, 
  ShoppingBag, 
  FileText, 
  Eye, 
  ArrowUpRight, 
  Clock,
  Layout
} from "lucide-react";
import { motion } from "motion/react";
import { SCHEMAS } from "../../config/schemas";

export default function AdminDashboardHome() {
  const [stats, setStats] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const collections = Object.keys(SCHEMAS).filter(k => k !== 'settings' && k !== 'comments');
        const counts: any = {};
        for (const col of collections) {
          const data = await fetchData(col);
          counts[col] = data.length;
        }
        setStats(counts);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const statCards = [
    { label: "Total Collections", value: stats.projects || 0, icon: Layout, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Trainings", value: stats.trainings || 0, icon: FileText, color: "text-gold-500", bg: "bg-gold-500/10" },
    { label: "Services", value: stats.services || 0, icon: Eye, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome back, Admin</h1>
        <p className="text-slate-500 text-sm mt-1">Here is what's happening with your website today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-3xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                 <ArrowUpRight size={14} />
                 <span>+12%</span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
            <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">Quick Actions</h3>
           </div>
            <div className="grid grid-cols-2 gap-4">
              {Object.keys(SCHEMAS).filter(k => k !== 'settings' && k !== 'comments').slice(0, 4).map((key) => (
                <a 
                  key={key}
                  href={`/admin/${key}`}
                  className="p-4 bg-slate-950 border border-slate-800 rounded-2xl hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-left group"
                >
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 group-hover:text-pink-500">Manage</p>
                  <p className="text-white font-bold">{SCHEMAS[key]?.title}</p>
                </a>
              ))}
           </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
           <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-white">System Status</h3>
              <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                 Operational
              </div>
           </div>
           <div className="space-y-6">
              {[
                { label: "Database", status: "Connected", icon: Clock },
                { label: "Storage", status: "Available", icon: Clock },
                { label: "Auth Service", status: "Active", icon: Clock },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500">
                      <item.icon size={20} />
                    </div>
                    <span className="font-bold text-sm text-slate-300">{item.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">{item.status}</span>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
