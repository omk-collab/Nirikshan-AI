import React from 'react';

export default function RiskBadge({ level, size = 'md', className = '' }) {
  const normLevel = (level || 'LOW').toUpperCase();

  const config = {
    LOW: {
      label: 'LOW RISK',
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      border: 'border-emerald-600/40',
      dot: 'bg-emerald-400',
    },
    MEDIUM: {
      label: 'MEDIUM RISK',
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      border: 'border-amber-600/40',
      dot: 'bg-amber-400',
    },
    HIGH: {
      label: 'HIGH RISK',
      bg: 'bg-orange-950/60',
      text: 'text-orange-400',
      border: 'border-orange-600/40',
      dot: 'bg-orange-400',
    },
    CRITICAL: {
      label: 'CRITICAL',
      bg: 'bg-rose-950/80',
      text: 'text-rose-400',
      border: 'border-rose-500/60',
      dot: 'bg-rose-400 animate-pulse',
    },
  };

  const current = config[normLevel] || config.LOW;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-2 font-medium',
    lg: 'text-sm px-3 py-1.5 gap-2 font-semibold',
  }[size] || sizeClasses.md;

  return (
    <span
      className={`inline-flex items-center rounded-full border ${current.bg} ${current.text} ${current.border} ${sizeClasses} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${current.dot}`}></span>
      {current.label}
    </span>
  );
}
