import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Filter,
  Download,
  ShieldAlert
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import FilterBar from '../components/common/FilterBar';
import RiskBadge from '../components/common/RiskBadge';
import ProgressBar from '../components/common/ProgressBar';
import { projectService } from '../services/projectService';

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states initialized from URL params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [riskLevel, setRiskLevel] = useState(searchParams.get('riskLevel') || 'ALL');
  const [status, setStatus] = useState(searchParams.get('status') || 'ALL');
  const [state, setState] = useState(searchParams.get('state') || 'ALL');
  const [workType, setWorkType] = useState(searchParams.get('workType') || 'ALL');

  // Sorting
  const [sortField, setSortField] = useState('overallRisk');
  const [sortAsc, setSortAsc] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      try {
        const res = await projectService.getProjects({
          search,
          riskLevel,
          status,
          state,
          workType,
        });
        setProjects(res.data || []);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error fetching projects", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, [search, riskLevel, status, state, workType]);

  // Unique dropdown options
  const uniqueStates = ['Maharashtra', 'Uttar Pradesh', 'Karnataka', 'Gujarat', 'Tamil Nadu', 'Bihar', 'Rajasthan', 'West Bengal', 'Madhya Pradesh', 'Kerala', 'Odisha', 'Andhra Pradesh', 'Telangana', 'Punjab', 'Assam'];
  const uniqueWorkTypes = ['Road Construction', 'Solar Lighting', 'Community Hall', 'Drinking Water', 'Health Center', 'School Infrastructure', 'Drainage & Sanitation'];

  // Handle sort toggle
  const handleSort = (field) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  // Sorted projects
  const sortedProjects = [...projects].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    if (typeof valA === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? (valA || 0) - (valB || 0) : (valB || 0) - (valA || 0);
  });

  // Paginated items
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage) || 1;
  const paginatedProjects = sortedProjects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const resetFilters = () => {
    setSearch('');
    setRiskLevel('ALL');
    setStatus('ALL');
    setState('ALL');
    setWorkType('ALL');
    setSearchParams({});
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Project Monitoring Explorer"
        subtitle="Full registry of active and completed MPLADS works with automated risk metrics, progress mismatch, and GPS auditing."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Projects' }]}
        actions={
          <button
            onClick={() => alert("Dataset export initiated for offline analytical review.")}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export CSV
          </button>
        }
      />

      {/* Filter Component */}
      <FilterBar
        search={search}
        onSearchChange={setSearch}
        riskLevel={riskLevel}
        onRiskChange={setRiskLevel}
        status={status}
        onStatusChange={setStatus}
        state={state}
        onStateChange={setState}
        workType={workType}
        onWorkTypeChange={setWorkType}
        states={uniqueStates}
        workTypes={uniqueWorkTypes}
        onReset={resetFilters}
      />

      {/* Projects Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing <strong className="text-white">{sortedProjects.length}</strong> matching projects
          </div>
          <div className="text-slate-400">
            Sorted by: <strong className="text-indigo-400 capitalize">{sortField}</strong> ({sortAsc ? 'Asc' : 'Desc'})
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th
                  onClick={() => handleSort('projectId')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Project ID
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">State / District</th>
                <th className="py-3 px-4">Work Type</th>
                <th
                  onClick={() => handleSort('sanctionedAmount')}
                  className="py-3 px-4 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    Sanctioned
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Expenditure</th>
                <th className="py-3 px-4 min-w-[170px]">Progress (Phy vs Fin)</th>
                <th
                  onClick={() => handleSort('overallRisk')}
                  className="py-3 px-4 text-center cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-center gap-1">
                    Risk Score
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Risk Level</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    <div className="w-6 h-6 border-2 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-2" />
                    Filtering records...
                  </td>
                </tr>
              ) : paginatedProjects.length === 0 ? (
                <tr>
                  <td colSpan="10" className="py-12 text-center text-slate-400">
                    No projects found matching the filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedProjects.map((p) => (
                  <tr
                    key={p.projectId}
                    className="hover:bg-slate-900/60 transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <Link
                        to={`/projects/${p.projectId}`}
                        className="font-bold text-white group-hover:text-indigo-400 hover:underline"
                      >
                        {p.projectId}
                      </Link>
                      <div className="text-slate-400 line-clamp-1 max-w-xs text-[11px]">
                        {p.projectName}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      <div>{p.state}</div>
                      <div className="text-slate-500 text-[11px]">{p.district}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 text-[11px] border border-slate-700/50">
                        {p.workType}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      ₹{(p.sanctionedAmount / 100000).toFixed(1)} L
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      ₹{(p.expenditure / 100000).toFixed(1)} L
                      <div className="text-[10px] text-slate-400">
                        ({p.expenditureRatio.toFixed(0)}%)
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <ProgressBar
                        physical={p.physicalProgress}
                        financial={p.financialProgress}
                        height="h-1.5"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`text-sm font-extrabold ${
                          p.overallRisk > 80
                            ? 'text-rose-400'
                            : p.overallRisk > 60
                            ? 'text-orange-400'
                            : p.overallRisk > 30
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}
                      >
                        {p.overallRisk}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={p.riskLevel} size="sm" />
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          p.status === 'COMPLETED'
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/40'
                            : p.status === 'DELAYED'
                            ? 'bg-rose-950/70 text-rose-300 border border-rose-800/40'
                            : 'bg-blue-950/70 text-blue-300 border border-blue-800/40'
                        }`}
                      >
                        {p.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/projects/${p.projectId}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/80 text-indigo-300 border border-indigo-700/50 text-xs font-semibold transition-colors"
                      >
                        Details
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination controls */}
        <div className="px-5 py-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Prev
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:bg-slate-800 disabled:opacity-40 transition-colors flex items-center gap-1"
            >
              Next <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
