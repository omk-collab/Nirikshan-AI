import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  ShieldAlert,
  IndianRupee,
  TrendingUp,
  Camera,
  MapPin,
  Bell,
  CopyCheck,
  Bot,
  Users,
  FileClock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const navigation = [
    {
      group: "Core Intelligence",
      items: [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Projects Explorer', href: '/projects', icon: FolderKanban },
        { name: 'Risk Dashboard', href: '/risk', icon: ShieldAlert, badge: '34 Critical' },
        { name: 'Financial Analysis', href: '/financial-analysis', icon: IndianRupee },
        { name: 'Progress Monitoring', href: '/progress-monitoring', icon: TrendingUp },
      ]
    },
    {
      group: "Verification & GIS",
      items: [
        { name: 'Photo Verification', href: '/photo-verification', icon: Camera, badge: 'Geotag' },
        { name: 'Interactive Map', href: '/map', icon: MapPin },
        { name: 'Alerts Center', href: '/alerts', icon: Bell, badge: '10' },
        { name: 'Similar Projects', href: '/similar-projects', icon: CopyCheck },
        { name: 'AI Assistant', href: '/ai-assistant', icon: Bot, isAi: true },
      ]
    },
    {
      group: "Administration",
      items: [
        { name: 'Users & Roles', href: '/users', icon: Users },
        { name: 'Audit Logs', href: '/audit-logs', icon: FileClock },
      ]
    }
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } flex flex-col`}
      >
        {/* Brand header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800/80 px-5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-amber-500 shadow-md shadow-indigo-500/20">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  Nirikshan
                </span>
                <span className="rounded bg-indigo-950/80 px-1.5 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-700/50">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                MPLADS Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
          {navigation.map((section, idx) => (
            <div key={idx}>
              <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-300">
                {section.group}
              </p>
              <div className="mt-2 space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      onClick={() => onClose && onClose()}
                      className={({ isActive }) =>
                        `group flex items-center justify-between rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-150 ${
                          isActive
                            ? 'bg-indigo-900/60 text-indigo-200 border border-indigo-700/60 shadow-sm shadow-indigo-950'
                            : 'text-slate-300 hover:bg-slate-900 hover:text-white'
                        }`
                      }
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={`h-4 w-4 transition-colors group-hover:text-white ${
                            item.isAi ? 'text-indigo-400' : 'text-slate-400'
                          }`}
                        />
                        <span>{item.name}</span>
                      </div>

                      {item.badge && (
                        <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-300 border border-slate-700">
                          {item.badge}
                        </span>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800/80 p-3.5 bg-slate-950/60">
          <div className="rounded-lg bg-slate-900/80 p-3 border border-slate-800 text-xs">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>MoSPI MPLADS</span>
              <span className="text-emerald-400 font-semibold">Online</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              Decision Intelligence Engine v1.0
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
