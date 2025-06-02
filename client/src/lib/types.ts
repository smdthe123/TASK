export type Priority = 'high' | 'medium' | 'low';
export type Category = 'daily-chores' | 'work' | 'academics' | 'social-fun';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  priority: Priority;
  category: Category;
}

export interface UpdateTaskData extends Partial<CreateTaskData> {}

export const categoryConfig = {
  'daily-chores': {
    name: 'Daily Chores',
    color: 'orange',
    bgColors: ['bg-yellow-100', 'bg-green-100', 'bg-blue-100', 'bg-orange-100'],
    icon: 'fa-home'
  },
  'work': {
    name: 'Work',
    color: 'blue',
    bgColors: ['bg-blue-100', 'bg-red-100', 'bg-cyan-100', 'bg-indigo-100'],
    icon: 'fa-briefcase'
  },
  'academics': {
    name: 'Academics',
    color: 'purple',
    bgColors: ['bg-purple-100', 'bg-indigo-100', 'bg-violet-100', 'bg-fuchsia-100'],
    icon: 'fa-graduation-cap'
  },
  'social-fun': {
    name: 'Social & Fun',
    color: 'pink',
    bgColors: ['bg-pink-100', 'bg-rose-100', 'bg-orange-100', 'bg-red-100'],
    icon: 'fa-heart'
  }
} as const;

export const priorityConfig = {
  high: { color: 'red', label: 'High', className: 'priority-high' },
  medium: { color: 'orange', label: 'Medium', className: 'priority-medium' },
  low: { color: 'green', label: 'Low', className: 'priority-low' }
} as const;
