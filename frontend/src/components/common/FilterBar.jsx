import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

export default function FilterBar({
  search = '',
  onSearchChange,
  riskLevel = 'ALL',
  onRiskChange,
  state = 'ALL',
  onStateChange,
  status = 'ALL',
  onStatusChange,
  workType = 'ALL',
  onWorkTypeChange,
  states = [],
  workTypes = [],
  onReset,
}) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* Search input */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search projects by ID, description, contractor, MP..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Dropdown Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Risk Filter */}
          <select
            value={riskLevel}
            onChange={(e) => onRiskChange(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Risk Tiers</option>
            <option value="CRITICAL">🔴 Critical Risk</option>
            <option value="HIGH">🟠 High Risk</option>
            <option value="MEDIUM">🟡 Medium Risk</option>
            <option value="LOW">🟢 Low Risk</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="DELAYED">Delayed</option>
            <option value="COMPLETED">Completed</option>
          </select>

          {/* State Filter */}
          {states.length > 0 && (
            <select
              value={state}
              onChange={(e) => onStateChange(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All States</option>
              {states.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          {/* Work Type Filter */}
          {workTypes.length > 0 && (
            <select
              value={workType}
              onChange={(e) => onWorkTypeChange(e.target.value)}
              className="px-3 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All Work Types</option>
              {workTypes.map((wt) => (
                <option key={wt} value={wt}>
                  {wt}
                </option>
              ))}
            </select>
          )}

          {/* Reset Button */}
          {onReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-300 rounded-lg transition-colors"
              title="Reset all filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
