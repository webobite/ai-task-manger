import React, { useState } from 'react';
import { Clock, CheckCircle2, AlertCircle, Pencil, Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { Task } from '../types/task';
import { cn, formatDate } from '../lib/utils';
import { useTaskStore } from '../store/taskStore';

interface TaskCardProps {
  task: Task;
  onComplete: () => void;
  onEdit: () => void;
  level?: number;
}

export function TaskCard({ task, onComplete, onEdit, level = 0 }: TaskCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const isSubtask = Boolean(task.parentTaskId);
  const subtasks = tasks.filter(t => t.parentTaskId === task.id);
  const hasSubtasks = subtasks.length > 0;
  const isOverdue = !task.completed && new Date(task.dueDate) < new Date();

  const priorityColors = {
    low: 'bg-blue-100 text-blue-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim() && !isSubtask) {
      const newTask: Task = {
        id: Math.random().toString(36).substring(7),
        title: newSubtaskTitle.trim(),
        description: '',
        dueDate: task.dueDate,
        completed: false,
        priority: 'medium',
        status: 'todo',
        projectId: task.projectId,
        parentTaskId: task.id,
      };
      addTask(newTask);
      setNewSubtaskTitle('');
      setShowNewTaskForm(false);
      setIsExpanded(true);
    }
  };

  const handleSubtaskComplete = (subtaskId: string) => {
    const subtask = tasks.find(t => t.id === subtaskId);
    if (subtask) {
      const completed = !subtask.completed;
      updateTask(subtaskId, {
        ...subtask,
        completed,
        status: completed ? 'done' : 'todo'
      });
    }
  };

  return (
    <div style={{ marginLeft: `${level * 24}px` }} className="relative">
      {!isSubtask && level === 0 && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200" />
      )}
      
      <div className={cn(
        "bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow border border-gray-100",
        isOverdue && "border-l-4 border-red-500",
        isSubtask ? "bg-gray-50 hover:bg-gray-100" : "hover:bg-gray-50"
      )}>
        <div className="flex items-center justify-between gap-4">
          {/* Left section with completion status and title */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <button
              onClick={onComplete}
              className={cn(
                'flex-shrink-0 p-1 rounded-full transition-colors',
                task.completed ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
              )}
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                {!isSubtask && hasSubtasks && (
                  <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
                  >
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                )}
                <h3 className={cn(
                  "truncate",
                  isSubtask ? "text-sm" : "text-base font-medium",
                  task.completed && "text-gray-500 line-through"
                )}>
                  {task.title}
                </h3>
              </div>

              {!isSubtask && hasSubtasks && (
                <div className="text-xs text-gray-500 mt-1">
                  {subtasks.filter(t => t.completed).length} of {subtasks.length} subtasks completed
                </div>
              )}
            </div>
          </div>

          {/* Right section with metadata */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {!isSubtask && (
              <span className={cn(
                'px-2 py-1 rounded-full text-xs font-medium',
                task.status === 'todo' ? 'bg-gray-100 text-gray-800' :
                task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                task.status === 'hold' ? 'bg-yellow-100 text-yellow-800' :
                task.status === 'blocked' ? 'bg-red-100 text-red-800' :
                'bg-green-100 text-green-800'
              )}>
                {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
              </span>
            )}

            <span className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              priorityColors[task.priority]
            )}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </span>

            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {formatDate(task.dueDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {!isSubtask && (
                <button
                  onClick={() => setShowNewTaskForm(!showNewTaskForm)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  title="Add subtask"
                >
                  <Plus className="w-5 h-5" />
                </button>
              )}
              <button
                onClick={onEdit}
                className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
              >
                <Pencil className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {task.description && (
          <p className={cn(
            "text-sm text-gray-600 mt-2",
            task.completed && "text-gray-400"
          )}>{task.description}</p>
        )}

        {!isSubtask && showNewTaskForm && (
          <form onSubmit={handleAddSubtask} className="mt-3 flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Enter subtask title"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm"
              autoFocus
            />
            <button
              type="submit"
              className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
            >
              Add
            </button>
          </form>
        )}
      </div>

      {!isSubtask && isExpanded && hasSubtasks && (
        <div className="mt-2 space-y-2 border-l-2 border-gray-100 ml-6">
          {subtasks.map(subtask => (
            <TaskCard
              key={subtask.id}
              task={subtask}
              onComplete={() => handleSubtaskComplete(subtask.id)}
              onEdit={onEdit}
              level={1}
            />
          ))}
        </div>
      )}
    </div>
  );
}