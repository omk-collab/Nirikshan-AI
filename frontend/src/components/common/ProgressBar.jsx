import React from 'react';

export default function ProgressBar({
  physical = 0,
  financial = null,
  showLabel = true,
  height = 'h-2.5',
  className = '',
}) {
  const isComparison = financial !== null;
  const gap = isComparison ? financial - physical : 0;
  const isSevereGap = gap > 25;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
          <div className="flex items-center gap-4">
            <span className="text-slate-300">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 mr-1.5"></span>
              Physical: <strong className="text-white">{physical}%</strong>
            </span>
            {isComparison && (
              <span className="text-slate-300">
                <span className="inline-block w-2 h-2 rounded-full bg-blue-400 mr-1.5"></span>
                Financial: <strong className="text-white">{financial}%</strong>
              </span>
            )}
          </div>
          {isComparison && gap !== 0 && (
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                isSevereGap
                  ? 'bg-rose-950/80 text-rose-300 border border-rose-800/50'
                  : gap > 10
                  ? 'bg-amber-950/80 text-amber-300 border border-amber-800/50'
                  : 'bg-slate-800 text-slate-300'
              }`}
            >
              Gap: {gap > 0 ? `+${gap.toFixed(1)}%` : `${gap.toFixed(1)}%`}
            </span>
          )}
        </div>
      )}

      {/* Progress track */}
      {!isComparison ? (
        <div className={`w-full bg-slate-800 rounded-full overflow-hidden ${height}`}>
          <div
            className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.min(100, Math.max(0, physical))}%` }}
          />
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* Physical progress line */}
          <div className={`w-full bg-slate-800/90 rounded-full overflow-hidden ${height}`}>
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, physical))}%` }}
            />
          </div>
          {/* Financial progress line */}
          <div className={`w-full bg-slate-800/90 rounded-full overflow-hidden ${height}`}>
            <div
              className={`h-full rounded-full transition-all duration-500 ease-out ${
                isSevereGap ? 'bg-rose-500' : gap > 10 ? 'bg-amber-500' : 'bg-blue-500'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, financial))}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
