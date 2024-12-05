import React, { useState } from 'react';
import { Task, TaskPriority } from '../types';
import { format } from 'date-fns';
import { Pencil, Trash2, RotateCw, PlayCircle, CheckCircle, History, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { TaskForm } from './TaskForm';
import { TaskHistory } from './TaskHistory';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showEditForm, setShowEditForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const handleEdit = (updatedTask: Task) => {
    onEdit(updatedTask);
    setShowEditForm(false);
  };

  const TaskEditModal = ({ task, onClose, onUpdate }: { task: Task; onClose: () => void; onUpdate: (task: Task) => void }) => {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl h-[90vh] flex flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Edit Task</h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 min-h-0">
            <TaskForm
              task={task}
              onSubmit={onUpdate}
              onClose={onClose}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium text-gray-900">{task.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowHistory(true)}
              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
              title="View History"
            >
              <History className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowEditForm(true)}
              className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
              title="Edit Task"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
              title="Delete Task"
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
              task.priority === TaskPriority.High && "bg-red-100 text-red-700",
              task.priority === TaskPriority.Medium && "bg-yellow-100 text-yellow-700",
              task.priority === TaskPriority.Low && "bg-green-100 text-green-700"
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

          {/* Subtasks section */}
          {task.subtasks.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Subtasks</h4>
              <div className="space-y-2">
                {task.subtasks.map((subtask) => (
                  <div key={subtask.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={subtask.completed}
                      readOnly
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className={cn(
                      "text-sm",
                      subtask.completed && "line-through text-gray-500"
                    )}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Task Modal */}
      {showEditForm && (
        <TaskEditModal
          task={task}
          onClose={() => setShowEditForm(false)}
          onUpdate={handleEdit}
        />
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Task History</h2>
              <button
                onClick={() => setShowHistory(false)}
                className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <TaskHistory history={task.history} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}