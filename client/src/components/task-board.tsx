import { useState, useEffect } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import { RefreshCw, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryColumn } from "./category-column";
import { TaskModal } from "./task-modal";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/hooks/use-tasks";
import { useToast } from "@/hooks/use-toast";
import type { Task, Category, CreateTaskData } from "@/lib/types";
import { categoryConfig } from "@/lib/types";

export function TaskBoard() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultCategory, setDefaultCategory] = useState<Category>("daily-chores");
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const { data: tasks = [], isLoading, refetch } = useTasks();
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Group tasks by category
  const tasksByCategory = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<Category, Task[]>);

  const handleAddTask = (category: Category) => {
    setDefaultCategory(category);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setDefaultCategory(task.category);
    setIsModalOpen(true);
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await deleteTaskMutation.mutateAsync(id);
        toast({
          title: "Task deleted",
          description: "Task has been deleted successfully.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete task. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleModalSubmit = async (data: CreateTaskData) => {
    try {
      if (editingTask) {
        await updateTaskMutation.mutateAsync({
          id: editingTask.id,
          data,
        });
        toast({
          title: "Task updated",
          description: "Task has been updated successfully.",
        });
      } else {
        await createTaskMutation.mutateAsync(data);
        toast({
          title: "Task created",
          description: "New task has been added successfully.",
        });
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingTask ? "update" : "create"} task. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = tasks.find(t => t.id === event.active.id);
    setDraggedTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over || !draggedTask) {
      setDraggedTask(null);
      return;
    }

    const newCategory = over.id as Category;
    
    if (draggedTask.category !== newCategory) {
      try {
        await updateTaskMutation.mutateAsync({
          id: draggedTask.id,
          data: { category: newCategory },
        });
        toast({
          title: "Task moved",
          description: `Task moved to ${categoryConfig[newCategory].name}`,
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to move task. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    setDraggedTask(null);
  };

  const timeString = currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-[hsl(var(--dark-navy))] text-white">
      {/* Header */}
      <header className="px-6 py-6 border-b border-[hsl(var(--light-navy))]">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <span className="text-gray-400 text-lg">{timeString}</span>
              <h1 className="text-2xl font-semibold">Hello John Doe</h1>
            </div>
            <p className="text-gray-400 text-sm">
              John Doe, your presence brings positivity to the space.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-[hsl(var(--light-navy))] text-gray-400 hover:text-white"
            >
              <Sun className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-2 hover:bg-[hsl(var(--light-navy))] text-gray-400 hover:text-white"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {(Object.keys(categoryConfig) as Category[]).map((category) => (
              <CategoryColumn
                key={category}
                category={category}
                tasks={tasksByCategory[category] || []}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </DndContext>
      </main>

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleModalSubmit}
        task={editingTask}
        defaultCategory={defaultCategory}
        isLoading={createTaskMutation.isPending || updateTaskMutation.isPending}
      />
    </div>
  );
}
