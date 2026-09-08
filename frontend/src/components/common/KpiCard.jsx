import React from 'react';

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  variant = 'default',
  onClick,
}) {
  const variantStyles = {
    default: 'border-slate-800 bg-slate-900/70 hover:border-slate-700',
    critical: 'border-rose-900/50 bg-rose-950/20 hover:border-rose-700/60',
    high: 'border-orange-900/50 bg-orange-950/20 hover:border-orange-700/60',
    warning: 'border-amber-900/50 bg-amber-950/20 hover:border-amber-700/60',
    success: 'border-emerald-900/50 bg-emerald-950/20 hover:border-emerald-700/60',
    indigo: 'border-indigo-900/50 bg-indigo-950/20 hover:border-indigo-700/60',
  };

  const iconColors = {
    default: 'text-slate-400 bg-slate-800/80',
    critical: 'text-rose-400 bg-rose-950/60 border border-rose-800/40',
    high: 'text-orange-400 bg-orange-950/60 border border-orange-800/40',
    warning: 'text-amber-400 bg-amber-950/60 border border-amber-800/40',
    success: 'text-emerald-400 bg-emerald-950/60 border border-emerald-800/40',
    indigo: 'text-indigo-400 bg-indigo-950/60 border border-indigo-800/40',
  };

  return (
    <div
      onClick={onClick}
      className={`relative rounded-xl border p-5 transition-all duration-200 backdrop-blur-md ${
        variantStyles[variant] || variantStyles.default
      } ${onClick ? 'cursor-pointer hover:-translate-y-0.5 shadow-lg' : ''}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white">
            {value}
          </p>
        </div>
        {Icon && (
          <div className={`p-2.5 rounded-lg ${iconColors[variant] || iconColors.default}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 flex items-center gap-2 text-xs">
          {trend && (
            <span
              className={`font-semibold ${
                trendPositive ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {trend}
            </span>
          )}
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
        </div>
      )}
    </div>
  );
}
