import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Clock,
  Smartphone,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  CopyCheck,
  Upload,
  RotateCw,
  Info,
  Sliders
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { photoService, calculateHaversineDistance } from '../services/photoService';
import { projectService } from '../services/projectService';

export default function PhotoVerification() {
  const [searchParams] = useSearchParams();
  const initialProjectId = searchParams.get('projectId') || 'MPLADS-DEMO-001';

  const [projects, setProjects] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [threshold, setThreshold] = useState(250); // meters
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  useEffect(() => {
    async function loadData() {
      const [projRes, photoRes] = await Promise.all([
        projectService.getProjects(),
        photoService.getPhotos(),
      ]);
      setProjects(projRes.data || []);
      setPhotos(photoRes || []);

      const current = photoRes.find((p) => p.projectId === initialProjectId) || photoRes[0];
      setSelectedPhoto(current);
    }
    loadData();
  }, [initialProjectId]);

  const handleProjectSelect = (projId) => {
    setSelectedProjectId(projId);
    const matchedPhoto = photos.find((p) => p.projectId === projId);
    if (matchedPhoto) {
      setSelectedPhoto(matchedPhoto);
      setVerificationResult(null);
    } else {
      const currentProj = projects.find((p) => p.projectId === projId);
      setSelectedPhoto({
        photoId: `PHT-NEW-${Math.floor(100 + Math.random() * 900)}`,
        projectId: projId,
        projectName: currentProj?.projectName || "Selected Project",
        stage: "Ground Excavation Verification",
        photoUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?auto=format&fit=crop&w=800&q=80",
        projectLat: currentProj?.latitude || 18.5204,
        projectLng: currentProj?.longitude || 73.8567,
        photoLat: (currentProj?.latitude || 18.5204) + 0.0008,
        photoLng: (currentProj?.longitude || 73.8567) + 0.0007,
        distanceMeters: 105,
        allowedThresholdMeters: threshold,
        timestamp: new Date().toISOString(),
        deviceModel: "National Geo-Audit Terminal V3",
        gpsStatus: "Consistent",
        timestampStatus: "Verified",
        duplicateCheck: {
          isDuplicate: false,
          similarityScore: 11.2,
          message: "No similar photo found in central repository."
        },
        overallVerification: "PASS",
        reviewNotes: "Photo coordinates align within tolerance radius.",
        uploadedBy: "District Junior Engineer",
        uploadedAt: new Date().toISOString()
      });
      setVerificationResult(null);
    }
  };

  const handleReverify = async () => {
    if (!selectedPhoto) return;
    setIsVerifying(true);
    try {
      const result = await photoService.verifyPhoto({
        projectLat: selectedPhoto.projectLat,
        projectLng: selectedPhoto.projectLng,
        photoLat: selectedPhoto.photoLat,
        photoLng: selectedPhoto.photoLng,
        threshold: threshold,
      });
      setVerificationResult(result);
    } finally {
      setIsVerifying(false);
    }
  };

  const currentDistance = selectedPhoto
    ? calculateHaversineDistance(
        selectedPhoto.projectLat,
        selectedPhoto.projectLng,
        selectedPhoto.photoLat,
        selectedPhoto.photoLng
      )
    : 0;

  const isWithinThreshold = currentDistance <= threshold;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Geotagged Photo Verification Suite"
        subtitle="Automated EXIF extraction, Haversine geospatial proximity verification, and perceptual image duplication audit."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Photo Verification' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            GPS Integrity Engine
          </span>
        }
      />

      {/* Top Controls: Project Selector & Configurable Threshold */}
      <div className="glass-panel rounded-2xl p-5 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Select Sanctioned Project
            </label>
            <select
              value={selectedProjectId}
              onChange={(e) => handleProjectSelect(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500"
            >
              {projects.map((p) => (
                <option key={p.projectId} value={p.projectId}>
                  {p.projectId} — {p.projectName.slice(0, 45)}...
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Allowed Geofence Radius
              </label>
              <span className="text-xs font-extrabold text-indigo-400">{threshold} Meters</span>
            </div>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500 cursor-pointer"
            />
            <span className="text-[10px] text-slate-400">Configurable tolerance parameter</span>
          </div>

          <div className="flex items-end justify-end">
            <button
              onClick={handleReverify}
              disabled={isVerifying}
              className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              Recalculate Haversine Delta
            </button>
          </div>
        </div>
      </div>

      {/* Main Split-Screen Layout (Section 25) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Photo Preview & Inspection Details (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Uploaded Field Evidence
              </span>
              <span className="text-xs font-mono text-indigo-400">
                {selectedPhoto?.photoId || 'PHT-DEMO'}
              </span>
            </div>

            {/* Photo Container */}
            <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video group">
              <img
                src={selectedPhoto?.photoUrl}
                alt="Site Inspection Milestone"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-3 left-3 right-3 text-xs">
                <span className="px-2 py-0.5 rounded bg-slate-900/90 text-slate-200 text-[10px] font-bold border border-slate-700">
                  {selectedPhoto?.stage}
                </span>
                <p className="text-[11px] text-slate-300 mt-1 truncate">
                  Uploaded by: {selectedPhoto?.uploadedBy}
                </p>
              </div>
            </div>

            {/* Switch Sample Photos Quick Gallery */}
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Available Verification Samples:
              </span>
              <div className="grid grid-cols-4 gap-2">
                {photos.map((p) => (
                  <button
                    key={p.photoId}
                    onClick={() => {
                      setSelectedPhoto(p);
                      setSelectedProjectId(p.projectId);
                      setVerificationResult(null);
                    }}
                    className={`relative rounded-lg overflow-hidden border aspect-video transition-all ${
                      selectedPhoto?.photoId === p.photoId
                        ? 'border-indigo-500 ring-2 ring-indigo-500/50'
                        : 'border-slate-800 hover:border-slate-700 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={p.photoUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Geotag & EXIF Metrics + Verification Card (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Verification Status Banner */}
          <div
            className={`rounded-2xl border p-5 backdrop-blur-md transition-all ${
              !isWithinThreshold || selectedPhoto?.overallVerification === 'FAIL'
                ? 'bg-rose-950/40 border-rose-900/60'
                : selectedPhoto?.overallVerification === 'REQUIRES_REVIEW'
                ? 'bg-amber-950/40 border-amber-900/60'
                : 'bg-emerald-950/40 border-emerald-900/60'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border ${
                    !isWithinThreshold || selectedPhoto?.overallVerification === 'FAIL'
                      ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                      : selectedPhoto?.overallVerification === 'REQUIRES_REVIEW'
                      ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                      : 'bg-emerald-950/80 border-emerald-800 text-emerald-400'
                  }`}
                >
                  {!isWithinThreshold || selectedPhoto?.overallVerification === 'FAIL' ? (
                    <XCircle className="w-6 h-6" />
                  ) : selectedPhoto?.overallVerification === 'REQUIRES_REVIEW' ? (
                    <AlertTriangle className="w-6 h-6" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-extrabold text-white">
                      Verification Outcome:
                    </h3>
                    <span
                      className={`px-3 py-0.5 rounded-full text-xs font-extrabold uppercase border ${
                        !isWithinThreshold || selectedPhoto?.overallVerification === 'FAIL'
                          ? 'bg-rose-950 text-rose-300 border-rose-700'
                          : selectedPhoto?.overallVerification === 'REQUIRES_REVIEW'
                          ? 'bg-amber-950 text-amber-300 border-amber-700'
                          : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                      }`}
                    >
                      {!isWithinThreshold
                        ? 'FAIL — GPS EXCEEDS RADIUS'
                        : selectedPhoto?.overallVerification}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {selectedPhoto?.reviewNotes}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase block font-semibold">
                  Haversine Delta
                </span>
                <span
                  className={`text-xl font-black ${
                    !isWithinThreshold ? 'text-rose-400' : 'text-emerald-400'
                  }`}
                >
                  {currentDistance >= 1000
                    ? `${(currentDistance / 1000).toFixed(2)} km`
                    : `${currentDistance} m`}
                </span>
              </div>
            </div>
          </div>

          {/* Coordinates & Technical Metadata Grid */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Geospatial Coordinate Extraction
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-indigo-400" />
                  Sanctioned Project Site
                </span>
                <p className="text-sm font-bold font-mono text-white">
                  {selectedPhoto?.projectLat?.toFixed(6)}, {selectedPhoto?.projectLng?.toFixed(6)}
                </p>
                <span className="text-[11px] text-slate-400">Official master gazette records</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-[10px] font-semibold uppercase text-slate-400 flex items-center gap-1">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  Embedded EXIF GPS
                </span>
                <p className="text-sm font-bold font-mono text-white">
                  {selectedPhoto?.photoLat?.toFixed(6)}, {selectedPhoto?.photoLng?.toFixed(6)}
                </p>
                <span className="text-[11px] text-slate-400">Extracted from photo header payload</span>
              </div>
            </div>

            {/* Secondary Metadata Rows */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">GPS Status</span>
                <strong className={`text-xs ${isWithinThreshold ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isWithinThreshold ? 'Consistent' : 'Requires Review'}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Capture Timestamp</span>
                <strong className="text-xs text-slate-200">
                  {new Date(selectedPhoto?.timestamp).toLocaleString()}
                </strong>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-[10px] text-slate-400 block font-semibold">Hardware Device</span>
                <strong className="text-xs text-slate-200 truncate block">
                  {selectedPhoto?.deviceModel}
                </strong>
              </div>
            </div>
          </div>

          {/* Perceptual Hash Duplicate Detection Result (Section 28) */}
          <div className="glass-panel rounded-2xl p-5 border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <CopyCheck className="w-4 h-4 text-indigo-400" />
                Perceptual Image Hash (pHash) Duplicate Check
              </h4>
              <span className="text-[10px] font-mono text-slate-400">Hamming Distance Index</span>
            </div>

            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-3 ${
                selectedPhoto?.duplicateCheck?.isDuplicate
                  ? 'bg-amber-950/30 border-amber-900/50 text-amber-200'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300'
              }`}
            >
              <div className="p-1 rounded bg-slate-900 shrink-0">
                {selectedPhoto?.duplicateCheck?.isDuplicate ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                ) : (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                )}
              </div>
              <div>
                <p className="font-semibold text-white">
                  {selectedPhoto?.duplicateCheck?.isDuplicate
                    ? `Potentially Reused Photographic Evidence (${selectedPhoto?.duplicateCheck?.similarityScore}% Match)`
                    : 'Unique Photographic Submission'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {selectedPhoto?.duplicateCheck?.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
