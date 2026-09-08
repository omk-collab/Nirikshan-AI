import React from 'react';

export default function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs = [],
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/80 pb-5">
      <div>
        {breadcrumbs.length > 0 && (
          <nav className="mb-1.5 flex items-center gap-1.5 text-xs text-slate-400">
            {breadcrumbs.map((crumb, idx) => (
              <span key={idx} className="flex items-center gap-1.5">
                {idx > 0 && <span>/</span>}
                {crumb.href ? (
                  <a href={crumb.href} className="hover:text-slate-200">
                    {crumb.label}
                  </a>
                ) : (
                  <span className="text-slate-300 font-medium">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            {title}
          </h1>
          {badge}
        </div>

        {subtitle && (
          <p className="mt-1 text-xs sm:text-sm text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {actions && <div className="flex items-center gap-2.5">{actions}</div>}
    </div>
  );
}
