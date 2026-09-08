import React from 'react';

export default function RiskScoreRing({ score, size = 120, strokeWidth = 10, showDetails = true }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const clampedScore = Math.min(100, Math.max(0, score || 0));
  const offset = circumference - (clampedScore / 100) * circumference;

  let strokeColor = '#10b981'; // LOW
  let levelText = 'LOW';
  let textColor = 'text-emerald-400';
  let badgeBg = 'bg-emerald-950/80 border-emerald-700/50 text-emerald-400';

  if (clampedScore > 80) {
    strokeColor = '#ef4444'; // CRITICAL
    levelText = 'CRITICAL';
    textColor = 'text-rose-400';
    badgeBg = 'bg-rose-950/80 border-rose-600/60 text-rose-300 animate-pulse';
  } else if (clampedScore > 60) {
    strokeColor = '#f97316'; // HIGH
    levelText = 'HIGH';
    textColor = 'text-orange-400';
    badgeBg = 'bg-orange-950/80 border-orange-600/50 text-orange-300';
  } else if (clampedScore > 30) {
    strokeColor = '#f59e0b'; // MEDIUM
    levelText = 'MEDIUM';
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-950/80 border-amber-600/50 text-amber-300';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg] transform">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score ring */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className={`text-3xl font-extrabold tracking-tight ${textColor}`}>
            {clampedScore}
          </span>
          <span className="text-[10px] uppercase font-semibold text-slate-400">
            / 100
          </span>
        </div>
      </div>

      {showDetails && (
        <div className="mt-2.5">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${badgeBg}`}>
            {levelText} RISK
          </span>
        </div>
      )}
    </div>
  );
}
