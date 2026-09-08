import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
  Filter
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import KpiCard from '../components/common/KpiCard';
import ProgressBar from '../components/common/ProgressBar';
import RiskBadge from '../components/common/RiskBadge';
import { projectService } from '../services/projectService';

export default function ProgressMonitoring() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterGapOnly, setFilterGapOnly] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await projectService.getProjects();
        setProjects(res.data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const displayedProjects = filterGapOnly
    ? projects.filter((p) => p.progressGap > 20)
    : [...projects].sort((a, b) => b.progressGap - a.progressGap);

  const gapChartData = displayedProjects.slice(0, 6).map((p) => ({
    name: p.projectId.replace('MPLADS-', ''),
    physical: p.physicalProgress,
    financial: p.financialProgress,
    gap: p.progressGap,
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-white mb-1">{label}</p>
          <p className="text-emerald-400 font-semibold">Physical Progress: {payload[0]?.value}%</p>
          <p className="text-blue-400 font-semibold">Financial Progress: {payload[1]?.value}%</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Physical vs Financial Progress Monitoring"
        subtitle="Identifying milestone divergence where financial disbursement exceeds verified physical construction on the ground."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Progress Monitoring' }]}
        actions={
          <button
            onClick={() => setFilterGapOnly(!filterGapOnly)}
            className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-colors ${
              filterGapOnly
                ? 'bg-rose-950 text-rose-300 border-rose-800'
                : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            {filterGapOnly ? 'Showing High Gap Only (>20%)' : 'Filter High Gap Only'}
          </button>
        }
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Critical Progress Gaps"
          value="118 Works"
          subtitle="Financial >> Physical (>25%)"
          icon={AlertTriangle}
          variant="critical"
        />
        <KpiCard
          title="Delayed Past Schedule"
          value="245 Works"
          subtitle="Avg Delay: 84 Days"
          icon={Clock}
          variant="warning"
        />
        <KpiCard
          title="Synchronized Progress"
          value="892 Works"
          subtitle="Gap within allowable ±5%"
          icon={CheckCircle2}
          variant="success"
        />
        <KpiCard
          title="Max Recorded Gap"
          value="+61.8%"
          subtitle="MPLADS-BR-2024-007 (Patna)"
          icon={TrendingUp}
          variant="critical"
        />
      </div>

      {/* Progress Gap Visualization Bar Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Top Progress Divergence Outliers (%)</h3>
            <p className="text-xs text-slate-400">Comparing Verified Physical Milestones vs Financial Disbursal Percentage</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-slate-300">Physical Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-slate-300">Financial Progress</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={gapChartData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="physical" fill="#10b981" name="Physical Progress" radius={[4, 4, 0, 0]} />
              <Bar dataKey="financial" fill="#3b82f6" name="Financial Progress" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Progress Gap Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Project Progress Divergence Register</h3>
            <p className="text-xs text-slate-400">Calculated formula: Progress Gap = Financial Progress (%) - Physical Progress (%)</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Project ID & Details</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4 min-w-[200px]">Progress Comparison</th>
                <th className="py-3 px-4 text-center">Progress Gap</th>
                <th className="py-3 px-4">Delay Days</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {displayedProjects.map((p) => (
                <tr key={p.projectId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/projects/${p.projectId}`} className="font-bold text-white hover:text-indigo-400">
                      {p.projectId}
                    </Link>
                    <div className="text-slate-400 truncate max-w-sm">{p.projectName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{p.state}</td>
                  <td className="py-3 px-4">
                    <ProgressBar physical={p.physicalProgress} financial={p.financialProgress} height="h-2" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-block px-2 py-0.5 rounded font-bold ${
                        p.progressGap > 25
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : p.progressGap > 10
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {p.progressGap > 0 ? `+${p.progressGap}%` : `${p.progressGap}%`}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={p.delayDays > 60 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                      {p.delayDays > 0 ? `${p.delayDays} Days` : '0 (On Time)'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/projects/${p.projectId}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      Audit <ArrowUpRight className="w-3 h-3" />
                    </Link>
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
