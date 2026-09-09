import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  UserCheck,
  ChevronDown,
  LogOut,
  ShieldAlert,
  SlidersHorizontal,
  ExternalLink
} from 'lucide-react';
import { userService } from '../../services/userService';
import { mockUsers } from '../../data/mockUsers';

export default function Navbar({ onMenuToggle }) {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(userService.getCurrentUser());
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleRoleChange = (userId) => {
    const selected = mockUsers.find((u) => u.id === userId) || mockUsers[0];
    userService.setCurrentUser(selected);
    setCurrentUser(selected);
    setShowRoleMenu(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('nirikshan_token');
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl">
      <div className="flex items-center gap-3 lg:gap-6">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Global project search */}
        <form onSubmit={handleSearchSubmit} className="relative hidden md:block w-72 lg:w-96">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search project ID (e.g. MPLADS-DEMO-001)..."
            className="w-full pl-9 pr-4 py-1.5 bg-slate-900/90 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
          />
        </form>
      </div>

      {/* Right nav actions */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Role Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/80 hover:bg-slate-850 text-xs font-medium text-slate-200 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden sm:inline">{currentUser?.role?.replace('_', ' ') || 'ROLE'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl border border-slate-800 bg-slate-900 p-2 shadow-2xl z-50">
              <p className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Switch Perspective
              </p>
              {mockUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleRoleChange(u.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs hover:bg-slate-800 transition-colors ${
                    currentUser?.email === u.email ? 'bg-indigo-950/60 border border-indigo-700/50' : 'text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-white">{u.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {u.role.replace('_', ' ')} &bull; {u.state}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications button */}
        <div className="relative">
          <button
            onClick={() => setShowNotifMenu(!showNotifMenu)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full animate-ping"></span>
            <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900 p-3 shadow-2xl z-50">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-semibold text-white">
                <span>Active Risk Alerts</span>
                <Link to="/alerts" onClick={() => setShowNotifMenu(false)} className="text-indigo-400 hover:underline text-[11px]">
                  View All (10)
                </Link>
              </div>
              <div className="mt-2 space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-rose-950/40 border border-rose-900/40">
                  <div className="font-semibold text-rose-300">Geotag Delta (4.2 km)</div>
                  <div className="text-[11px] text-slate-400">Patna Drainage project photo coordinates mismatch</div>
                </div>
                <div className="p-2 rounded-lg bg-orange-950/40 border border-orange-900/40">
                  <div className="font-semibold text-orange-300">Progress Gap 48%</div>
                  <div className="text-[11px] text-slate-400">MPLADS-DEMO-001 road project expenditure mismatch</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile & logout */}
        <div className="flex items-center gap-3 border-l border-slate-800 pl-3">
          <div className="hidden sm:block text-right">
            <div className="text-xs font-bold text-white leading-tight">
              {currentUser?.name || "Dr. A. Subramanian"}
            </div>
            <div className="text-[10px] text-slate-400">
              {currentUser?.email || "admin@example.com"}
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Sign out"
            className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
