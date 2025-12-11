
export type Category = 'Personal' | 'Work' | 'Finance' | 'Shopping' | 'Health';
export type TaskStatus = 'Upcoming' | 'Completed' | 'Overdue';

export interface User {
  id?: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: Category;
  amount: number;
  dueDate: string; // YYYY-MM-DD
  status: TaskStatus;
  notes?: string;
  reminder?: boolean;
  userId?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingPayments: number;
  progress: number;
}

export interface UserStat {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  totalTasks: number;
  completedTasks: number;
  totalSpent: number;
  lastLogin: string;
}
