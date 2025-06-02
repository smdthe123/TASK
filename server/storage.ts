import { tasks, type Task, type InsertTask, type UpdateTask } from "@shared/schema";

export interface IStorage {
  getAllTasks(): Promise<Task[]>;
  getTasksByCategory(category: string): Promise<Task[]>;
  getTask(id: number): Promise<Task | undefined>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, updates: UpdateTask): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private tasks: Map<number, Task>;
  private currentId: number;

  constructor() {
    this.tasks = new Map();
    this.currentId = 1;
    
    // Initialize with some default tasks
    this.initializeDefaultTasks();
  }

  private initializeDefaultTasks() {
    const defaultTasks: Omit<Task, 'id'>[] = [
      {
        title: 'Make Bed & Clean Room',
        description: 'Start your day with a clean space',
        priority: 'high',
        category: 'daily-chores',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Evening Walk',
        description: '30-minute walk to refresh body and mind',
        priority: 'low',
        category: 'daily-chores',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'German Duolingo Lesson',
        description: 'Complete today\'s German lesson on Duolingo',
        priority: 'medium',
        category: 'daily-chores',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Team Meeting',
        description: 'Stand-up call at 10:00 AM with team',
        priority: 'high',
        category: 'work',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Fix Login Bug',
        description: 'Resolve authentication redirect issue',
        priority: 'high',
        category: 'work',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Mail HR',
        description: 'Send updated documents to HR and confirm joining',
        priority: 'high',
        category: 'work',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Study Cloud Computing',
        description: 'Review short notes and solve MCQs',
        priority: 'medium',
        category: 'academics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Submit Assignment',
        description: 'Upload DSA assignment on portal',
        priority: 'medium',
        category: 'academics',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Watch a Movie',
        description: 'Relax with a good movie or series episode',
        priority: 'low',
        category: 'social-fun',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        title: 'Catch Up with Friends',
        description: 'Call or meet a friend you haven\'t talked to in a while',
        priority: 'medium',
        category: 'social-fun',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    defaultTasks.forEach(task => {
      const newTask: Task = { ...task, id: this.currentId++ };
      this.tasks.set(newTask.id, newTask);
    });
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values()).sort((a, b) => 
      new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
    );
  }

  async getTasksByCategory(category: string): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.category === category)
      .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async createTask(insertTask: InsertTask): Promise<Task> {
    const now = new Date();
    const task: Task = {
      ...insertTask,
      id: this.currentId++,
      createdAt: now,
      updatedAt: now,
    };
    
    this.tasks.set(task.id, task);
    return task;
  }

  async updateTask(id: number, updates: UpdateTask): Promise<Task | undefined> {
    const existingTask = this.tasks.get(id);
    if (!existingTask) {
      return undefined;
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      updatedAt: new Date(),
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
}

export const storage = new MemStorage();
