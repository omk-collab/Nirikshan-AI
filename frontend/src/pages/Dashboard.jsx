import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  FolderKanban,
  IndianRupee,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ShieldAlert,
  Activity,
  ArrowUpRight,
  TrendingUp,
  BrainCircuit,
  Sparkles,
  ChevronRight,
  Layers,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line,
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import KpiCard from '../components/common/KpiCard';
import RiskBadge from '../components/common/RiskBadge';
import ProgressBar from '../components/common/ProgressBar';
import { dashboardService } from '../services/dashboardService';
import { projectService } from '../services/projectService';

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [criticalProjects, setCriticalProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [sumData, projData] = await Promise.all([
          dashboardService.getSummary(),
          projectService.getProjects({ riskLevel: 'CRITICAL', limit: 5 })
        ]);
        setSummary(sumData);
        setCriticalProjects(projData.data || []);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-medium">Aggregating National MPLADS Intelligence...</p>
        </div>
      </div>
    );
  }

  const {
    kpis = {},
    riskDistribution = [],
    projectStatus = [],
    expenditureTrend = [],
    stateWiseProjects = [],
    quickInsights = []
  } = summary || {};

  // Custom tooltips
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-2.5 shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-white mb-1">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} style={{ color: item.color }} className="font-semibold">
              {item.name}: {item.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Page Title & Quick Actions */}
      <PageHeader
        title="National MPLADS Intelligence Dashboard"
        subtitle="Real-time macro monitoring, financial progress divergence, and AI risk anomaly index."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-400 border border-indigo-700/50 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Analytical Stream
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/risk"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-rose-950/50 hover:bg-rose-900/50 text-rose-300 border border-rose-800/40 text-xs font-semibold transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              Critical Queue ({kpis.criticalProjects ?? 0})
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-colors"
            >
              <FolderKanban className="w-3.5 h-3.5" />
              All Projects
            </Link>
          </div>
        }
      />

      {/* 8 Primary KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4">
        <KpiCard
          title="Total Sanctioned Projects"
          value={kpis.totalProjects?.toLocaleString() ?? '0'}
          subtitle="Across 28 States & UTs"
          icon={FolderKanban}
          variant="default"
          onClick={() => navigate('/projects')}
        />
        <KpiCard
          title="Total Sanctioned Budget"
          value="₹4,825 Cr"
          subtitle="FY 2023-2024 Cumulative"
          icon={IndianRupee}
          variant="indigo"
          onClick={() => navigate('/financial-analysis')}
        />
        <KpiCard
          title="Cumulative Expenditure"
          value="₹3,612 Cr"
          subtitle="74.8% Aggregate Utilization"
          icon={TrendingUp}
          variant="default"
          onClick={() => navigate('/financial-analysis')}
        />
        <KpiCard
          title="Completed Works"
          value={kpis.completedProjects?.toLocaleString() ?? '0'}
          subtitle="60.2% Completion Rate"
          icon={CheckCircle2}
          variant="success"
          onClick={() => navigate('/projects?status=COMPLETED')}
        />
        <KpiCard
          title="Delayed Beyond Schedule"
          value={kpis.delayedProjects?.toLocaleString() ?? '0'}
          subtitle="16.5% of Active Portfolio"
          icon={Clock}
          variant="warning"
          onClick={() => navigate('/progress-monitoring')}
        />
        <KpiCard
          title="High Risk Projects"
          value={kpis.highRiskProjects?.toLocaleString() ?? '0'}
          subtitle="Requires District Vigilance"
          icon={AlertTriangle}
          variant="high"
          onClick={() => navigate('/risk')}
        />
        <KpiCard
          title="Critical Risk Projects"
          value={kpis.criticalProjects?.toLocaleString() ?? '0'}
          subtitle="Immediate Audit Priority"
          icon={ShieldAlert}
          variant="critical"
          onClick={() => navigate('/risk')}
        />
        <KpiCard
          title="National Risk Index"
          value={`${kpis.averageRiskScore ?? 0} / 100`}
          subtitle="Weighted Multimodal Score"
          icon={Activity}
          variant="default"
          onClick={() => navigate('/risk')}
        />
      </div>

      {/* AI Monitoring Quick Insights Banner (Section 14) */}
      <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-950/40 via-slate-900/90 to-slate-900/70 p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-900/60 border border-indigo-700/50 text-indigo-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                AI Monitoring Insights
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-900/60 text-indigo-300 border border-indigo-700/50">
                  Automated Synthesis
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Continuous anomaly detection across financial ledgers, progress logs, and geotag submissions.
              </p>
            </div>
          </div>
          <Link
            to="/alerts"
            className="hidden sm:flex items-center gap-1 text-xs font-semibold text-indigo-400 hover:text-indigo-300"
          >
            Review all alerts <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {quickInsights.map((insight) => (
            <div
              key={insight.id}
              className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${
                insight.type === 'critical'
                  ? 'bg-rose-950/30 border-rose-900/40 hover:bg-rose-950/50'
                  : insight.type === 'warning'
                  ? 'bg-amber-950/30 border-amber-900/40 hover:bg-amber-950/50'
                  : 'bg-slate-900/70 border-slate-800 hover:bg-slate-800/80'
              }`}
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                  insight.type === 'critical'
                    ? 'bg-rose-500 animate-pulse'
                    : insight.type === 'warning'
                    ? 'bg-amber-500'
                    : 'bg-blue-400'
                }`}
              />
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {insight.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Row of Charts: Risk Distribution & Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution Donut Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Risk Distribution</h3>
              <p className="text-xs text-slate-400">All 1,482 analyzed projects</p>
            </div>
            <Link to="/risk" className="text-xs text-indigo-400 hover:underline">
              Inspect
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-xs">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between px-2 py-1 rounded bg-slate-900/50">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.level}</span>
                </div>
                <span className="font-bold text-white">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Project Milestone Status</h3>
              <p className="text-xs text-slate-400">Execution pipeline status</p>
            </div>
            <Link to="/progress-monitoring" className="text-xs text-indigo-400 hover:underline">
              View
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {projectStatus.map((entry, index) => (
                    <Cell key={`status-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Delayed works: <strong className="text-amber-400">245</strong></span>
            <span>Completed: <strong className="text-emerald-400">892</strong></span>
          </div>
        </div>

        {/* State-wise Projects Bar Chart */}
        <div className="glass-panel rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Top State Allocations</h3>
              <p className="text-xs text-slate-400">Project volumes & high-risk count</p>
            </div>
            <Link to="/map" className="text-xs text-indigo-400 hover:underline">
              GIS Map
            </Link>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateWiseProjects.slice(0, 5)} layout="vertical" margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis dataKey="state" type="category" stroke="#64748b" tick={{ fontSize: 10 }} width={75} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="projects" fill="#6366f1" radius={[0, 4, 4, 0]} name="Projects" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
            <span>Highest: <strong>UP (312)</strong></span>
            <span>Most Critical: <strong>UP (8) & MH (7)</strong></span>
          </div>
        </div>
      </div>

      {/* Expenditure Trend Timeline */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Financial Trajectory & Drawdown (₹ Crores)</h3>
            <p className="text-xs text-slate-400">Cumulative Sanctioned vs Actual Tranche Expenditure over 12 Months</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-indigo-500 rounded" />
              <span className="text-slate-300">Sanctioned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-emerald-500 rounded" />
              <span className="text-slate-300">Disbursed</span>
            </div>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={expenditureTrend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="sanctionedGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="expenditureGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="sanctioned" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#sanctionedGrad)" name="Sanctioned (₹ Cr)" />
              <Area type="monotone" dataKey="expenditure" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#expenditureGrad)" name="Expenditure (₹ Cr)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Critical Priority Queue Highlight Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              Critical Priority Inspection Queue
            </h3>
            <p className="text-xs text-slate-400">Projects with elevated multi-factor risk scores requiring supervisory field audit</p>
          </div>
          <Link
            to="/projects?riskLevel=CRITICAL"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            Explore all critical <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Project ID & Description</th>
                <th className="py-3 px-4">State / District</th>
                <th className="py-3 px-4">Sanctioned / Exp</th>
                <th className="py-3 px-4 min-w-[180px]">Physical vs Financial</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {criticalProjects.map((p) => (
                <tr key={p.projectId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-bold text-white">
                      <Link to={`/projects/${p.projectId}`} className="hover:text-indigo-400">
                        {p.projectId}
                      </Link>
                    </div>
                    <div className="text-slate-400 truncate max-w-xs">{p.projectName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{p.state}</div>
                    <div className="text-slate-500 text-[11px]">{p.district}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-200">
                    <div className="font-semibold">₹{(p.sanctionedAmount / 100000).toFixed(1)} L</div>
                    <div className="text-slate-400 text-[11px]">Exp: ₹{(p.expenditure / 100000).toFixed(1)} L</div>
                  </td>
                  <td className="py-3 px-4">
                    <ProgressBar physical={p.physicalProgress} financial={p.financialProgress} height="h-2" />
                  </td>
                  <td className="py-3 px-4 text-center font-extrabold text-rose-400 text-sm">
                    {p.overallRisk}
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/projects/${p.projectId}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
                    >
                      Audit
                      <ChevronRight className="w-3 h-3" />
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
