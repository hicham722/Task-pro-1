
import React, { useEffect, useState } from 'react';
import { UserStat } from '../types';
import { ShieldCheck, Users, CheckCircle, DollarSign, Calendar, ArrowLeft } from 'lucide-react';

interface AdminDashboardProps {
  onBack: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBack }) => {
  const [users, setUsers] = useState<UserStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (!response.ok) throw new Error('Failed to fetch admin data');
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError('Could not load admin data. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalUsers = users.length;
  const globalTasks = users.reduce((acc, user) => acc + user.totalTasks, 0);
  const globalSpent = users.reduce((acc, user) => acc + user.totalSpent, 0);

  if (loading) {
    return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
             <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <ArrowLeft size={20} className="text-slate-600" />
             </button>
             <div>
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                <ShieldCheck className="text-blue-600" />
                Admin Dashboard
                </h2>
                <p className="text-slate-500 text-sm">Overview of all registered users and activities</p>
             </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
            {error}
        </div>
      )}

      {/* Admin Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-lg">
                <Users size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Users</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalUsers}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Global Tasks Created</p>
                <h3 className="text-2xl font-bold text-slate-800">{globalTasks}</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="p-4 bg-amber-50 text-amber-600 rounded-lg">
                <DollarSign size={24} />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Value Tracked</p>
                <h3 className="text-2xl font-bold text-slate-800">${globalSpent.toFixed(2)}</h3>
            </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800">User Management</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                    <tr>
                        <th className="px-6 py-4">User</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Task Completion</th>
                        <th className="px-6 py-4">Total Value</th>
                        <th className="px-6 py-4">Last Login</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={user.avatar} alt="" className="w-10 h-10 rounded-full border border-slate-200" />
                                    <div>
                                        <div className="font-semibold text-slate-800">{user.name}</div>
                                        <div className="text-xs text-slate-500">{user.email}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-blue-500 rounded-full"
                                            style={{ width: `${user.totalTasks > 0 ? (user.completedTasks / user.totalTasks) * 100 : 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-slate-600 font-medium">
                                        {user.completedTasks}/{user.totalTasks}
                                    </span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-slate-700 font-medium">
                                ${user.totalSpent.toFixed(2)}
                            </td>
                            <td className="px-6 py-4 text-slate-500 text-sm">
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={14} />
                                    {new Date(user.lastLogin).toLocaleDateString()}
                                </div>
                            </td>
                        </tr>
                    ))}
                    
                    {users.length === 0 && (
                        <tr>
                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                No users found in database.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
