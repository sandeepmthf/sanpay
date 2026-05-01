import { Home, Send, Activity, History } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/send', label: 'Send', icon: Send },
  { path: '/network', label: 'Mesh', icon: Activity },
  { path: '/history', label: 'History', icon: History },
];

export function Navbar() {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 bg-gradient-to-t from-white via-white to-transparent pointer-events-none z-50">
      <div className="max-w-md mx-auto pointer-events-auto">
        <div className="glass-panel rounded-2xl flex justify-around items-center p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-16 h-14 rounded-xl text-slate-500 hover:text-slate-900 transition-colors"
              >
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute inset-0 bg-brand-50 rounded-xl"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                <div className="relative z-10 flex flex-col items-center gap-1">
                  <Icon className={cn("w-5 h-5", isActive ? "text-brand-600" : "text-slate-400")} />
                  <span className={cn("text-[10px] font-medium", isActive ? "text-brand-700" : "text-slate-500")}>
                    {item.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
