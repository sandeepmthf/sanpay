import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, XCircle, ArrowLeft, Activity } from 'lucide-react';
import { api } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { PageLoader } from '../components/Loader';

export function TransactionStatus() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [txn, setTxn] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let interval;
    const fetchStatus = async () => {
      try {
        const response = await api.getTransactionStatus(id);
        setTxn(response.data);
        setLoading(false);
        
        // Stop polling if we reach a terminal state
        if (response.data.status === 'SUCCESS' || response.data.status === 'FAILED') {
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Status check failed", error);
        // We handle fallback mock in interceptor, so we won't usually hit this in demo mode
        setLoading(false);
      }
    };

    fetchStatus();
    // Poll every 2.5 seconds
    interval = setInterval(fetchStatus, 2500);

    return () => clearInterval(interval);
  }, [id]);

  if (loading && !txn) return <PageLoader />;
  if (!txn) return <div className="p-8 text-center text-slate-500">Transaction not found</div>;

  const isTerminal = txn.status === 'SUCCESS' || txn.status === 'FAILED';
  const progressPercent = txn.status === 'SUCCESS' ? 100 : (txn.status === 'FAILED' ? 100 : 60);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-4 pb-24 max-w-md mx-auto min-h-screen bg-white"
    >
      <header className="py-4 flex items-center mb-8">
        <button onClick={() => navigate('/')} className="p-2 -ml-2 text-slate-400 hover:text-slate-700 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 ml-2">Transaction Status</h1>
      </header>

      <div className="flex flex-col items-center justify-center text-center space-y-6">
        {/* Status Icon Animation */}
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={`w-24 h-24 rounded-full flex items-center justify-center ${
              txn.status === 'SUCCESS' ? 'bg-green-100 text-green-500' :
              txn.status === 'FAILED' ? 'bg-red-100 text-red-500' :
              'bg-amber-100 text-amber-500'
            }`}
          >
            {txn.status === 'SUCCESS' ? <CheckCircle2 className="w-12 h-12" /> :
             txn.status === 'FAILED' ? <XCircle className="w-12 h-12" /> :
             <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
               <Activity className="w-12 h-12" />
             </motion.div>}
          </motion.div>
          {/* Subtle ping effect while pending */}
          {txn.status === 'PENDING' && (
             <span className="absolute inset-0 rounded-full border-4 border-amber-400 opacity-20 animate-ping" />
          )}
        </div>

        <div>
          <h2 className="text-3xl font-bold text-slate-900">₹{txn.amount}</h2>
          <p className="text-slate-500 mt-1">To {txn.receiver}</p>
        </div>

        <StatusBadge status={txn.status} />

        {/* Progress Bar */}
        <div className="w-full max-w-xs mt-8">
          <div className="flex justify-between text-xs text-slate-400 font-medium mb-2 px-1">
            <span>Initiated</span>
            <span>Routing</span>
            <span>{isTerminal ? 'Done' : 'Processing'}</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '10%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeInOut' }}
              className={`h-full rounded-full ${
                txn.status === 'SUCCESS' ? 'bg-green-500' :
                txn.status === 'FAILED' ? 'bg-red-500' :
                'bg-amber-500'
              }`}
            />
          </div>
        </div>
      </div>

      <div className="mt-12 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-sm">
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-slate-500">Transaction ID</span>
          <span className="font-mono text-slate-700">{txn.id}</span>
        </div>
        <div className="flex justify-between py-2 border-b border-slate-200">
          <span className="text-slate-500">Date & Time</span>
          <span className="text-slate-700">{new Date(txn.date).toLocaleString()}</span>
        </div>
        <div className="flex justify-between py-2">
          <span className="text-slate-500">Network Mode</span>
          <span className="text-slate-700 capitalize">{txn.mode || 'Offline Mesh'}</span>
        </div>
      </div>

      {isTerminal && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => navigate('/')}
          className="w-full mt-8 bg-brand-50 text-brand-700 hover:bg-brand-100 py-4 rounded-2xl font-bold text-lg transition-colors"
        >
          Back to Home
        </motion.button>
      )}
    </motion.div>
  );
}
