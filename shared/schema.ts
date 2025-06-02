import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  priority: text("priority").notNull(), // 'high', 'medium', 'low'
  category: text("category").notNull(), // 'daily-chores', 'work', 'academics', 'social-fun'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTaskSchema = createInsertSchema(tasks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateTaskSchema = insertTaskSchema.partial();

export type InsertTask = z.infer<typeof insertTaskSchema>;
export type UpdateTask = z.infer<typeof updateTaskSchema>;
export type Task = typeof tasks.$inferSelect;

export const priorities = ['high', 'medium', 'low'] as const;
export const categories = ['daily-chores', 'work', 'academics', 'social-fun'] as const;

export type Priority = typeof priorities[number];
export type Category = typeof categories[number];
