import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import { cn } from '../utils/cn';

export function StatusBadge({ status }) {
  const isSuccess = status === 'SUCCESS';
  const isPending = status === 'PENDING';
  const isFailed = status === 'FAILED';

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        isSuccess && 'bg-green-50 text-green-700 border-green-200',
        isPending && 'bg-amber-50 text-amber-700 border-amber-200',
        isFailed && 'bg-red-50 text-red-700 border-red-200'
      )}
    >
      {isSuccess && <CheckCircle2 className="w-3.5 h-3.5" />}
      {isPending && <Clock className="w-3.5 h-3.5" />}
      {isFailed && <XCircle className="w-3.5 h-3.5" />}
      <span className="capitalize">{status.toLowerCase()}</span>
    </div>
  );
}
