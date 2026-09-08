import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CopyCheck,
  Sparkles,
  AlertTriangle,
  ArrowRight,
  Info,
  Layers,
  MapPin,
  IndianRupee,
  HelpCircle
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { similarService } from '../services/similarService';

export default function SimilarProjects() {
  const [pairs, setPairs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await similarService.getSimilarProjects();
        setPairs(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Semantic Project Similarity & Redundancy Analysis"
        subtitle="Sentence Transformer vector embeddings and cosine similarity comparison across proposals to prevent duplicate sanctioning."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Similar Projects' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            NLP Vector Comparison
          </span>
        }
      />

      {/* Guidance Notice Banner (Section 29: Mandated terminology) */}
      <div className="rounded-2xl border border-indigo-500/20 bg-indigo-950/30 p-4 text-xs text-slate-300 flex items-start gap-3">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-white">Administrative Guidance:</strong> Natural Language Processing matches project scopes across historical state archives and central schemes. High semantic proximity indicates <strong>Potentially Similar Work</strong> requiring administrative alignment, rather than verified fraudulent duplication.
        </p>
      </div>

      {/* Similar Proposals Comparison Cards */}
      <div className="space-y-5">
        {pairs.map((pair) => (
          <div
            key={pair.pairId}
            className="glass-panel rounded-2xl p-6 border border-slate-800 space-y-5"
          >
            {/* Header / Similarity Meter */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-indigo-900/60 border border-indigo-700/50 text-indigo-400">
                  <CopyCheck className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                    Similarity Index Match
                  </span>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {pair.similarityTag}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold ${
                        pair.similarityScore > 85
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : 'bg-amber-950 text-amber-300 border border-amber-800'
                      }`}
                    >
                      {pair.similarityScore}% Cosine Match
                    </span>
                  </h3>
                </div>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                Comparison ID: {pair.pairId}
              </span>
            </div>

            {/* Side-by-Side Proposal Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Proposal 1 (Current Active Proposal) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                    Subject Project Proposal
                  </span>
                  <span className="text-xs font-bold text-white">
                    ₹{(pair.primaryProject.cost / 100000).toFixed(1)} L
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">
                  <Link
                    to={`/projects/${pair.primaryProject.id}`}
                    className="hover:text-indigo-400 hover:underline"
                  >
                    {pair.primaryProject.id} &mdash; {pair.primaryProject.name}
                  </Link>
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{pair.primaryProject.state}, {pair.primaryProject.district}</span>
                  <span>&bull;</span>
                  <span>{pair.primaryProject.workType}</span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed italic">
                  "{pair.primaryProject.description}"
                </p>
              </div>

              {/* Proposal 2 (Historical or Overlapping Scheme Proposal) */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                    Matched Historical / Convergent Work
                  </span>
                  <span className="text-xs font-bold text-white">
                    ₹{(pair.matchedProject.cost / 100000).toFixed(1)} L
                  </span>
                </div>

                <h4 className="text-xs font-bold text-white">
                  {pair.matchedProject.id} &mdash; {pair.matchedProject.name}
                </h4>

                <div className="flex items-center gap-3 text-[11px] text-slate-400">
                  <span>{pair.matchedProject.state}, {pair.matchedProject.district}</span>
                  <span>&bull;</span>
                  <span>{pair.matchedProject.workType}</span>
                </div>

                <p className="text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/80 leading-relaxed italic">
                  "{pair.matchedProject.description}"
                </p>
              </div>
            </div>

            {/* AI Semantic Synthesis */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
              <span className="font-bold text-indigo-300 flex items-center gap-1 text-[11px]">
                <Sparkles className="w-3.5 h-3.5" />
                NLP Analysis & Administrative Summary:
              </span>
              <p className="text-slate-300 leading-relaxed">{pair.analysis}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
