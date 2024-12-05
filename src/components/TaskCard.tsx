import React, { useState } from 'react';
import { Task } from '../types';
import { format } from 'date-fns';
import { Pencil, Trash2, RotateCw, PlayCircle, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskForm } from './TaskForm';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);

  const handleEdit = (updatedTask: Task) => {
    onEdit(updatedTask);
    setShowEditForm(false);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      {showEditForm ? (
        <TaskForm task={task} onSubmit={handleEdit} onClose={() => setShowEditForm(false)} />
      ) : (
        <>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900">{task.title}</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowEditForm(true)}
                className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          )}

          <div className="mt-3 space-y-2">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className={cn(
                "px-2 py-1 rounded-full",
                task.priority === 'high' && "bg-red-100 text-red-700",
                task.priority === 'medium' && "bg-yellow-100 text-yellow-700",
                task.priority === 'low' && "bg-green-100 text-green-700"
              )}>
                {task.priority}
              </span>
              <span className="flex items-center gap-1">
                <RotateCw className="w-3 h-3" />
                {format(new Date(task.dueDate), 'MMM d, yyyy')}
              </span>
            </div>

            {/* Display start and end dates if available */}
            <div className="flex flex-wrap gap-3 text-xs text-gray-500">
              {task.startDate && (
                <span className="flex items-center gap-1">
                  <PlayCircle className="w-3 h-3 text-blue-500" />
                  Started: {format(new Date(task.startDate), 'MMM d, yyyy HH:mm')}
                </span>
              )}
              {task.endDate && (
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  Ended: {format(new Date(task.endDate), 'MMM d, yyyy HH:mm')}
                </span>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}