import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskCard } from "./task-card";
import type { Task, Category } from "@/lib/types";
import { categoryConfig } from "@/lib/types";

interface CategoryColumnProps {
  category: Category;
  tasks: Task[];
  onAddTask: (category: Category) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
  categoryName?: string;
  onUpdateCategoryName?: (category: Category, newName: string) => void;
}

export function CategoryColumn({ 
  category, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  categoryName,
  onUpdateCategoryName
}: CategoryColumnProps) {
  const config = categoryConfig[category];
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(categoryName || config.name);
  
  const { setNodeRef, isOver } = useDroppable({
    id: category,
  });

  const handleSaveName = () => {
    if (onUpdateCategoryName && editName.trim()) {
      onUpdateCategoryName(category, editName.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditName(categoryName || config.name);
    setIsEditing(false);
  };

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
          {isEditing ? (
            <div className="flex items-center gap-2 flex-1">
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="bg-[hsl(var(--light-navy))] border-gray-600 text-white text-lg font-semibold h-8 px-2"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveName();
                  if (e.key === 'Escape') handleCancelEdit();
                }}
                autoFocus
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSaveName}
                className="h-8 w-8 p-0 text-green-400 hover:text-green-300"
              >
                <Check className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancelEdit}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2 flex-1 group">
              <h2 className="text-lg font-semibold text-white flex-1">
                {categoryName || config.name}
              </h2>
              {onUpdateCategoryName && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  className="h-6 w-6 p-0 text-gray-500 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Edit2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          )}
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
