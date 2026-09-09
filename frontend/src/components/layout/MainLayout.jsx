import React, { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import SyntheticBanner from '../common/SyntheticBanner';

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('nirikshan_token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Disclaimer Banner */}
      <SyntheticBanner />

      <div className="flex flex-1">
        {/* Navigation Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col lg:pl-64">
          <Navbar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>

          <footer className="border-t border-slate-900 bg-slate-950 px-6 py-4 text-center text-xs text-slate-400">
            Nirikshan-AI &copy; {new Date().getFullYear()} &bull; MoSPI MPLADS Decision Support & Risk Intelligence Platform &bull; Built with React & Vite
          </footer>
        </div>
      </div>
    </div>
  );
}
