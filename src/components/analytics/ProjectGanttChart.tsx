import React from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { Task, TaskStatus, Project } from '../../types';
import { isWithinInterval, parseISO, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, format, differenceInDays } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

interface ProjectGanttChartProps {
  filters: {
    projectId: string;
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
}

interface ProjectTimelineData {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  completedTasks: number;
  totalTasks: number;
  color: string;
}

export function ProjectGanttChart({ filters }: ProjectGanttChartProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);

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

  // Get project timeline data
  const projectData: ProjectTimelineData[] = projects
    .map(project => {
      const projectTasks = tasks.filter(task => task.projectId === project.id);
      
      if (projectTasks.length === 0) return null;

      const startDates = projectTasks
        .map(task => task.startDate ? new Date(task.startDate) : null)
        .filter((date): date is Date => date !== null);
      
      const endDates = projectTasks
        .map(task => task.endDate ? new Date(task.endDate) : null)
        .filter((date): date is Date => date !== null);

      if (startDates.length === 0 || endDates.length === 0) return null;

      const projectStartDate = new Date(Math.min(...startDates.map(d => d.getTime())));
      const projectEndDate = new Date(Math.max(...endDates.map(d => d.getTime())));

      return {
        id: project.id,
        name: project.name,
        startDate: projectStartDate,
        endDate: projectEndDate,
        completedTasks: projectTasks.filter(task => task.status === TaskStatus.Completed).length,
        totalTasks: projectTasks.length,
        color: project.color || '#6366F1',
      };
    })
    .filter((data): data is ProjectTimelineData => data !== null);

  // Filter projects based on date range
  const dateRange = getDateRange();
  const filteredProjects = dateRange
    ? projectData.filter(project =>
        isWithinInterval(project.startDate, dateRange) ||
        isWithinInterval(project.endDate, dateRange)
      )
    : projectData;

  // Sort projects by start date
  const sortedProjects = [...filteredProjects].sort(
    (a, b) => a.startDate.getTime() - b.startDate.getTime()
  );

  // Prepare data for the chart
  const chartData = sortedProjects.map(project => ({
    name: project.name,
    duration: differenceInDays(project.endDate, project.startDate),
    startDate: format(project.startDate, 'MMM dd'),
    endDate: format(project.endDate, 'MMM dd'),
    progress: Math.round((project.completedTasks / project.totalTasks) * 100),
    color: project.color,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            barSize={20}
            margin={{ top: 20, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="name"
              width={150}
            />
            <Tooltip
              formatter={(value: any, name: string, props: any) => {
                const data = props.payload;
                return [
                  `Duration: ${value} days`,
                  `Start: ${data.startDate}`,
                  `End: ${data.endDate}`,
                  `Progress: ${data.progress}%`,
                ];
              }}
            />
            <Legend />
            <Bar
              dataKey="duration"
              name="Duration (days)"
              background={{ fill: '#eee' }}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 