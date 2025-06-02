import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import type { Task, Category, Priority } from "@/lib/types";
import { categoryConfig } from "@/lib/types";

const taskSchema = z.object({
  title: z.string().min(1, "Task title is required").max(100, "Title too long"),
  description: z.string().max(500, "Description too long").optional(),
  priority: z.enum(["high", "medium", "low"]),
  category: z.enum(["daily-chores", "work", "academics", "social-fun"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => void;
  task?: Task | null;
  defaultCategory?: Category;
  isLoading?: boolean;
}

export function TaskModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task, 
  defaultCategory = "daily-chores",
  isLoading = false 
}: TaskModalProps) {
  const form = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium" as Priority,
      category: defaultCategory,
    },
  });

  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        form.reset({
          title: task.title,
          description: task.description || "",
          priority: task.priority,
          category: task.category,
        });
      } else {
        form.reset({
          title: "",
          description: "",
          priority: "medium",
          category: defaultCategory,
        });
      }
    }
  }, [isOpen, task, defaultCategory, form]);

  const handleSubmit = (data: TaskFormData) => {
    onSubmit(data);
    form.reset();
  };

  const title = task ? "Edit Task" : "Add New Task";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[hsl(var(--navy))] border-gray-600 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Task Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter task title"
                      className="bg-[hsl(var(--light-navy))] border-gray-600 text-white focus:border-blue-400"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter task description"
                      rows={3}
                      className="bg-[hsl(var(--light-navy))] border-gray-600 text-white focus:border-blue-400 resize-none"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="bg-[hsl(var(--light-navy))] border-gray-600 text-white focus:border-blue-400">
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[hsl(var(--navy))] border-gray-600 text-white">
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <FormControl>
                        <SelectTrigger className="bg-[hsl(var(--light-navy))] border-gray-600 text-white focus:border-blue-400">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-[hsl(var(--navy))] border-gray-600 text-white">
                        {Object.entries(categoryConfig).map(([key, config]) => (
                          <SelectItem key={key} value={key}>
                            {config.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-600 text-gray-400 hover:bg-[hsl(var(--light-navy))]"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : task ? "Save Changes" : "Add Task"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
