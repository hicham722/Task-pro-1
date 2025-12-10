import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Plus, LayoutDashboard, List, LogOut, RefreshCw } from 'lucide-react';
import { Task, DashboardStats, User } from './types';
import StatsCards from './components/StatsCards';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import TaskList from './components/TaskList';
import TaskModal from './components/TaskModal';
import LoginScreen from './components/LoginScreen';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [view, setView] = useState<'list' | 'analytics'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const notifiedTasksRef = useRef<Set<string>>(new Set());

  // Load User from LocalStorage (Keep auth client-side for now)
  useEffect(() => {
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse user data");
      }
    }
  }, []);

  // Fetch Tasks from Backend
  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/tasks');
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        console.error("Failed to fetch tasks");
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [user]);

  // Check for reminders
  useEffect(() => {
    if (!user || tasks.length === 0) return;

    if (!("Notification" in window)) {
        return;
    }

    const checkReminders = () => {
        if (Notification.permission !== "granted") return;

        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = tomorrow.toISOString().split('T')[0];

        tasks.forEach(task => {
            if (task.reminder && task.dueDate === tomorrowStr) {
                if (!notifiedTasksRef.current.has(task.id)) {
                    new Notification(`Reminder: ${task.title}`, {
                        body: `This task is due tomorrow (${task.dueDate})!`,
                        icon: 'https://cdn-icons-png.flaticon.com/512/3239/3239952.png'
                    });
                    notifiedTasksRef.current.add(task.id);
                }
            }
        });
    };

    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                checkReminders();
            }
        });
    } else {
        checkReminders();
    }
  }, [tasks, user]);

  // Stats Logic
  const stats: DashboardStats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'Completed').length;
    const pendingPayments = tasks.filter(t => t.amount > 0 && t.status !== 'Completed').length;
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    return { totalTasks, completedTasks, pendingPayments, progress };
  }, [tasks]);

  // Filtering Logic
  const filteredTasks = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    
    return tasks.filter(task => {
      if (filter === 'all') return true;
      if (filter === 'today') return task.dueDate === today;
      if (filter === 'overdue') return task.status === 'Overdue';
      
      const taskDate = new Date(task.dueDate);
      if (filter === 'week') {
        const diffTime = Math.abs(taskDate.getTime() - now.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays <= 7;
      }
      if (filter === 'month') {
        return taskDate.getMonth() === now.getMonth() && taskDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [tasks, filter]);

  // Handlers
  const handleLogin = (newUser: User) => {
    setUser(newUser);
    localStorage.setItem('taskflow_user', JSON.stringify(newUser));
  };

  const handleLogout = () => {
    setUser(null);
    setTasks([]);
    localStorage.removeItem('taskflow_user');
  };

  const handleAddTask = async (newTaskData: Omit<Task, 'id'>) => {
    try {
      if (editingTask) {
        // Update existing task
        const response = await fetch(`/api/tasks/${editingTask.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskData),
        });
        
        if (response.ok) {
          const updatedTask = await response.json();
          setTasks(tasks.map(t => t.id === editingTask.id ? updatedTask : t));
          setEditingTask(null);
        }
      } else {
        // Create new task
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newTaskData),
        });
        
        if (response.ok) {
          const savedTask = await response.json();
          setTasks([savedTask, ...tasks]);
        }
      }
    } catch (error) {
      console.error("Operation failed:", error);
      alert("Failed to save task. Please ensure the backend server is running.");
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setTasks(tasks.filter(t => t.id !== id));
        }
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingTask(null);
  }

  // Render Login Screen if not authenticated
  if (!user) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              TF
            </div>
            <h1 className="text-xl font-bold text-slate-800 hidden sm:block">TaskFlow Pro</h1>
          </div>

          <div className="flex items-center gap-4">
             {loading && <span className="text-xs text-slate-400 flex items-center gap-1"><RefreshCw size={12} className="animate-spin"/> Syncing...</span>}
            {/* View Toggles */}
            <div className="flex bg-slate-100 p-1 rounded-lg hidden md:flex">
              <button
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={16} />
                <span className="hidden sm:inline">Tasks</span>
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  view === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutDashboard size={16} />
                <span className="hidden sm:inline">Analytics</span>
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm shadow-blue-200"
            >
              <Plus size={18} />
              <span className="hidden sm:inline">Add Task</span>
            </button>
            
            {/* User Profile Dropdown / Logout */}
            <div className="flex items-center gap-3 pl-2">
               <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-slate-700">{user.name}</p>
                  <p className="text-xs text-slate-400">Pro Plan</p>
               </div>
               <img 
                 src={user.avatar} 
                 alt={user.name} 
                 className="w-9 h-9 rounded-full border border-slate-200 object-cover"
               />
               <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Sign Out"
               >
                 <LogOut size={18} />
               </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Welcome Section */}
        <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-800">Hello, {user.name}</h2>
            <p className="text-slate-500">Manage your tasks and payments efficiently</p>
        </div>

        {/* Mobile View Toggle */}
        <div className="md:hidden flex bg-slate-100 p-1 rounded-lg mb-6">
              <button
                onClick={() => setView('list')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <List size={16} />
                <span>Tasks</span>
              </button>
              <button
                onClick={() => setView('analytics')}
                className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  view === 'analytics' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <LayoutDashboard size={16} />
                <span>Analytics</span>
              </button>
        </div>

        <StatsCards stats={stats} />

        {loading && tasks.length === 0 ? (
           <div className="text-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-slate-500">Loading tasks from server...</p>
           </div>
        ) : view === 'analytics' ? (
          <AnalyticsDashboard tasks={tasks} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             <div className="lg:col-span-2">
                 <h3 className="text-xl font-bold text-slate-800 mb-4">My Tasks</h3>
                 <TaskList 
                    tasks={filteredTasks} 
                    filter={filter} 
                    setFilter={setFilter} 
                    onDelete={handleDeleteTask}
                    onEdit={handleEditTask}
                />
             </div>
             <div className="lg:col-span-1 hidden lg:block">
                 {/* Mini Analytics for List View - showing only the chart for context */}
                 <h3 className="text-xl font-bold text-slate-800 mb-4">Quick Stats</h3>
                 <div className="space-y-6">
                    <AnalyticsDashboard tasks={tasks} />
                 </div>
             </div>
          </div>
        )}
      </main>

      {/* Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleAddTask}
        initialData={editingTask}
      />
    </div>
  );
};

export default App;