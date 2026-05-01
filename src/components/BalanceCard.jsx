import { ArrowRight, QrCode, Send, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function BalanceCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-900 text-white p-6 premium-shadow"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-white/10 blur-2xl"></div>
      <div className="absolute bottom-0 left-0 -ml-8 -mb-8 w-24 h-24 rounded-full bg-brand-400/20 blur-xl"></div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-indigo-100 text-sm font-medium mb-1">Available Balance</p>
            <h2 className="text-4xl font-bold tracking-tight">₹12,450.00</h2>
          </div>
          <div className="bg-white/10 p-2 rounded-xl backdrop-blur-sm">
            <ShieldCheck className="w-6 h-6 text-indigo-100" />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => navigate('/send')}
            className="flex-1 bg-white text-brand-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg shadow-black/10 active:scale-95 transition-transform"
          >
            <Send className="w-4 h-4" />
            Send Money
          </button>
          <button className="flex-none bg-indigo-800/50 hover:bg-indigo-700/50 text-white p-3 rounded-xl backdrop-blur-sm border border-indigo-500/30 active:scale-95 transition-transform">
            <QrCode className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
