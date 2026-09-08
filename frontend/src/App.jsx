import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';

// All 14 Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import RiskDashboard from './pages/RiskDashboard';
import FinancialAnalysis from './pages/FinancialAnalysis';
import ProgressMonitoring from './pages/ProgressMonitoring';
import PhotoVerification from './pages/PhotoVerification';
import MapView from './pages/MapView';
import Alerts from './pages/Alerts';
import SimilarProjects from './pages/SimilarProjects';
import AIAssistant from './pages/AIAssistant';
import Users from './pages/Users';
import AuditLogs from './pages/AuditLogs';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected / Main Application Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="risk" element={<RiskDashboard />} />
          <Route path="financial-analysis" element={<FinancialAnalysis />} />
          <Route path="progress-monitoring" element={<ProgressMonitoring />} />
          <Route path="photo-verification" element={<PhotoVerification />} />
          <Route path="map" element={<MapView />} />
          <Route path="alerts" element={<Alerts />} />
          <Route path="similar-projects" element={<SimilarProjects />} />
          <Route path="ai-assistant" element={<AIAssistant />} />
          <Route path="users" element={<Users />} />
          <Route path="audit-logs" element={<AuditLogs />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}
