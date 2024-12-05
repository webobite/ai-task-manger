import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { Task, TaskStatus, TaskPriority } from '../../types';
import { isWithinInterval, parseISO, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface TaskProgressChartsProps {
  filters: {
    projectId: string;
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
}

const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280'];

export function TaskProgressCharts({ filters }: TaskProgressChartsProps) {
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

  // Prepare data for status distribution pie chart
  const statusData = [
    { name: 'Completed', value: filteredTasks.filter(t => t.status === TaskStatus.Completed).length },
    { name: 'In Progress', value: filteredTasks.filter(t => t.status === TaskStatus.InProgress).length },
    { name: 'Blocked', value: filteredTasks.filter(t => t.status === TaskStatus.Blocked).length },
    { name: 'On Hold', value: filteredTasks.filter(t => t.status === TaskStatus.OnHold).length },
  ].filter(item => item.value > 0);

  // Prepare data for priority distribution bar chart
  const priorityData = [
    { name: 'High', value: filteredTasks.filter(t => t.priority === TaskPriority.High).length },
    { name: 'Medium', value: filteredTasks.filter(t => t.priority === TaskPriority.Medium).length },
    { name: 'Low', value: filteredTasks.filter(t => t.priority === TaskPriority.Low).length },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => 
                    `${name} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Task Priority Distribution</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" name="Tasks" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
} 