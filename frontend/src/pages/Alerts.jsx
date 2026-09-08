import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Check,
  X,
  FileSearch
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import { alertService } from '../services/alertService';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAlerts() {
      try {
        const data = await alertService.getAlerts();
        setAlerts(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, []);

  const handleStatusChange = async (alertId, newStatus) => {
    try {
      const updated = await alertService.updateAlertStatus(alertId, newStatus);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, status: newStatus } : a))
      );
    } catch (e) {
      console.error(e);
    }
  };

  const filteredAlerts = alerts.filter((a) => {
    if (activeTab === 'ALL') return true;
    if (activeTab === 'RESOLVED') return a.status === 'RESOLVED';
    return a.severity === activeTab && a.status !== 'RESOLVED';
  });

  const countBySeverity = {
    CRITICAL: alerts.filter((a) => a.severity === 'CRITICAL' && a.status !== 'RESOLVED').length,
    HIGH: alerts.filter((a) => a.severity === 'HIGH' && a.status !== 'RESOLVED').length,
    MEDIUM: alerts.filter((a) => a.severity === 'MEDIUM' && a.status !== 'RESOLVED').length,
    RESOLVED: alerts.filter((a) => a.status === 'RESOLVED').length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative Risk Alerts Center"
        subtitle="Automated supervisory alerts triggered by cost escalation, timeline breaches, and geospatial mismatches."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Alerts' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-800">
            {countBySeverity.CRITICAL} Unresolved Critical
          </span>
        }
      />

      {/* Filter Tabs by Severity */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all ${
            activeTab === 'ALL'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          All Active Alerts ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('CRITICAL')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'CRITICAL'
              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
          Critical ({countBySeverity.CRITICAL})
        </button>
        <button
          onClick={() => setActiveTab('HIGH')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'HIGH'
              ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          High ({countBySeverity.HIGH})
        </button>
        <button
          onClick={() => setActiveTab('MEDIUM')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'MEDIUM'
              ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          Medium ({countBySeverity.MEDIUM})
        </button>
        <button
          onClick={() => setActiveTab('RESOLVED')}
          className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
            activeTab === 'RESOLVED'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Resolved Archive ({countBySeverity.RESOLVED})
        </button>
      </div>

      {/* Alerts List */}
      <div className="space-y-3.5">
        {filteredAlerts.length === 0 ? (
          <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
            No alerts found in this category.
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-panel rounded-2xl p-5 border transition-all ${
                alert.severity === 'CRITICAL'
                  ? 'border-rose-900/60 bg-rose-950/15 hover:border-rose-700/60'
                  : alert.severity === 'HIGH'
                  ? 'border-orange-900/50 bg-orange-950/15 hover:border-orange-700/60'
                  : alert.status === 'RESOLVED'
                  ? 'border-emerald-900/40 bg-slate-900/40 opacity-70'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left details */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono font-bold text-slate-300">{alert.id}</span>
                    <span className="text-slate-500">&bull;</span>
                    <Link
                      to={`/projects/${alert.projectId}`}
                      className="font-bold text-white hover:text-indigo-400 hover:underline"
                    >
                      {alert.projectId}
                    </Link>
                    <span className="text-slate-500">&bull;</span>
                    <span className="text-slate-400">
                      {alert.state} ({alert.district})
                    </span>
                    <RiskBadge level={alert.severity} size="sm" />
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        alert.status === 'NEW'
                          ? 'bg-blue-950 text-blue-300 border border-blue-800'
                          : alert.status === 'REVIEWING'
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : alert.status === 'RESOLVED'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {alert.status}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{alert.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                    {alert.reason}
                  </p>

                  <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-1">
                    <span>
                      Triggered: <strong>{new Date(alert.timestamp).toLocaleDateString()}</strong>
                    </span>
                    <span>
                      Supervisory Action: <strong className="text-indigo-300">{alert.suggestedAction}</strong>
                    </span>
                  </div>
                </div>

                {/* Right action controls */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-800">
                  {alert.status !== 'REVIEWING' && alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'REVIEWING')}
                      className="px-3 py-1.5 rounded-lg bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-800 text-xs font-semibold transition-colors"
                    >
                      Review
                    </button>
                  )}

                  {alert.status !== 'RESOLVED' && (
                    <button
                      onClick={() => handleStatusChange(alert.id, 'RESOLVED')}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-800 text-xs font-semibold transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Resolve
                    </button>
                  )}

                  <Link
                    to={`/projects/${alert.projectId}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                  >
                    Dossier
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
