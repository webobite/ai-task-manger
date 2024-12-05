import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { Task, TaskStatus } from '../../types';
import { isWithinInterval, parseISO, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';

interface TaskMetricsProps {
  filters: {
    projectId: string;
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
}

export function TaskMetrics({ filters }: TaskMetricsProps) {
  const tasks = useTaskStore((state) => state.tasks);

  const getDateRange = () => {
    const today = new Date();
    switch (filters.timeRange) {
      case 'today':
        return { start: startOfToday(), end: endOfToday() };
      case 'this-week':
        return { start: startOfWeek(today), end: endOfWeek(today) };
      case 'this-month':
        return { start: startOfMonth(today), end: endOfMonth(today) };
      case 'this-quarter':
        return { start: startOfQuarter(today), end: endOfQuarter(today) };
      case 'this-year':
        return { start: startOfYear(today), end: endOfYear(today) };
      case 'custom':
        return {
          start: filters.startDate ? parseISO(filters.startDate) : startOfMonth(today),
          end: filters.endDate ? parseISO(filters.endDate) : endOfMonth(today),
        };
      default:
        return null;
    }
  };

  const filteredTasks = tasks.filter(task => {
    // Filter by project
    if (filters.projectId !== 'all' && task.projectId !== filters.projectId) {
      return false;
    }

    // Filter by date range
    const dateRange = getDateRange();
    if (dateRange && task.startDate) {
      const taskDate = parseISO(task.startDate);
      return isWithinInterval(taskDate, dateRange);
    }

    return true;
  });

  const totalTasks = filteredTasks.length;
  const completedTasks = filteredTasks.filter(task => task.status === TaskStatus.Completed).length;
  const inProgressTasks = filteredTasks.filter(task => task.status === TaskStatus.InProgress).length;
  const blockedTasks = filteredTasks.filter(task => task.status === TaskStatus.Blocked).length;

  const metrics = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      color: 'bg-blue-100 text-blue-800',
    },
    {
      label: 'Completed',
      value: completedTasks,
      color: 'bg-green-100 text-green-800',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      color: 'bg-yellow-100 text-yellow-800',
    },
    {
      label: 'Blocked',
      value: blockedTasks,
      color: 'bg-red-100 text-red-800',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center"
        >
          <div className={`text-3xl font-bold mb-2 ${metric.color} px-3 py-1 rounded-full`}>
            {metric.value}
          </div>
          <div className="text-gray-600">{metric.label}</div>
        </div>
      ))}
    </div>
  );
}