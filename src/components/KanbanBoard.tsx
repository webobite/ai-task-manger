import React, { useRef } from 'react';
import { Task } from '../types/task';
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: Task['status']) => void;
}

interface KanbanColumnProps {
  title: string;
  tasks: Task[];
  status: Task['status'];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onDrop: (taskId: string, status: Task['status']) => void;
}

const DEFAULT_COLUMNS: { status: Task['status']; title: string; color: string }[] = [
  { status: 'todo', title: 'To Do', color: 'bg-gray-100' },
  { status: 'in-progress', title: 'In Progress', color: 'bg-blue-50' },
  { status: 'done', title: 'Done', color: 'bg-green-50' },
];

const OPTIONAL_COLUMNS: { status: Task['status']; title: string; color: string }[] = [
  { status: 'hold', title: 'On Hold', color: 'bg-yellow-50' },
  { status: 'blocked', title: 'Blocked', color: 'bg-red-50' },
];

function KanbanColumn({ title, tasks, status, onEdit, onDelete, onDrop }: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    onDrop(taskId, status);
  };

  return (
    <div
      className="flex flex-col h-full"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between p-3 border-b bg-white bg-opacity-50">
        <h3 className="font-medium">{title}</h3>
        <span className="text-sm text-gray-500">{tasks.length}</span>
      </div>
      <div className="flex-1 p-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent hover:scrollbar-thumb-gray-400">
        <div className="space-y-2">
          {tasks.map(task => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('taskId', task.id);
              }}
              className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-move group"
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="font-medium">{task.title}</h4>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(task)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{task.description}</p>
              )}
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  task.priority === 'high' ? 'bg-red-100 text-red-800' :
                  task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                <span className="text-xs text-gray-500">
                  {format(new Date(task.dueDate), 'MMM d')}
                </span>
              </div>
            </div>
          ))}
          {tasks.length === 0 && (
            <div className="text-sm text-gray-500 text-center py-4">
              Drop tasks here
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  const [showOptionalColumns, setShowOptionalColumns] = React.useState(false);
  const [optionalColumnsWithTasks, setOptionalColumnsWithTasks] = React.useState(false);
  const optionalColumnsRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const hasTasksInOptionalColumns = tasks.some(task => 
      task.status === 'hold' || task.status === 'blocked'
    );
    setOptionalColumnsWithTasks(hasTasksInOptionalColumns);
  }, [tasks]);

  const handleToggleOptionalColumns = () => {
    setShowOptionalColumns(prev => !prev);
    if (!showOptionalColumns && optionalColumnsRef.current) {
      setTimeout(() => {
        optionalColumnsRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      {(optionalColumnsWithTasks || showOptionalColumns) && (
        <div className="flex justify-end">
          <button
            onClick={handleToggleOptionalColumns}
            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50"
          >
            <MoreHorizontal className="w-4 h-4" />
            {showOptionalColumns ? 'Hide' : 'Show'} Optional Columns
            {!showOptionalColumns && optionalColumnsWithTasks && (
              <span className="ml-1 bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full text-xs">
                Has Tasks
              </span>
            )}
          </button>
        </div>
      )}

      <div className="space-y-4">
        {/* Default Columns */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {DEFAULT_COLUMNS.map(({ status, title, color }) => (
            <div key={status} className={`flex flex-col flex-1 min-w-[300px] h-[calc(100vh-250px)] rounded-lg ${color}`}>
              <KanbanColumn
                title={title}
                tasks={tasks.filter(task => task.status === status)}
                status={status}
                onEdit={onEdit}
                onDelete={onDelete}
                onDrop={onStatusChange}
              />
            </div>
          ))}
        </div>

        {/* Optional Columns */}
        {showOptionalColumns && (
          <div 
            ref={optionalColumnsRef}
            className="flex gap-4 overflow-x-auto pb-4 transition-all duration-300 ease-in-out"
          >
            {OPTIONAL_COLUMNS.map(({ status, title, color }) => (
              <div key={status} className={`flex flex-col flex-1 min-w-[300px] h-[calc(100vh-250px)] rounded-lg ${color}`}>
                <KanbanColumn
                  title={title}
                  tasks={tasks.filter(task => task.status === status)}
                  status={status}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onDrop={onStatusChange}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 