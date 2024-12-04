import React from 'react';
import { format } from 'date-fns';
import { Task, RecurrencePattern } from '../types/task';
import { RecurrenceForm } from './RecurrenceForm';
import { useProjectStore } from '../store/projectStore';
import { useTaskStore } from '../store/taskStore';
import { generateId } from '../lib/utils';
import { Plus, X } from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task) => void;
  onCancel: () => void;
  parentTask?: Task;
}

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'hold', label: 'On Hold' },
  { value: 'blocked', label: 'Blocked' },
  { value: 'done', label: 'Done' },
] as const;

export function TaskForm({ task, onSubmit, onCancel, parentTask }: TaskFormProps) {
  const [title, setTitle] = React.useState(task?.title ?? '');
  const [description, setDescription] = React.useState(task?.description ?? '');
  const [priority, setPriority] = React.useState<Task['priority']>(task?.priority ?? 'medium');
  const [status, setStatus] = React.useState<Task['status']>(task?.status ?? 'todo');
  const [dueDate, setDueDate] = React.useState(
    task?.dueDate ? format(new Date(task.dueDate), "yyyy-MM-dd'T'HH:mm") : format(new Date(), "yyyy-MM-dd'T'HH:mm")
  );
  const [isRecurring, setIsRecurring] = React.useState(!!task?.recurrence);
  const [recurrence, setRecurrence] = React.useState<RecurrencePattern>(
    task?.recurrence ?? { type: 'daily', interval: 1 }
  );
  const [selectedProjectId, setSelectedProjectId] = React.useState(
    task?.projectId ?? parentTask?.projectId ?? useProjectStore.getState().activeProjectId
  );

  const { projects } = useProjectStore();
  const tasks = useTaskStore((state) => state.tasks);
  const [showSubtaskForm, setShowSubtaskForm] = React.useState(false);
  const [subtasks, setSubtasks] = React.useState<string[]>([]);
  const [newSubtask, setNewSubtask] = React.useState('');

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      setSubtasks([...subtasks, newSubtask.trim()]);
      setNewSubtask('');
    }
  };

  const handleRemoveSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: task?.id ?? generateId(),
      title,
      description,
      priority,
      status,
      dueDate: new Date(dueDate),
      completed: status === 'done',
      projectId: selectedProjectId,
      ...(parentTask && { parentTaskId: parentTask.id }),
      ...(isRecurring && { recurrence }),
    };

    // First submit the main task
    onSubmit(newTask);

    // Then create subtasks if any
    if (subtasks.length > 0) {
      subtasks.forEach(subtaskTitle => {
        const subtask: Task = {
          id: generateId(),
          title: subtaskTitle,
          description: '',
          priority: 'medium',
          status: 'todo',
          dueDate: new Date(dueDate),
          completed: false,
          projectId: selectedProjectId,
          parentTaskId: newTask.id,
        };
        onSubmit(subtask);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {parentTask && (
        <div className="bg-gray-50 px-3 py-2 rounded-md text-sm text-gray-600">
          Creating subtask for: <span className="font-medium">{parentTask.title}</span>
        </div>
      )}

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

      {!parentTask && (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">
                Subtasks
              </label>
              <button
                type="button"
                onClick={() => setShowSubtaskForm(!showSubtaskForm)}
                className="text-sm text-indigo-600 hover:text-indigo-700"
              >
                {showSubtaskForm ? 'Hide' : 'Add Subtasks'}
              </button>
            </div>

            {showSubtaskForm && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubtask}
                    onChange={(e) => setNewSubtask(e.target.value)}
                    placeholder="Enter subtask title"
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {subtasks.length > 0 && (
                  <ul className="space-y-2">
                    {subtasks.map((subtask, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                        <span className="text-sm text-gray-700">{subtask}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSubtask(index)}
                          className="text-gray-400 hover:text-red-500"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as Task['status'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <select
                id="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Task['priority'])}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="project" className="block text-sm font-medium text-gray-700">
              Project
            </label>
            <select
              id="project"
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

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

      {!parentTask && (
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
      )}

      {isRecurring && !parentTask && (
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