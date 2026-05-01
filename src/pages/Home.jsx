import { motion } from 'framer-motion';
import { BalanceCard } from '../components/BalanceCard';
import { TransactionCard } from '../components/TransactionCard';
import { useTransactions } from '../hooks/useTransactions';
import { SkeletonTransaction } from '../components/Loader';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Home() {
  const { transactions, loading } = useTransactions();

  // Show only top 3 recent transactions
  const recentTransactions = transactions.slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 pb-24 max-w-md mx-auto space-y-8"
    >
      {/* Header */}
      <header className="flex items-center justify-between pt-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Hello, User 👋</h1>
          <p className="text-sm text-slate-500">Ready to send money offline?</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold">
          U
        </div>
      </header>

      {/* Balance Card Section */}
      <section>
        <BalanceCard />
      </section>

      {/* Recent Transactions */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <Link to="/history" className="text-sm font-medium text-brand-600 flex items-center gap-1">
            View All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="space-y-3">
          {loading ? (
            <>
              <SkeletonTransaction />
              <SkeletonTransaction />
              <SkeletonTransaction />
            </>
          ) : recentTransactions.length > 0 ? (
            recentTransactions.map((txn, index) => (
              <TransactionCard key={txn.id} transaction={txn} delay={index * 0.1} />
            ))
          ) : (
            <div className="text-center py-8 text-slate-500 bg-white rounded-2xl border border-slate-100">
              No recent transactions
            </div>
          )}
        </div>
      </section>
    </motion.div>
  );
}
