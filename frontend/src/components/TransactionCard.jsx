import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { StatusBadge } from './StatusBadge';

export function TransactionCard({ transaction, delay = 0 }) {
  // Simulating direction based on amount or random for demo purposes
  // In a real app, you'd check if the user is sender or receiver
  const isDebit = true; 

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className={`p-2.5 rounded-full ${isDebit ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {isDebit ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
        </div>
        <div>
          <p className="font-semibold text-slate-800">{transaction.receiver || 'Unknown'}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {new Date(transaction.date).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1.5">
        <span className="font-bold text-slate-900">
          {isDebit ? '-' : '+'}₹{transaction.amount}
        </span>
        <StatusBadge status={transaction.status} />
      </div>
    </motion.div>
  );
}
