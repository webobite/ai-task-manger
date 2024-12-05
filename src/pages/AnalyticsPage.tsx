import React, { useState } from 'react';
import { TaskMetrics } from '../components/analytics/TaskMetrics';
import { TaskProgressCharts } from '../components/analytics/TaskProgressCharts';
import { ProjectGanttChart } from '../components/analytics/ProjectGanttChart';
import { TaskGanttChart } from '../components/analytics/TaskGanttChart';
import { useProjectStore } from '../store/projectStore';
import { Filter, X, Calendar, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

interface AnalyticsFilters {
  projectId: string;
  timeRange: string;
  startDate?: string;
  endDate?: string;
}

const TIME_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'this-year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

export function AnalyticsPage() {
  const projects = useProjectStore((state) => state.projects);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<AnalyticsFilters>({
    projectId: 'all',
    timeRange: 'this-month',
  });

  const handleFilterChange = (key: keyof AnalyticsFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      projectId: 'all',
      timeRange: 'this-month',
    });
  };

  const hasActiveFilters = filters.projectId !== 'all' || filters.timeRange !== 'this-month';

  const getActiveFilters = () => {
    const activeFilters = [];

    // Project filter
    if (filters.projectId === 'all') {
      activeFilters.push({
        key: 'project',
        label: 'All Projects',
        icon: <Briefcase className="w-3 h-3" />,
        isDefault: true,
      });
    } else {
      const project = projects.find(p => p.id === filters.projectId);
      if (project) {
        activeFilters.push({
          key: 'project',
          label: project.name,
          icon: <Briefcase className="w-3 h-3" />,
          onRemove: () => handleFilterChange('projectId', 'all'),
        });
      }
    }

    // Time range filter
    const timeRange = TIME_RANGE_OPTIONS.find(opt => opt.value === filters.timeRange);
    if (timeRange) {
      if (filters.timeRange === 'custom' && filters.startDate && filters.endDate) {
        activeFilters.push({
          key: 'timeRange',
          label: `${filters.startDate} to ${filters.endDate}`,
          icon: <Calendar className="w-3 h-3" />,
          onRemove: () => handleFilterChange('timeRange', 'this-month'),
        });
      } else {
        activeFilters.push({
          key: 'timeRange',
          label: timeRange.label,
          icon: <Calendar className="w-3 h-3" />,
          isDefault: filters.timeRange === 'this-month',
          onRemove: filters.timeRange !== 'this-month' 
            ? () => handleFilterChange('timeRange', 'this-month')
            : undefined,
        });
      }
    }

    return activeFilters;
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your task progress and productivity metrics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border",
              showFilters
                ? "border-indigo-500 text-indigo-600 bg-indigo-50"
                : "border-gray-300 text-gray-700 hover:bg-gray-50"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      <div className="flex flex-wrap gap-2">
        {getActiveFilters().map(filter => (
          <div
            key={filter.key}
            className={cn(
              "flex items-center gap-1.5 px-2 py-1 rounded-full text-sm",
              filter.isDefault 
                ? "bg-gray-100 text-gray-700"
                : "bg-indigo-50 text-indigo-700"
            )}
          >
            {filter.icon}
            {filter.label}
            {filter.onRemove && (
              <button
                onClick={filter.onRemove}
                className="p-0.5 hover:bg-indigo-100 rounded-full"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Project Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={filters.projectId}
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
                className="w-full rounded-md border-gray-300"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Time Range Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Range
              </label>
              <select
                value={filters.timeRange}
                onChange={(e) => handleFilterChange('timeRange', e.target.value)}
                className="w-full rounded-md border-gray-300"
              >
                {TIME_RANGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {filters.timeRange === 'custom' && (
              <div className="col-span-full grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KPIs and Time-based Metrics */}
      <TaskMetrics filters={filters} />

      {/* Task Progress Charts */}
      <TaskProgressCharts filters={filters} />

      {/* Project Timeline */}
      <ProjectGanttChart filters={filters} />

      {/* Task Gantt Chart */}
      <TaskGanttChart filters={filters} />
    </div>
  );
} 