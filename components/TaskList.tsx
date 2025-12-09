import React from 'react';
import { Calendar, Trash2, Edit2, Filter, Bell } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  filter: string;
  setFilter: (filter: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, filter, setFilter, onDelete, onEdit }) => {
  const filters = [
    { id: 'all', label: 'All Tasks' },
    { id: 'today', label: "Today's Tasks" },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'overdue', label: 'Overdue' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-emerald-600 bg-emerald-50';
      case 'Overdue': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  const getCategoryBadge = (category: string) => {
    return (
        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
            {category}
        </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-2 mb-3 text-slate-600">
            <Filter size={18} />
            <span className="font-medium">Filter by:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === f.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="grid grid-cols-1 gap-4">
        {tasks.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-slate-100 border-dashed">
                <p className="text-slate-500">No tasks found matching this filter.</p>
            </div>
        ) : (
            tasks.map((task) => (
            <div
                key={task.id}
                className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group relative"
            >
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-start gap-2">
                        <h4 className="text-lg font-semibold text-slate-800">{task.title}</h4>
                        {task.reminder && (
                            <div className="mt-1.5" title="Reminder on">
                                <Bell size={14} className="text-amber-500 fill-current" />
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(task)} className="p-1 text-slate-400 hover:text-blue-500">
                            <Edit2 size={16} />
                        </button>
                        <button onClick={() => onDelete(task.id)} className="p-1 text-slate-400 hover:text-red-500">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </div>

                {task.description && (
                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{task.description}</p>
                )}

                <div className="flex flex-wrap items-center gap-3 mt-4">
                    {getCategoryBadge(task.category)}
                    
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        <Calendar size={12} />
                        {task.dueDate} {task.status === 'Overdue' ? '(Overdue)' : ''}
                    </div>

                    {task.amount > 0 && (
                        <div className="ml-auto text-sm font-bold text-slate-700">
                            ${task.amount.toFixed(2)}
                        </div>
                    )}
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default TaskList;