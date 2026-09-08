import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  AlertTriangle,
  TrendingUp,
  BrainCircuit,
  Sliders,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Activity,
  Layers,
  BarChart2
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import { riskService } from '../services/riskService';
import { projectService } from '../services/projectService';

export default function RiskDashboard() {
  const [riskData, setRiskData] = useState(null);
  const [criticalProjects, setCriticalProjects] = useState([]);
  const [anomalies, setAnomalies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [overview, crit, anom] = await Promise.all([
          riskService.getRiskOverview(),
          riskService.getCriticalProjects(),
          riskService.getIsolationForestAnomalies(),
        ]);
        setRiskData(overview);
        setCriticalProjects(crit);
        setAnomalies(anom);
      } catch (err) {
        console.error("Failed to load risk intelligence", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading || !riskData) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading AI Risk Models & Anomaly Index...</p>
        </div>
      </div>
    );
  }

  const { riskWeights, riskFactorImpactAnalysis } = riskData;

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Risk Intelligence & Anomaly Dashboard"
        subtitle="Unified multi-factor risk weighting, Isolation Forest anomaly classification, and supervisory triage queue."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Risk Intelligence' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-950/80 text-rose-300 border border-rose-700/50 flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            34 Critical Flags
          </span>
        }
      />

      {/* Top Banner: Weighting Architecture (Section 35) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-400" />
              Unified Risk Engine Scoring Weights (0–100 Scale)
            </h3>
            <p className="text-xs text-slate-400">
              Prototype calibrated weights defined in Master Specification (Section 35)
            </p>
          </div>
          <span className="text-[11px] font-semibold text-slate-400">
            Sum: 100% Weight Factor
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {riskWeights.map((rw) => (
            <div
              key={rw.name}
              className="p-3 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700 transition-colors"
            >
              <span className="text-lg font-extrabold text-white">{rw.weight}%</span>
              <p className="text-xs font-semibold text-indigo-300 mt-0.5">{rw.name}</p>
              <p className="text-[10px] text-slate-400 line-clamp-2 mt-1 leading-tight">
                {rw.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Isolation Forest Unsupervised Anomaly Detection Results (Section 33) */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-400">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Isolation Forest Anomaly Detection (Unsupervised)
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                  Statistical Outliers
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Trained across 10 multi-dimensional project vectors (cost deviation, progress mismatch, delay, sanction amount, remaining funds).
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anomalies.map((anom) => (
            <div
              key={anom.projectId}
              className="p-4 rounded-xl border border-rose-900/50 bg-rose-950/20 hover:bg-rose-950/30 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-bold text-rose-300">
                    {anom.projectId}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-rose-950 text-[10px] font-bold text-rose-400 border border-rose-800">
                    Anomaly ({anom.anomalyConfidence})
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-white mt-1.5 line-clamp-2">
                  {anom.projectName}
                </h4>

                <div className="mt-3 space-y-1.5 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Top Contributing Z-Score Vectors:
                  </span>
                  {anom.topContributingFeatures?.map((f, idx) => (
                    <div key={idx} className="flex justify-between items-center text-[11px] p-1.5 rounded bg-slate-900/70">
                      <span className="text-slate-300">{f.feature}:</span>
                      <span className="font-bold text-rose-400">
                        {f.value} <span className="text-slate-500 font-normal">(z={f.zScore})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-rose-900/40 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Risk Score: <strong className="text-rose-400 text-sm">{anom.riskScore}</strong>
                </span>
                <Link
                  to={`/projects/${anom.projectId}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                >
                  Examine <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Critical Projects Priority Queue Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              High & Critical Risk Priority Registry
            </h3>
            <p className="text-xs text-slate-400">Sorted by composite unified risk index</p>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {criticalProjects.length} Flagged Works
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Project ID & Name</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Primary Anomaly Trigger</th>
                <th className="py-3 px-4 text-center">Risk Score</th>
                <th className="py-3 px-4">Level</th>
                <th className="py-3 px-4 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {criticalProjects.map((p) => (
                <tr key={p.projectId} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <Link to={`/projects/${p.projectId}`} className="font-bold text-white hover:text-indigo-400">
                      {p.projectId}
                    </Link>
                    <div className="text-slate-400 truncate max-w-sm">{p.projectName}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-300">{p.state}</td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs">
                    <span className="line-clamp-1">{p.riskReasons?.[0] || 'Cost & progress gap anomaly'}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-sm font-extrabold text-rose-400">{p.overallRisk}</span>
                  </td>
                  <td className="py-3 px-4">
                    <RiskBadge level={p.riskLevel} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      to={`/projects/${p.projectId}`}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold inline-flex items-center gap-1"
                    >
                      Dossier <ChevronRight className="w-3 h-3" />
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
