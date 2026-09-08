import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  ArrowUpRight,
  TrendingDown,
  PieChart as PieIcon,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ComposedChart,
  Line,
  CartesianGrid,
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import KpiCard from '../components/common/KpiCard';
import RiskBadge from '../components/common/RiskBadge';
import { projectService } from '../services/projectService';
import { dashboardService } from '../services/dashboardService';

export default function FinancialAnalysis() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Filter projects with cost deviation
  const costDeviatedProjects = [...projects]
    .sort((a, b) => b.costDeviation - a.costDeviation);

  // Top cost outliers for chart
  const costComparisonData = costDeviatedProjects.slice(0, 6).map((p) => ({
    name: p.projectId.replace('MPLADS-', ''),
    estimated: (p.estimatedCost / 100000).toFixed(1),
    actual: (p.actualCost / 100000).toFixed(1),
    sanctioned: (p.sanctionedAmount / 100000).toFixed(1),
    deviation: p.costDeviation.toFixed(1),
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-slate-700 bg-slate-900/95 p-3 shadow-xl text-xs backdrop-blur-md">
          <p className="font-bold text-white mb-1.5">{label}</p>
          {payload.map((item, idx) => (
            <p key={idx} style={{ color: item.color }} className="font-semibold">
              {item.name}: ₹{item.value} Lakhs
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Intelligence & Cost Deviation Analysis"
        subtitle="Tracking expenditure velocities, cost overruns against baseline estimates, and fiscal risk factors."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Financial Analysis' }]}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <KpiCard
          title="Total Sanctioned"
          value="₹4,825.0 Cr"
          subtitle="Sanctioned Portfolios"
          icon={IndianRupee}
          variant="indigo"
        />
        <KpiCard
          title="Actual Incurred"
          value="₹3,612.0 Cr"
          subtitle="74.8% Expenditure Ratio"
          icon={TrendingUp}
          variant="default"
        />
        <KpiCard
          title="Severe Cost Escalations"
          value="42 Projects"
          subtitle=">30% Above Tender Estimates"
          icon={AlertTriangle}
          variant="critical"
        />
        <KpiCard
          title="Avg Fiscal Deviation"
          value="+14.8%"
          subtitle="Above Standard Schedule of Rates"
          icon={TrendingDown}
          variant="warning"
        />
      </div>

      {/* Cost Deviation Comparison Chart */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Top Cost Deviation Outliers (₹ Lakhs)</h3>
            <p className="text-xs text-slate-400">Comparing Estimated Tender Cost vs Reported Actual Cost</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-blue-500" />
              <span className="text-slate-300">Estimated Cost</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-rose-500" />
              <span className="text-slate-300">Actual Cost</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={costComparisonData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
              <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="estimated" fill="#3b82f6" name="Estimated Cost" radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" fill="#ef4444" name="Actual Cost" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Cost Escalation & Fiscal Discrepancy Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-amber-400" />
              Cost Overrun & Financial Discrepancy Registry
            </h3>
            <p className="text-xs text-slate-400">Calculated formula: ((Actual Cost - Estimated Cost) / Estimated Cost) &times; 100</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Project ID & Name</th>
                <th className="py-3 px-4">Estimated Cost</th>
                <th className="py-3 px-4">Actual Cost</th>
                <th className="py-3 px-4">Cost Deviation %</th>
                <th className="py-3 px-4">Expenditure Ratio</th>
                <th className="py-3 px-4 text-center">Financial Risk</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {costDeviatedProjects.map((p) => (
                <tr key={p.projectId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/projects/${p.projectId}`} className="font-bold text-white hover:text-indigo-400">
                      {p.projectId}
                    </Link>
                    <div className="text-slate-400 truncate max-w-sm">{p.projectName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    ₹{(p.estimatedCost / 100000).toFixed(2)} L
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    ₹{(p.actualCost / 100000).toFixed(2)} L
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        p.costDeviation > 25
                          ? 'text-rose-400'
                          : p.costDeviation > 10
                          ? 'text-amber-400'
                          : 'text-emerald-400'
                      }`}
                    >
                      +{p.costDeviation.toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    {p.expenditureRatio.toFixed(1)}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-rose-400 text-sm">
                      {p.riskBreakdown?.financialRisk || 50} / 100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/projects/${p.projectId}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      Details <ArrowUpRight className="w-3 h-3" />
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
