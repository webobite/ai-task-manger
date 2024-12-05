import React from 'react';
import { TaskHistoryEntry, TaskHistoryActionType } from '../types';
import { format } from 'date-fns';
import { Clock, User } from 'lucide-react';

interface TaskHistoryProps {
  history: TaskHistoryEntry[];
}

export function TaskHistory({ history }: TaskHistoryProps) {
  const getActionDescription = (entry: TaskHistoryEntry): string => {
    if (!entry.changes) return 'made changes to the task';

    switch (entry.actionType) {
      case TaskHistoryActionType.Created:
        return 'created the task';
      case TaskHistoryActionType.Updated:
        return `updated ${entry.changes.field}`;
      case TaskHistoryActionType.StatusChanged:
        return `changed status from ${entry.changes.oldValue} to ${entry.changes.newValue}`;
      case TaskHistoryActionType.SubtaskAdded:
        return `added subtask "${entry.changes.newValue}"`;
      case TaskHistoryActionType.SubtaskCompleted:
        return `marked subtask "${entry.changes.oldValue}" as ${entry.changes.newValue ? 'completed' : 'incomplete'}`;
      case TaskHistoryActionType.SubtaskRemoved:
        return `removed subtask "${entry.changes.oldValue}"`;
      case TaskHistoryActionType.PriorityChanged:
        return `changed priority from ${entry.changes.oldValue} to ${entry.changes.newValue}`;
      case TaskHistoryActionType.DueDateChanged:
        return `changed due date from ${format(new Date(entry.changes.oldValue), 'PP')} to ${format(new Date(entry.changes.newValue), 'PP')}`;
      case TaskHistoryActionType.ProjectChanged:
        return `moved task to different project`;
      default:
        return 'made changes to the task';
    }
  };

  if (!history || history.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        No history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Task History</h3>
      <div className="flow-root">
        <ul className="-mb-8">
          {history.map((entry, idx) => (
            <li key={entry.id}>
              <div className="relative pb-8">
                {idx !== history.length - 1 && (
                  <span
                    className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                )}
                <div className="relative flex space-x-3">
                  <div>
                    <span className="h-8 w-8 rounded-full bg-indigo-50 flex items-center justify-center ring-8 ring-white">
                      <User className="h-4 w-4 text-indigo-600" />
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-medium text-gray-900">
                          {entry.userName}
                        </span>{' '}
                        {getActionDescription(entry)}
                      </p>
                    </div>
                    <div className="whitespace-nowrap text-right text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <time dateTime={entry.timestamp}>
                          {format(new Date(entry.timestamp), 'PPp')}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
} 