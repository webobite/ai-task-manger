import React from 'react';
import { format } from 'date-fns';
import { Task, RecurrencePattern } from '../types/task';
import { generateId } from '../lib/utils';
import { RecurrenceForm } from './RecurrenceForm';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
}

export function TaskForm({ task, onSubmit, onCancel }: TaskFormProps) {
  const [title, setTitle] = React.useState(task?.title ?? '');
  const [description, setDescription] = React.useState(task?.description ?? '');
  const [priority, setPriority] = React.useState(task?.priority ?? 'medium');
  const [dueDate, setDueDate] = React.useState(
    task?.dueDate ? format(task.dueDate, "yyyy-MM-dd'T'HH:mm") : ''
  );
  const [isRecurring, setIsRecurring] = React.useState(!!task?.recurrence);
  const [recurrence, setRecurrence] = React.useState<RecurrencePattern>(
    task?.recurrence ?? { type: 'daily', interval: 1 }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: task?.id ?? generateId(),
      title,
      description,
      priority: priority as Task['priority'],
      dueDate: new Date(dueDate),
      completed: task?.completed ?? false,
      ...(isRecurring && { recurrence }),
    };
    onSubmit(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
          Priority
        </label>
        <select
          id="priority"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="datetime-local"
          id="dueDate"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="recurring"
          checked={isRecurring}
          onChange={(e) => setIsRecurring(e.target.checked)}
          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
        />
        <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
          Recurring Task
        </label>
      </div>

      {isRecurring && (
        <RecurrenceForm value={recurrence} onChange={setRecurrence} />
      )}

      <div className="flex justify-end gap-2 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          {task ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}