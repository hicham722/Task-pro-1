import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Task } from '../types';

interface AnalyticsDashboardProps {
  tasks: Task[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b']; // Blue, Green, Amber

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ tasks }) => {
  // Process data for Donut Chart (Status)
  const statusCounts = {
    Upcoming: 0,
    Completed: 0,
    Overdue: 0,
  };

  tasks.forEach((task) => {
    if (statusCounts[task.status] !== undefined) {
      statusCounts[task.status]++;
    }
  });

  const pieData = [
    { name: 'Upcoming', value: statusCounts.Upcoming },
    { name: 'Completed', value: statusCounts.Completed },
    { name: 'Overdue', value: statusCounts.Overdue },
  ].filter(item => item.value > 0);

  // Process data for Bar Chart (Category)
  const categoryCounts: Record<string, number> = {};
  tasks.forEach((task) => {
    categoryCounts[task.category] = (categoryCounts[task.category] || 0) + 1;
  });

  const barData = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
    tasks: categoryCounts[cat],
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Donut Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Task Status Distribution</h3>
        <div className="h-64 w-full flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-4 mt-2">
            {pieData.map((entry, index) => (
                <div key={entry.name} className="flex items-center gap-2 text-sm text-slate-600">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length]}}></span>
                    {entry.name} ({entry.value})
                </div>
            ))}
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-lg font-semibold text-slate-700 mb-4">Tasks by Category</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
