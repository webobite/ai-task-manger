import React from 'react';
import { useProjectStore } from '../store/projectStore';
import { Task, TaskStatus, TaskPriority, RecurrenceType, RecurrencePattern } from '../types';
import { Plus, X } from 'lucide-react';
import { cn } from '../lib/utils';

interface TaskFormProps {
  task?: Task;
  onSubmit: (task: Task | Omit<Task, 'id'>) => void;
  onClose: () => void;
}

export function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const [formData, setFormData] = React.useState<Omit<Task, 'id'>>({
    title: task?.title || '',
    description: task?.description || '',
    projectId: task?.projectId || '',
    status: task?.status || TaskStatus.Todo,
    priority: task?.priority || TaskPriority.Medium,
    dueDate: task?.dueDate || new Date().toISOString().split('T')[0],
    completed: task?.completed || false,
    subtasks: task?.subtasks || [],
    recurrence: task?.recurrence,
  });

  const [showSubtaskForm, setShowSubtaskForm] = React.useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = React.useState('');
  const [isRecurring, setIsRecurring] = React.useState(!!task?.recurrence);
  const [recurrence, setRecurrence] = React.useState<RecurrencePattern>({
    type: task?.recurrence?.type || RecurrenceType.Daily,
    interval: task?.recurrence?.interval || 1,
    daysOfWeek: task?.recurrence?.daysOfWeek || [],
    dayOfMonth: task?.recurrence?.dayOfMonth,
    endDate: task?.recurrence?.endDate,
  });

  const projects = useProjectStore((state) => state.projects);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🚀 TaskForm: Form submission started', { formData, task });

    const submittedTask = {
      ...formData,
      recurrence: isRecurring ? recurrence : undefined,
      ...(task?.id ? { id: task.id } : {}),
    };

    console.log('✨ TaskForm: Submitting task:', submittedTask);
    try {
      onSubmit(submittedTask as Task);
      console.log('✅ TaskForm: Task submitted successfully');
    } catch (error) {
      console.error('❌ TaskForm: Error submitting task:', error);
    }
    onClose();
  };

  const handleUpdateClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log('🖱️ TaskForm: Update button clicked');
    handleSubmit(e as any);
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle.trim()) {
      setFormData(prev => ({
        ...prev,
        subtasks: [
          ...prev.subtasks,
          {
            id: Math.random().toString(36).substr(2, 9),
            title: newSubtaskTitle.trim(),
            completed: false,
          }
        ]
      }));
      setNewSubtaskTitle('');
      setShowSubtaskForm(false);
    }
  };

  const handleRemoveSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  const handleToggleSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      )
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="project" className="block text-sm font-medium text-gray-700">
          Project
        </label>
        <select
          id="project"
          value={formData.projectId}
          onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        >
          <option value="">Select a project</option>
          {projects.map((project) => (
            <option key={project.id} value={project.id}>
              {project.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">
          Status
        </label>
        <select
          id="status"
          value={formData.status}
          onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as TaskStatus }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {Object.values(TaskStatus).map((status) => (
            <option key={status} value={status}>
              {status}
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
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as TaskPriority }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        >
          {Object.values(TaskPriority).map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          type="date"
          id="dueDate"
          value={formData.dueDate?.split('T')[0]}
          onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Subtasks
          </label>
          <button
            type="button"
            onClick={() => setShowSubtaskForm(true)}
            className="text-sm text-indigo-600 hover:text-indigo-500"
          >
            Add Subtask
          </button>
        </div>

        {showSubtaskForm && (
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Subtask title"
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="button"
              onClick={handleAddSubtask}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="space-y-2">
          {formData.subtasks?.map((subtask) => (
            <div key={subtask.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={subtask.completed}
                onChange={() => handleToggleSubtask(subtask.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className={cn(
                "flex-1 text-sm",
                subtask.completed && "line-through text-gray-500"
              )}>
                {subtask.title}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveSubtask(subtask.id)}
                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            id="isRecurring"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm text-gray-900">
            Recurring Task
          </label>
        </div>

        {isRecurring && (
          <div className="space-y-4 pl-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recurrence Type
              </label>
              <select
                value={recurrence.type}
                onChange={(e) => setRecurrence(prev => ({ ...prev, type: e.target.value as RecurrenceType }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                {Object.values(RecurrenceType).map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Interval
              </label>
              <input
                type="number"
                min="1"
                value={recurrence.interval}
                onChange={(e) => setRecurrence(prev => ({ ...prev, interval: parseInt(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>

            {recurrence.type === RecurrenceType.Weekly && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Days of Week
                </label>
                <div className="mt-2 space-x-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <label key={day} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        checked={recurrence.daysOfWeek?.includes(index) || false}
                        onChange={(e) => {
                          const days = recurrence.daysOfWeek || [];
                          setRecurrence(prev => ({
                            ...prev,
                            daysOfWeek: e.target.checked
                              ? [...days, index]
                              : days.filter(d => d !== index)
                          }));
                        }}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{day}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {recurrence.type === RecurrenceType.Monthly && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Day of Month
                </label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={recurrence.dayOfMonth || 1}
                  onChange={(e) => setRecurrence(prev => ({ ...prev, dayOfMonth: parseInt(e.target.value) }))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                End Date (Optional)
              </label>
              <input
                type="date"
                value={recurrence.endDate || ''}
                onChange={(e) => setRecurrence(prev => ({ ...prev, endDate: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleUpdateClick}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {task ? 'Update' : 'Create'} Task
        </button>
      </div>
    </form>
  );
}