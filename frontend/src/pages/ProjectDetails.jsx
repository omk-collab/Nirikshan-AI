import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FolderKanban,
  IndianRupee,
  Calendar,
  Clock,
  MapPin,
  Building,
  User,
  ShieldAlert,
  AlertTriangle,
  Camera,
  RotateCw,
  CheckCircle2,
  HelpCircle,
  FileText,
  TrendingDown,
  Layers,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import PageHeader from '../components/layout/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import RiskScoreRing from '../components/common/RiskScoreRing';
import ProgressBar from '../components/common/ProgressBar';
import { projectService } from '../services/projectService';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisSuccess, setAnalysisSuccess] = useState(false);

  useEffect(() => {
    async function loadProject() {
      setLoading(true);
      try {
        const data = await projectService.getProjectById(id || 'MPLADS-DEMO-001');
        setProject(data?.data || data || null);
      } catch (err) {
        console.error("Failed to load project details", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [id]);

  const handleRunAiAnalysis = async () => {
    setAnalyzing(true);
    setAnalysisSuccess(false);
    try {
      const res = await projectService.analyzeProjectRisk(project.projectId);
      setProject((prev) => ({
        ...prev,
        overallRisk: res.overallRisk,
        riskLevel: res.riskLevel,
        riskBreakdown: res.riskBreakdown,
        riskReasons: res.riskReasons,
        recommendations: res.recommendations,
      }));
      setAnalysisSuccess(true);
      setTimeout(() => setAnalysisSuccess(false), 4000);
    } catch (e) {
      console.error(e);
    } finally {
      setAnalyzing(false);
    }
  };

  if (loading || !project) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading Project Dossier...</p>
        </div>
      </div>
    );
  }

  // Radar chart data for risk breakdown
  const radarData = [
    { subject: 'Financial', score: project.riskBreakdown?.financialRisk || 50, fullMark: 100 },
    { subject: 'Progress', score: project.riskBreakdown?.progressRisk || 50, fullMark: 100 },
    { subject: 'Timeline', score: project.riskBreakdown?.delayRisk || 50, fullMark: 100 },
    { subject: 'ML Anomaly', score: project.riskBreakdown?.mlRisk || 50, fullMark: 100 },
    { subject: 'Geotag Photo', score: project.riskBreakdown?.photoRisk || 50, fullMark: 100 },
    { subject: 'Peer Group', score: project.riskBreakdown?.peerRisk || 50, fullMark: 100 },
    { subject: 'Text Similarity', score: project.riskBreakdown?.similarityRisk || 50, fullMark: 100 },
  ];

  const remainingFunds = project.sanctionedAmount - project.expenditure;

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Title */}
      <PageHeader
        title={project.projectId}
        subtitle={project.projectName}
        breadcrumbs={[
          { label: 'Home', href: '/dashboard' },
          { label: 'Projects', href: '/projects' },
          { label: project.projectId }
        ]}
        badge={<RiskBadge level={project.riskLevel} size="md" />}
        actions={
          <div className="flex items-center gap-2.5">
            <Link
              to={`/photo-verification?projectId=${project.projectId}`}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <Camera className="w-3.5 h-3.5 text-indigo-400" />
              Verify Geotagged Photo
            </Link>
            <button
              onClick={handleRunAiAnalysis}
              disabled={analyzing}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-3.5 h-3.5 ${analyzing ? 'animate-spin' : ''}`} />
              {analyzing ? 'Analyzing Multi-Factor Vectors...' : 'Run AI Risk Scan'}
            </button>
          </div>
        }
      />

      {analysisSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-200 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Multimodal risk scoring recalculated successfully using latest financial vouchers and telemetry logs.</span>
        </div>
      )}

      {/* Hero Overview: Risk Ring + Core Status + Progress Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
        {/* Left: Risk Score Gauge Card */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Unified Risk Intelligence
          </p>
          <RiskScoreRing score={project.overallRisk} size={135} strokeWidth={12} />
          <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
            Composite AI score based on financial deviation, milestone lag, Isolation Forest anomaly, and peer group metrics.
          </p>
        </div>

        {/* Center: Financial Snapshot */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Financial Breakdown
            </span>
            <span className={`text-xs font-bold ${project.costDeviation > 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
              Dev: +{project.costDeviation.toFixed(1)}%
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Sanctioned</span>
              <p className="text-base font-extrabold text-white">₹{(project.sanctionedAmount / 100000).toFixed(2)} Lakhs</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Expenditure</span>
              <p className="text-base font-extrabold text-indigo-400">₹{(project.expenditure / 100000).toFixed(2)} Lakhs</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Est. Tender Cost</span>
              <p className="text-sm font-bold text-slate-300">₹{(project.estimatedCost / 100000).toFixed(2)} L</p>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-semibold">Reported Actual</span>
              <p className="text-sm font-bold text-rose-400">₹{(project.actualCost / 100000).toFixed(2)} L</p>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-xs flex justify-between text-slate-400">
            <span>Remaining Funds Balance:</span>
            <strong className="text-white">₹{(remainingFunds / 100000).toFixed(2)} Lakhs</strong>
          </div>
        </div>

        {/* Right 1: Milestone Progress & Discrepancy */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Milestone vs Drawdown
            </span>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded ${
                project.progressGap > 25
                  ? 'bg-rose-950 text-rose-300 border border-rose-800'
                  : 'bg-emerald-950 text-emerald-300'
              }`}
            >
              Gap: {project.progressGap > 0 ? `+${project.progressGap}%` : `${project.progressGap}%`}
            </span>
          </div>

          <ProgressBar
            physical={project.physicalProgress}
            financial={project.financialProgress}
            height="h-3"
          />

          <div className="pt-2 text-xs space-y-2 text-slate-400 border-t border-slate-800">
            <div className="flex justify-between">
              <span>Financial Drawdown:</span>
              <strong className="text-blue-400 font-semibold">{project.financialProgress}%</strong>
            </div>
            <div className="flex justify-between">
              <span>Verified Physical Construction:</span>
              <strong className="text-emerald-400 font-semibold">{project.physicalProgress}%</strong>
            </div>
            {project.progressGap > 25 && (
              <p className="text-[11px] text-rose-400 font-medium leading-tight">
                ⚠️ Significant disparity detected: 90% funds claimed while less than half of civil work is completed.
              </p>
            )}
          </div>
        </div>

        {/* Right 2: Execution Timeline & Delays */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            Execution Schedule
          </span>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Calendar className="w-3.5 h-3.5" /> Start Date:
              </span>
              <span className="font-semibold text-white">{project.startDate}</span>
            </div>

            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5" /> Scheduled End:
              </span>
              <span className="font-semibold text-white">{project.expectedCompletionDate}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Execution Status:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-rose-950/80 text-rose-400 border border-rose-800/40">
                {project.status}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-400">Delay Elapsed:</span>
              <span className="font-extrabold text-rose-400">
                {project.delayDays > 0 ? `${project.delayDays} Days` : 'On Schedule'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            Coordinates: <span className="font-mono text-slate-300">{project.latitude}, {project.longitude}</span>
          </div>
        </div>
      </div>

      {/* Administrative Details Metadata Grid */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3.5">
          Project Metadata & Sanction Authority
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 block mb-0.5">State & District</span>
            <strong className="text-white text-sm">{project.state}, {project.district}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Constituency & Member of Parliament</span>
            <strong className="text-white text-sm">{project.constituency} ({project.mp})</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Executing Agency</span>
            <strong className="text-white text-sm">{project.agency}</strong>
          </div>
          <div>
            <span className="text-slate-500 block mb-0.5">Designated Contractor</span>
            <strong className="text-white text-sm">{project.contractor}</strong>
          </div>
        </div>
      </div>

      {/* Risk Analysis Deep Dive: Radar Vector Breakdown & Explainability */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Radar Chart & Weights */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Multimodal Risk Vector Breakdown</h3>
              <p className="text-xs text-slate-400">Normalized 7-dimensional risk factor evaluation</p>
            </div>
            <span className="text-xs text-indigo-400 font-semibold">Engine V1</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" tick={{ fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" />
                <Radar name="Risk Level" dataKey="score" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.35} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown bars */}
          <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-slate-800/80 text-xs">
            {Object.entries(project.riskBreakdown || {}).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800">
                <span className="text-slate-400 capitalize">{key.replace('Risk', '')}:</span>
                <span className={`font-bold ${val > 70 ? 'text-rose-400' : val > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {val} / 100
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Explainability & Recommendation Panel (Section 18 & 19) */}
        <div className="glass-panel rounded-2xl p-6 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <h3 className="text-sm font-bold text-white">Why is this project flagged as {project.riskLevel} Risk?</h3>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Automated explainable reasoning generated by combining rule-based heuristics, peer distributions, and Isolation Forest z-scores.
            </p>

            {/* Reasons List */}
            <div className="space-y-2.5 mb-5">
              {project.riskReasons?.map((reason, idx) => (
                <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-950/20 border border-rose-900/30 text-xs text-slate-200">
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{reason}</span>
                </div>
              ))}
            </div>

            {/* Actionable Recommendations (Section 37) */}
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Recommended Supervisory Actions
            </h4>
            <div className="space-y-2">
              {project.recommendations?.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 pl-1">
                  <span className="text-indigo-400 font-bold">&bull;</span>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
            <Link
              to="/alerts"
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
            >
              Related active alerts &rarr;
            </Link>
            <Link
              to={`/photo-verification?projectId=${project.projectId}`}
              className="text-xs font-semibold text-indigo-400 hover:underline flex items-center gap-1"
            >
              Examine Geotagged Evidence <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
