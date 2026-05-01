import { motion } from 'framer-motion';

export function SkeletonTransaction() {
  return (
    <div className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-24 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-16 bg-slate-50 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <div className="h-4 w-16 bg-slate-100 rounded animate-pulse" />
        <div className="h-5 w-14 bg-slate-50 rounded-full animate-pulse" />
      </div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-10 h-10 border-4 border-brand-100 border-t-brand-600 rounded-full"
      />
    </div>
  );
}
