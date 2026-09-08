import React, { useState, useEffect } from 'react';
import {
  FileClock,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Terminal,
  Clock,
  ExternalLink
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { auditService } from '../services/auditService';

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');

  useEffect(() => {
    async function loadLogs() {
      try {
        const data = await auditService.getAuditLogs();
        setLogs(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (filterAction === 'ALL') return true;
    return l.action === filterAction;
  });

  const uniqueActions = Array.from(new Set(logs.map((l) => l.action)));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tamper-Evident Governance Audit Trail"
        subtitle="Immutable transaction logging of administrative risk re-computations, photo verification outcomes, and alert resolutions."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Audit Logs' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            Compliance Enforced
          </span>
        }
      />

      {/* Filter by Action */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[11px]">
            Filter Log Event:
          </span>
          <select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Logged Actions</option>
            {uniqueActions.map((act) => (
              <option key={act} value={act}>
                {act}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong className="text-white">{filteredLogs.length}</strong> events
        </span>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Event ID & Time</th>
                <th className="py-3 px-4">Authorized User / Actor</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Entity & Target ID</th>
                <th className="py-3 px-4">Audit Details</th>
                <th className="py-3 px-4 text-right">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-300">{log.id}</div>
                    <div className="text-slate-500 text-[10px] font-sans">
                      {new Date(log.timestamp).toLocaleString()}
                    </div>
                  </td>
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-white text-xs">{log.user}</div>
                    <span className="text-[10px] text-slate-400">{log.role}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 text-[10px] font-bold">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300">
                    <span className="text-slate-400 block text-[11px]">{log.entity}</span>
                    <strong className="text-white font-mono text-xs">{log.entityId}</strong>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-300 max-w-sm">
                    <p className="line-clamp-2 text-xs">{log.details}</p>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 text-[11px]">
                    {log.ipAddress}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
