export type Category = 'Personal' | 'Work' | 'Finance' | 'Shopping' | 'Health';
export type TaskStatus = 'Upcoming' | 'Completed' | 'Overdue';

export interface User {
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
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingPayments: number;
  progress: number;
}