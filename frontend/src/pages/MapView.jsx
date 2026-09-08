import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import {
  MapPin,
  Filter,
  ShieldAlert,
  Layers,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import RiskBadge from '../components/common/RiskBadge';
import ProgressBar from '../components/common/ProgressBar';
import { projectService } from '../services/projectService';

// Custom colored map pins using L.divIcon
const createCustomMarker = (riskLevel, riskScore) => {
  const colors = {
    CRITICAL: 'bg-rose-600 border-rose-300 text-white shadow-rose-600/50',
    HIGH: 'bg-orange-500 border-orange-200 text-white shadow-orange-500/50',
    MEDIUM: 'bg-amber-500 border-amber-200 text-white shadow-amber-500/50',
    LOW: 'bg-emerald-500 border-emerald-200 text-white shadow-emerald-500/50',
  };

  const ringStyle = colors[riskLevel] || colors.LOW;

  return L.divIcon({
    className: 'custom-map-pin',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-8 h-8 rounded-full border-2 shadow-lg flex items-center justify-center font-bold text-[10px] ${ringStyle}">
          ${riskScore}
        </div>
        <div class="w-2 h-2 rounded-full bg-slate-900 absolute -bottom-1"></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

export default function MapView() {
  const [projects, setProjects] = useState([]);
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const res = await projectService.getProjects();
        setProjects(res.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  const filteredProjects = projects.filter((p) => {
    if (riskFilter !== 'ALL' && p.riskLevel !== riskFilter) return false;
    if (stateFilter !== 'ALL' && p.state !== stateFilter) return false;
    return true;
  });

  const uniqueStates = Array.from(new Set(projects.map((p) => p.state))).sort();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geographic Information System (GIS) Monitoring"
        subtitle="Geolocated spatial distribution of MPLADS assets with real-time risk classification markers."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Interactive Map' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            {filteredProjects.length} Works Georeferenced
          </span>
        }
      />

      {/* Map Filter Controls Bar */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mr-1">
              Risk Filter:
            </span>
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setRiskFilter(lvl)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                  riskFilter === lvl
                    ? lvl === 'CRITICAL'
                      ? 'bg-rose-600 text-white'
                      : lvl === 'HIGH'
                      ? 'bg-orange-500 text-white'
                      : lvl === 'MEDIUM'
                      ? 'bg-amber-500 text-white'
                      : lvl === 'LOW'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-indigo-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {lvl === 'ALL' ? 'All Tiers' : lvl}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            >
              <option value="ALL">All States</option>
              {uniqueStates.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Interactive Map Card */}
      <div className="glass-panel rounded-2xl p-3 border border-slate-800 overflow-hidden relative shadow-2xl">
        <div className="h-[620px] w-full rounded-xl overflow-hidden relative">
          <MapContainer
            center={[21.5, 80.0]} // Center of India
            zoom={5}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredProjects.map((project) => (
              <Marker
                key={project.projectId}
                position={[project.latitude, project.longitude]}
                icon={createCustomMarker(project.riskLevel, project.overallRisk)}
                eventHandlers={{
                  click: () => setSelectedProject(project),
                }}
              >
                <Popup className="custom-popup">
                  <div className="p-1 max-w-xs text-xs space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                      <span className="font-bold text-white text-xs">{project.projectId}</span>
                      <RiskBadge level={project.riskLevel} size="sm" />
                    </div>

                    <p className="font-semibold text-slate-200 line-clamp-2">
                      {project.projectName}
                    </p>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        <span>Location:</span>
                        <strong className="text-white block">{project.state}</strong>
                      </div>
                      <div>
                        <span>Sanctioned:</span>
                        <strong className="text-white block">₹{(project.sanctionedAmount / 100000).toFixed(1)} L</strong>
                      </div>
                    </div>

                    <div className="pt-1">
                      <ProgressBar
                        physical={project.physicalProgress}
                        financial={project.financialProgress}
                        height="h-1.5"
                      />
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                      <span className="text-[11px] text-slate-400">
                        Risk Score: <strong className="text-rose-400">{project.overallRisk}/100</strong>
                      </span>
                      <Link
                        to={`/projects/${project.projectId}`}
                        className="text-xs font-bold text-indigo-400 hover:underline inline-flex items-center gap-0.5"
                      >
                        Inspect Dossier &rarr;
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Floating Legend */}
        <div className="absolute bottom-6 left-6 z-[1000] rounded-xl border border-slate-800 bg-slate-900/90 p-3.5 backdrop-blur-md shadow-2xl text-xs space-y-2 hidden sm:block">
          <span className="font-bold text-slate-300 uppercase tracking-wider text-[10px] block">
            GIS Risk Tier Markers
          </span>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600" />
              <span className="text-slate-300">Critical Risk (81-100)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-500" />
              <span className="text-slate-300">High Risk (61-80)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-slate-300">Medium Risk (31-60)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span className="text-slate-300">Low Risk (0-30)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
