import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Wifi, WifiOff, ArrowRight } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { cn } from '../utils/cn';

export function SendMoney() {
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  const [isOffline, setIsOffline] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const { sendMoney } = useTransactions();
  const navigate = useNavigate();

  const handleSend = async (e) => {
    e.preventDefault();
    if (!receiver || !amount) return;

    setIsSending(true);
    try {
      const data = { receiver, amount: Number(amount), mode: isOffline ? 'offline' : 'online' };
      const txn = await sendMoney(data);
      // Navigate to status page if we get a transaction ID
      if (txn && txn.id) {
        navigate(`/status/${txn.id}`);
      } else {
        navigate('/history');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to send money. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="p-4 pb-24 max-w-md mx-auto min-h-screen"
    >
      <header className="py-6">
        <h1 className="text-2xl font-bold text-slate-900">Send Money</h1>
        <p className="text-slate-500 text-sm mt-1">Transfer funds instantly, even offline.</p>
      </header>

      <form onSubmit={handleSend} className="space-y-6">
        <div className="space-y-4">
          {/* Receiver Input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
              Paying to (UPI / Phone)
            </label>
            <input
              type="text"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              placeholder="e.g. john@upi or 9876543210"
              className="w-full bg-transparent text-lg font-medium text-slate-900 outline-none placeholder:text-slate-300"
              required
            />
          </div>

          {/* Amount Input */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all flex items-center">
            <span className="text-3xl text-slate-400 font-light mr-2">₹</span>
            <div className="flex-1">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1 block">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-transparent text-4xl font-bold text-slate-900 outline-none placeholder:text-slate-200"
                required
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Offline Toggle */}
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn("p-2 rounded-full", isOffline ? "bg-amber-100 text-amber-600" : "bg-emerald-100 text-emerald-600")}>
              {isOffline ? <WifiOff className="w-5 h-5" /> : <Wifi className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-semibold text-slate-800">{isOffline ? 'Offline Mesh Mode' : 'Online Mode'}</p>
              <p className="text-xs text-slate-500">{isOffline ? 'Uses nearby devices to route txn' : 'Uses standard internet'}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsOffline(!isOffline)}
            className={cn(
              "relative inline-flex h-7 w-12 items-center rounded-full transition-colors focus:outline-none",
              isOffline ? "bg-amber-500" : "bg-emerald-500"
            )}
          >
            <span
              className={cn(
                "inline-block h-5 w-5 transform rounded-full bg-white transition-transform",
                isOffline ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={isSending || !receiver || !amount}
          className="w-full bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 disabled:text-slate-500 text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all active:scale-[0.98] premium-shadow"
        >
          {isSending ? (
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
          ) : (
            <>
              Send ₹{amount || '0'} <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}
