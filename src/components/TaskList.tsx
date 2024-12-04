import React from 'react';
import { useTaskStore } from '../store/taskStore';
import { TaskCard } from './TaskCard';
import { Task } from '../types/task';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  limit?: number;
}

export function TaskList({ onEditTask, limit }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const toggleComplete = useTaskStore((state) => state.toggleComplete);

  const sortedTasks = [...tasks]
    .sort((a, b) => {
      if (a.completed === b.completed) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return a.completed ? 1 : -1;
    })
    .slice(0, limit);

  return (
    <div className="space-y-4">
      {sortedTasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onComplete={() => toggleComplete(task.id)}
          onEdit={() => onEditTask(task)}
        />
      ))}
      {sortedTasks.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No tasks yet. Click the "New Task" button to create one!
        </div>
      )}
    </div>
  );
}