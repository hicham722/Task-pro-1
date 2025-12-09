import React, { useState, useEffect } from 'react';
import { X, Type, AlignLeft, Layers, DollarSign, Calendar, Activity, StickyNote, CheckCircle2, Bell } from 'lucide-react';
import { Task, Category, TaskStatus } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id'>) => void;
  initialData?: Task | null;
}

const Label = ({ children }: { children?: React.ReactNode }) => (
  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">
    {children}
  </label>
);

const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Personal' as Category,
    amount: '',
    dueDate: '',
    status: 'Upcoming' as TaskStatus,
    notes: '',
    reminder: false,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title,
        description: initialData.description || '',
        category: initialData.category,
        amount: initialData.amount.toString(),
        dueDate: initialData.dueDate,
        status: initialData.status,
        notes: initialData.notes || '',
        reminder: initialData.reminder || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Personal',
        amount: '0.00',
        dueDate: new Date().toISOString().split('T')[0],
        status: 'Upcoming',
        notes: '',
        reminder: false,
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: formData.title,
      description: formData.description,
      category: formData.category,
      amount: parseFloat(formData.amount) || 0,
      dueDate: formData.dueDate,
      status: formData.status,
      notes: formData.notes,
      reminder: formData.reminder,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with blur */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      <div className="relative bg-white rounded-3xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden transform transition-all scale-100">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
              {initialData ? 'Edit Task' : 'New Task'}
            </h2>
            <p className="text-sm text-slate-400 mt-0.5">Fill in the details below</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200"
          >
            <X size={22} />
          </button>
        </div>

        {/* Form Content */}
        <div className="overflow-y-auto p-8 space-y-6 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            
            {/* Task Name */}
            <div>
              <Label>Task Name *</Label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <Type size={18} />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 font-medium placeholder:text-slate-400"
                  placeholder="What needs to be done?"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label>Description</Label>
              <div className="relative group">
                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <AlignLeft size={18} />
                </div>
                <textarea
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 resize-none placeholder:text-slate-400"
                  placeholder="Add details about this task..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Category */}
              <div>
                <Label>Category *</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Layers size={18} />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                  >
                    <option value="Personal">Personal</option>
                    <option value="Work">Work</option>
                    <option value="Finance">Finance</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Health">Health</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <Label>Amount</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <DollarSign size={18} />
                  </div>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 font-medium"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Due Date */}
              <div>
                <Label>Due Date *</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <input
                    type="date"
                    required
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 cursor-pointer"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
              </div>

              {/* Status */}
              <div>
                <Label>Status</Label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                    <Activity size={18} />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 appearance-none cursor-pointer"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                  >
                    <option value="Upcoming">Upcoming</option>
                    <option value="Completed">Completed</option>
                    <option value="Overdue">Overdue</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Reminder Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className={`p-2 rounded-lg ${formData.reminder ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-500'}`}>
                    <Bell size={20} className={formData.reminder ? 'fill-current' : ''} />
                 </div>
                 <div>
                    <h4 className="text-sm font-semibold text-slate-800">Remind me</h4>
                    <p className="text-xs text-slate-500">Send notification 24 hours before due</p>
                 </div>
               </div>
               <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={formData.reminder}
                    onChange={(e) => setFormData({...formData, reminder: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>

            {/* Notes */}
            <div>
              <Label>Additional Notes</Label>
              <div className="relative group">
                <div className="absolute top-3.5 left-0 pl-3.5 pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                  <StickyNote size={18} />
                </div>
                <textarea
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all duration-200 text-slate-700 resize-none placeholder:text-slate-400"
                  placeholder="Any extra information..."
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 flex gap-4 bg-slate-50/50">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3.5 bg-white text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 px-4 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={20} />
            {initialData ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;