import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Task, Category } from "@/lib/types";
import { priorityConfig, categoryConfig } from "@/lib/types";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const priority = priorityConfig[task.priority];
  const category = categoryConfig[task.category as Category];
  const bgColors = category.bgColors;
  const randomBgColor = bgColors[task.id % bgColors.length];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        task-card ${randomBgColor} text-gray-800 p-4 rounded-lg cursor-pointer
        ${isDragging ? 'dragging opacity-50' : ''}
        category-${task.category}
        group
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-sm leading-tight flex-1 pr-2">
          {task.title}
        </h3>
        <div className={`
          flex space-x-1 opacity-0 transition-opacity duration-200
          ${isHovered ? 'opacity-100' : ''}
        `}>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-500 hover:text-blue-600"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
          >
            <Edit className="h-3 w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 p-0 text-gray-500 hover:text-red-600"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>
      
      {task.description && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <span className={`
        inline-block px-2 py-1 text-xs rounded font-medium
        ${priority.className}
      `}>
        {priority.label}
      </span>
    </div>
  );
}
