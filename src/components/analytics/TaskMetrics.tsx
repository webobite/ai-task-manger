import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { CheckCircle, Clock, AlertTriangle, Repeat } from 'lucide-react';

export function TaskMetrics() {
  const tasks = useTaskStore((state) => state.tasks);

  const metrics = {
    completed: tasks.filter((t) => t.completed).length,
    pending: tasks.filter((t) => !t.completed).length,
    overdue: tasks.filter(
      (t) => !t.completed && new Date(t.dueDate) < new Date()
    ).length,
    recurring: tasks.filter((t) => t.recurrence).length,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        title="Completed Tasks"
        value={metrics.completed}
        icon={CheckCircle}
        color="text-green-500"
      />
      <MetricCard
        title="Pending Tasks"
        value={metrics.pending}
        icon={Clock}
        color="text-blue-500"
      />
      <MetricCard
        title="Overdue Tasks"
        value={metrics.overdue}
        icon={AlertTriangle}
        color="text-red-500"
      />
      <MetricCard
        title="Recurring Tasks"
        value={metrics.recurring}
        icon={Repeat}
        color="text-purple-500"
      />
    </div>
  );
}

interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ElementType;
  color: string;
}

function MetricCard({ title, value, icon: Icon, color }: MetricCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-semibold mt-1">{value}</p>
        </div>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );
}