import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskCard } from "./task-card";
import type { Task, Category } from "@/lib/types";
import { categoryConfig } from "@/lib/types";

interface CategoryColumnProps {
  category: Category;
  tasks: Task[];
  onAddTask: (category: Category) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}

export function CategoryColumn({ 
  category, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask 
}: CategoryColumnProps) {
  const config = categoryConfig[category];
  const [isHovered, setIsHovered] = useState(false);
  
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  const iconClass = config.icon.startsWith('fa-') ? `fas ${config.icon}` : config.icon;

  return (
    <div 
      className="category-column"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`
        bg-[hsl(var(--navy))] rounded-xl p-6 min-h-[500px] transition-all duration-200
        ${isOver ? 'drop-zone' : ''}
      `}>
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className={`w-3 h-3 rounded-sm bg-${config.color}-400`} />
          <h2 className="text-lg font-semibold text-white">{config.name}</h2>
          <i className={`${iconClass} text-${config.color}-400`} />
        </div>
        
        <p className="text-gray-400 text-sm mb-6">
          {tasks.length} task{tasks.length !== 1 ? 's' : ''}
        </p>
        
        {/* Tasks */}
        <div
          ref={setNodeRef}
          className="space-y-4 min-h-[200px]"
        >
          <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </SortableContext>
        </div>
        
        {/* Add Task Button */}
        <Button
          onClick={() => onAddTask(category)}
          variant="outline"
          className={`
            w-full mt-6 p-4 border-2 border-dashed border-gray-600 
            text-gray-400 bg-transparent rounded-lg transition-all duration-200
            hover:border-${config.color}-400 hover:text-${config.color}-400
            ${isHovered ? `hover:border-${config.color}-400 hover:text-${config.color}-400` : ''}
          `}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>
    </div>
  );
}
