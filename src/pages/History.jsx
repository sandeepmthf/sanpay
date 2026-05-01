import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionCard } from '../components/TransactionCard';
import { SkeletonTransaction } from '../components/Loader';

const filters = ['All', 'Success', 'Pending', 'Failed'];

export function History() {
  const { transactions, loading } = useTransactions();
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredTxns = transactions.filter((txn) => {
    if (activeFilter === 'All') return true;
    return txn.status.toUpperCase() === activeFilter.toUpperCase();
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 pb-24 max-w-md mx-auto min-h-screen"
    >
      <header className="py-6">
        <h1 className="text-2xl font-bold text-slate-900">History</h1>
        <p className="text-slate-500 text-sm mt-1">Your past transactions</p>
      </header>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto hide-scrollbar pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter
                ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="space-y-3">
        {loading ? (
          <>
            <SkeletonTransaction />
            <SkeletonTransaction />
            <SkeletonTransaction />
            <SkeletonTransaction />
          </>
        ) : filteredTxns.length > 0 ? (
          filteredTxns.map((txn, index) => (
            <TransactionCard key={txn.id} transaction={txn} delay={index * 0.05} />
          ))
        ) : (
          <div className="text-center py-12 px-4 text-slate-500 bg-white rounded-2xl border border-slate-100 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">📭</span>
            </div>
            <p className="font-medium text-slate-700">No transactions found</p>
            <p className="text-sm mt-1">Try changing the filter or send some money.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
