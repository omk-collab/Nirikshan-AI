import React, { useState, useEffect } from 'react';
import {
  Users as UsersIcon,
  Shield,
  UserCheck,
  Building,
  MapPin,
  Clock,
  Search,
  CheckCircle2
} from 'lucide-react';
import PageHeader from '../components/layout/PageHeader';
import { userService } from '../services/userService';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadUsers() {
      try {
        const data = await userService.getUsers();
        setUsers(data || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadUsers();
  }, []);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleBadgeStyle = (role) => {
    switch (role) {
      case 'MINISTRY_ADMIN':
        return 'bg-purple-950 text-purple-300 border-purple-800';
      case 'STATE_AUTHORITY':
        return 'bg-blue-950 text-blue-300 border-blue-800';
      case 'DISTRICT_AUTHORITY':
        return 'bg-indigo-950 text-indigo-300 border-indigo-800';
      case 'ANALYST':
        return 'bg-amber-950 text-amber-300 border-amber-800';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administrative User Directory & Role-Based Access"
        subtitle="Hierarchy of authorized officers across MoSPI Central, State Planning Departments, and District Collectorates."
        breadcrumbs={[{ label: 'Home', href: '/dashboard' }, { label: 'Users' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-950/80 text-indigo-300 border border-indigo-700/50">
            {users.length} Active Officials
          </span>
        }
      />

      {/* Search Input */}
      <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex items-center justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search officials by name, role, department..."
            className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Official Name & Email</th>
                <th className="py-3 px-4">RBAC Role</th>
                <th className="py-3 px-4">Department / Organization</th>
                <th className="py-3 px-4">Jurisdiction</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Last Terminal Login</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-bold text-white text-xs">{u.name}</div>
                        <div className="text-slate-400 text-[11px] font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${roleBadgeStyle(
                        u.role
                      )}`}
                    >
                      {u.role.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-300 max-w-xs">
                    <span className="line-clamp-1">{u.department}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-300">
                    <div>{u.state}</div>
                    <div className="text-slate-500 text-[11px]">{u.district}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                    {new Date(u.lastLogin).toLocaleString()}
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
