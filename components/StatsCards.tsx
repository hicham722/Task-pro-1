import React from 'react';
import { CheckSquare, ListTodo, DollarSign, TrendingUp } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Total Tasks */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Total Tasks</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.totalTasks}</h3>
        </div>
        <div className="bg-blue-500 p-3 rounded-lg text-white">
          <ListTodo size={24} />
        </div>
      </div>

      {/* Completed Tasks */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Completed Tasks</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.completedTasks}</h3>
        </div>
        <div className="bg-emerald-500 p-3 rounded-lg text-white">
          <CheckSquare size={24} />
        </div>
      </div>

      {/* Pending Payments */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Pending Payments</p>
          <h3 className="text-2xl font-bold text-slate-800">{stats.pendingPayments}</h3>
        </div>
        <div className="bg-amber-500 p-3 rounded-lg text-white">
          <DollarSign size={24} />
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">Progress</p>
          <h3 className="text-2xl font-bold text-slate-800">{Math.round(stats.progress)}%</h3>
        </div>
        <div className="bg-indigo-500 p-3 rounded-lg text-white">
          <TrendingUp size={24} />
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
