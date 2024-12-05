import React, { useState } from 'react';
import { Task } from '../types';
import { format } from 'date-fns';
import { Pencil, Trash2, RotateCw } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskForm } from './TaskForm';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (updatedTask: Task | Omit<Task, 'id'>) => {
    const finalTask = {
      ...(updatedTask as Omit<Task, 'id'>),
      id: task.id,
    };
    onEdit(finalTask);
    setShowEditModal(false);
  };

  const stopPropagation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <>
      <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className={cn(
              "font-medium",
              task.completed && "line-through text-gray-500"
            )}>
              {task.title}
            </h3>
            {task.recurrence && (
              <RotateCw className="w-4 h-4 text-gray-400" />
            )}
          </div>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => {
                stopPropagation(e);
                setShowEditModal(true);
              }}
              className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                stopPropagation(e);
                onDelete(task.id);
              }}
              className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {task.description && (
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 mt-2">
          <span className={cn(
            "px-2 py-0.5 rounded-full text-xs font-medium",
            task.priority === 'High' ? 'bg-red-100 text-red-800' :
            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          )}>
            {task.priority}
          </span>
          <span className={cn(
            "text-xs",
            new Date(task.dueDate) < new Date() && !task.completed
              ? "text-red-600 font-medium"
              : "text-gray-500"
          )}>
            {format(new Date(task.dueDate), 'MMM d')}
          </span>
          {task.subtasks?.length > 0 && (
            <span className="text-xs text-gray-500">
              {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length}
            </span>
          )}
        </div>
      </div>

      {showEditModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            stopPropagation(e);
            setShowEditModal(false);
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={stopPropagation}
          >
            <TaskForm
              task={task}
              onSubmit={handleEdit}
              onClose={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}