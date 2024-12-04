import React from 'react';
import { Clock, CheckCircle2, AlertCircle, Pencil } from 'lucide-react';
import { Task } from '../types/task';
import { cn, formatDate } from '../lib/utils';

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
}

export function TaskCard({ task, onComplete, onEdit }: TaskCardProps) {
  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  return (
    <div className={cn(
      "bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow",
      isOverdue && "border-l-4 border-red-500"
    )}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <h3 className={cn(
            "text-lg font-semibold",
            task.completed && "text-gray-500 line-through"
          )}>{task.title}</h3>
          {isOverdue && (
            <span className="text-xs text-red-500 font-medium">OVERDUE</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Pencil className="w-5 h-5" />
          </button>
          <button
            onClick={onComplete}
            className={cn(
              'p-1 rounded-full transition-colors',
              task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
            )}
          >
            <CheckCircle2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {task.description && (
        <p className={cn(
          "text-gray-600 mb-3",
          task.completed && "text-gray-400"
        )}>{task.description}</p>
      )}
      
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-gray-500" />
        <span className="text-sm text-gray-600">
          {formatDate(task.dueDate)}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span
          className={cn(
            'px-2 py-1 rounded-full text-xs font-medium',
            priorityColors[task.priority]
          )}
        >
          {task.priority}
        </span>
        
        {task.recurrence && (
          <div className="flex items-center gap-1 text-gray-600">
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">Recurring</span>
          </div>
        )}
      </div>
    </div>
  );
}