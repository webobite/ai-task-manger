import React from 'react';
import ReactECharts from 'echarts-for-react';
import { useTaskStore } from '../../store/taskStore';
import { format, startOfWeek, addDays } from 'date-fns';

export function TaskChart() {
  const tasks = useTaskStore((state) => state.tasks);
  
  const startDate = startOfWeek(new Date());
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  
  const completedByDay = weekDays.map((day) =>
    tasks.filter(
      (task) =>
        task.completed &&
        format(new Date(task.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).length
  );

  const pendingByDay = weekDays.map((day) =>
    tasks.filter(
      (task) =>
        !task.completed &&
        format(new Date(task.dueDate), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
    ).length
  );

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['Completed', 'Pending'],
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: weekDays.map((day) => format(day, 'EEE')),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: 'Completed',
        type: 'bar',
        data: completedByDay,
        color: '#10B981',
      },
      {
        name: 'Pending',
        type: 'bar',
        data: pendingByDay,
        color: '#3B82F6',
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Weekly Task Overview</h3>
      <ReactECharts option={option} style={{ height: '400px' }} />
    </div>
  );
}