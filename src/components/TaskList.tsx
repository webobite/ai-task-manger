import React, { useState } from 'react';
import { Task, TaskStatus, TaskPriority, Project } from '../types';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { KanbanBoard } from './KanbanBoard';
import { Pencil, Trash2, Filter, X, LayoutGrid, List, Search, ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown, SettingsIcon } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, isPast, startOfToday, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  projectId?: string;
}

interface TaskFilters {
  projectId: string;
  priority: string;
  status: string;
  dueDate: string;
  timeGrain: string;
  customStartDate?: string;
  customEndDate?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

const PRIORITY_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Priorities' },
  { value: TaskPriority.High, label: 'High Priority' },
  { value: TaskPriority.Medium, label: 'Medium Priority' },
  { value: TaskPriority.Low, label: 'Low Priority' },
];

const STATUS_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Statuses' },
  { value: TaskStatus.Todo, label: 'To Do' },
  { value: TaskStatus.InProgress, label: 'In Progress' },
  { value: TaskStatus.OnHold, label: 'On Hold' },
  { value: TaskStatus.Blocked, label: 'Blocked' },
  { value: TaskStatus.Completed, label: 'Completed' },
];

const TIME_GRAIN_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'this-quarter', label: 'This Quarter' },
  { value: 'this-year', label: 'This Year' },
  { value: 'custom', label: 'Custom Range' },
];

const DUE_DATE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Due Dates' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'due-today', label: 'Due Today' },
  { value: 'due-this-week', label: 'Due This Week' },
  { value: 'due-next-week', label: 'Due Next Week' },
  { value: 'due-this-month', label: 'Due This Month' },
  { value: 'no-due-date', label: 'No Due Date' },
];

interface TaskRowProps {
  task: Task;
  project: Project | undefined;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  level?: number;
  visibleColumns: Set<string>;
}

function TaskRow({ task, project, onEdit, onDelete, level = 0, visibleColumns }: TaskRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const subtasks = task.subtasks || [];
  const hasSubtasks = subtasks.length > 0;

  const handleSubtaskEdit = (subtaskId: string, newTitle: string) => {
    const updatedSubtasks = task.subtasks.map(st =>
      st.id === subtaskId ? { ...st, title: newTitle } : st
    );
    onEdit({ ...task, subtasks: updatedSubtasks });
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(st => st.id !== subtaskId);
    onEdit({ ...task, subtasks: updatedSubtasks });
  };

  return (
    <>
      <tr className={cn(
        "hover:bg-gray-50",
        level > 0 && "bg-gray-50"
      )}>
        {/* Title Column - Always visible */}
        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
          <div className="flex items-center gap-2" style={{ paddingLeft: `${level * 24}px` }}>
            {hasSubtasks && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-gray-100 rounded flex-shrink-0"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            <div className="min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {task.title}
              </div>
              {task.description && (
                <div className="text-sm text-gray-500 truncate max-w-[200px] sm:max-w-md">
                  {task.description}
                </div>
              )}
              {hasSubtasks && (
                <div className="text-xs text-gray-500 mt-1">
                  {subtasks.filter(st => st.completed).length} of {subtasks.length} subtasks
                </div>
              )}
            </div>
          </div>
        </td>

        {/* Project Column */}
        {visibleColumns.has('project') && (
          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">{project?.name}</div>
          </td>
        )}

        {/* Status Column */}
        {visibleColumns.has('status') && (
          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              task.status === TaskStatus.Todo ? 'bg-gray-100 text-gray-800' :
              task.status === TaskStatus.InProgress ? 'bg-blue-100 text-blue-800' :
              task.status === TaskStatus.OnHold ? 'bg-yellow-100 text-yellow-800' :
              task.status === TaskStatus.Blocked ? 'bg-red-100 text-red-800' :
              'bg-green-100 text-green-800'
            )}>
              {task.status}
            </span>
          </td>
        )}

        {/* Priority Column */}
        {visibleColumns.has('priority') && (
          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              task.priority === TaskPriority.High ? 'bg-red-100 text-red-800' :
              task.priority === TaskPriority.Medium ? 'bg-yellow-100 text-yellow-800' :
              'bg-blue-100 text-blue-800'
            )}>
              {task.priority}
            </span>
          </td>
        )}

        {/* Due Date Column */}
        {visibleColumns.has('dueDate') && (
          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
            <div className={cn(
              "text-sm",
              !task.completed && new Date(task.dueDate) < new Date() && "text-red-600 font-medium"
            )}>
              {format(new Date(task.dueDate), 'MMM d, yyyy')}
            </div>
          </td>
        )}

        {/* Start Date Column */}
        {visibleColumns.has('startDate') && (
          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {task.startDate ? format(new Date(task.startDate), 'MMM d, yyyy HH:mm') : '-'}
            </div>
          </td>
        )}

        {/* End Date Column */}
        {visibleColumns.has('endDate') && (
          <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap">
            <div className="text-sm text-gray-900">
              {task.endDate ? format(new Date(task.endDate), 'MMM d, yyyy HH:mm') : '-'}
            </div>
          </td>
        )}

        {/* Actions Column - Always visible */}
        <td className="px-3 sm:px-6 py-2 sm:py-4 whitespace-nowrap text-right text-sm font-medium">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </td>
      </tr>

      {/* Subtasks */}
      {isExpanded && hasSubtasks && subtasks.map(subtask => (
        <tr key={subtask.id} className="bg-gray-50">
          <td colSpan={visibleColumns.size + 2} className="px-3 sm:px-6 py-2">
            <div className="flex items-center justify-between ml-8">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => {
                    const updatedSubtasks = task.subtasks.map(st =>
                      st.id === subtask.id ? { ...st, completed: !st.completed } : st
                    );
                    onEdit({ ...task, subtasks: updatedSubtasks });
                  }}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span className={cn(
                  "text-sm truncate",
                  subtask.completed && "line-through text-gray-500"
                )}>
                  {subtask.title}
                </span>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <button
                  onClick={() => {
                    const newTitle = prompt('Edit subtask', subtask.title);
                    if (newTitle && newTitle !== subtask.title) {
                      handleSubtaskEdit(subtask.id, newTitle);
                    }
                  }}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                >
                  <Pencil className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSubtaskDelete(subtask.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

type SortField = 'title' | 'project' | 'status' | 'priority' | 'dueDate' | 'startDate' | 'endDate';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface TableColumn {
  field: SortField;
  label: string;
  sortable: boolean;
  alwaysVisible?: boolean;
}

const TABLE_COLUMNS: TableColumn[] = [
  { field: 'title', label: 'Task', sortable: true, alwaysVisible: true },
  { field: 'project', label: 'Project', sortable: true },
  { field: 'status', label: 'Status', sortable: true },
  { field: 'priority', label: 'Priority', sortable: true },
  { field: 'dueDate', label: 'Due Date', sortable: true },
  { field: 'startDate', label: 'Start Date', sortable: true },
  { field: 'endDate', label: 'End Date', sortable: true },
];

export function TaskList({ onEditTask, onDeleteTask, onAddTask, onStatusChange, projectId }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const [filters, setFilters] = React.useState<TaskFilters>({
    projectId: projectId || 'all',
    priority: 'all',
    status: 'all',
    dueDate: 'all',
    timeGrain: 'all',
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    field: 'dueDate',
    direction: 'asc'
  });
  const [showColumnSettings, setShowColumnSettings] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(TABLE_COLUMNS.map(col => col.field))
  );

  React.useEffect(() => {
    if (projectId) {
      setFilters(prev => ({ ...prev, projectId }));
    }
  }, [projectId]);

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    if (key === 'dueDate' && value !== 'custom') {
      const { customStartDate, customEndDate, ...rest } = filters;
      setFilters({ ...rest, [key]: value });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const clearFilters = () => {
    setFilters({
      projectId: 'all',
      priority: 'all',
      status: 'all',
      dueDate: 'all',
      timeGrain: 'all',
    });
    setSearchQuery('');
  };

  const filterTasks = (task: Task): boolean => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const project = projects.find(p => p.id === task.projectId);
      
      // Search in task fields
      const matchesTaskFields = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower);

      // Search in project fields
      const matchesProject = project && (
        project.name.toLowerCase().includes(searchLower) ||
        project.description?.toLowerCase().includes(searchLower)
      );

      // Search in subtasks
      const matchesSubtasks = task.subtasks?.some(subtask => 
        subtask.title.toLowerCase().includes(searchLower)
      );

      if (!matchesTaskFields && !matchesProject && !matchesSubtasks) {
        return false;
      }
    }

    // Project filter
    if (filters.projectId !== 'all' && task.projectId !== filters.projectId) {
      return false;
    }

    // Priority filter
    if (filters.priority !== 'all' && task.priority !== filters.priority) {
      return false;
    }

    // Status filter
    if (filters.status !== 'all' && task.status !== filters.status) {
      return false;
    }

    // Time grain filter
    if (filters.timeGrain !== 'all') {
      const taskDate = task.startDate ? new Date(task.startDate) : new Date(task.dueDate);
      const today = startOfToday();
      
      switch (filters.timeGrain) {
        case 'today':
          if (!isToday(taskDate)) return false;
          break;
        case 'this-week':
          if (!isThisWeek(taskDate)) return false;
          break;
        case 'this-month':
          if (!isThisMonth(taskDate)) return false;
          break;
        case 'this-quarter':
          if (!isThisQuarter(taskDate)) return false;
          break;
        case 'this-year':
          if (!isThisYear(taskDate)) return false;
          break;
        case 'custom':
          if (filters.customStartDate && filters.customEndDate) {
            const startDate = parseISO(filters.customStartDate);
            const endDate = parseISO(filters.customEndDate);
            if (!isWithinInterval(taskDate, { start: startDate, end: endDate })) {
              return false;
            }
          }
          break;
      }
    }

    // Due date filter
    if (filters.dueDate !== 'all') {
      const dueDate = new Date(task.dueDate);
      const today = startOfToday();
      
      switch (filters.dueDate) {
        case 'overdue':
          if (!isBefore(dueDate, today)) return false;
          break;
        case 'due-today':
          if (!isToday(dueDate)) return false;
          break;
        case 'due-this-week':
          if (!isThisWeek(dueDate)) return false;
          break;
        case 'due-next-week':
          if (!isNextWeek(dueDate)) return false;
          break;
        case 'due-this-month':
          if (!isThisMonth(dueDate)) return false;
          break;
        case 'no-due-date':
          if (task.dueDate) return false;
          break;
      }
    }

    return true;
  };

  const handleSort = (field: SortField) => {
    setSortConfig(prevConfig => ({
      field,
      direction: 
        prevConfig.field === field && prevConfig.direction === 'asc'
          ? 'desc'
          : 'asc'
    }));
  };

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="w-4 h-4" />
      : <ArrowDown className="w-4 h-4" />;
  };

  // Filter tasks based on active filters
  const filteredTasks = tasks.filter(filterTasks);

  // Sort tasks based on the current sort config
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    const direction = sortConfig.direction === 'asc' ? 1 : -1;

    switch (sortConfig.field) {
      case 'title':
        return direction * a.title.localeCompare(b.title);
      
      case 'project': {
        const projectA = projects.find(p => p.id === a.projectId)?.name || '';
        const projectB = projects.find(p => p.id === b.projectId)?.name || '';
        return direction * projectA.localeCompare(projectB);
      }
      
      case 'status':
        return direction * a.status.localeCompare(b.status);
      
      case 'priority':
        return direction * a.priority.localeCompare(b.priority);
      
      case 'dueDate':
        return direction * (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
      
      case 'startDate':
        if (!a.startDate && !b.startDate) return 0;
        if (!a.startDate) return direction;
        if (!b.startDate) return -direction;
        return direction * (new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
      
      case 'endDate':
        if (!a.endDate && !b.endDate) return 0;
        if (!a.endDate) return direction;
        if (!b.endDate) return -direction;
        return direction * (new Date(a.endDate).getTime() - new Date(b.endDate).getTime());
      
      default:
        return 0;
    }
  });

  const hasActiveFilters = filters.projectId !== 'all' || 
                          filters.priority !== 'all' || 
                          filters.status !== 'all' ||
                          filters.dueDate !== 'all' ||
                          searchQuery !== '';

  const toggleColumn = (field: string) => {
    if (field === 'title') return; // Don't allow toggling the title column
    
    setVisibleColumns(prev => {
      const next = new Set(prev);
      if (next.has(field)) {
        next.delete(field);
      } else {
        next.add(field);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64 md:w-96">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>

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
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2 border rounded-lg p-1">
          <button
            onClick={() => setViewMode('board')}
            className={cn(
              "p-2 rounded",
              viewMode === 'board'
                ? "bg-indigo-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              "p-2 rounded",
              viewMode === 'table'
                ? "bg-indigo-500 text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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

            {/* Time Grain Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Time Period
              </label>
              <select
                value={filters.timeGrain}
                onChange={(e) => handleFilterChange('timeGrain', e.target.value)}
                className="w-full rounded-md border-gray-300"
              >
                {TIME_GRAIN_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <select
                value={filters.dueDate}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="w-full rounded-md border-gray-300"
              >
                {DUE_DATE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Custom Date Range */}
            {(filters.timeGrain === 'custom' || filters.dueDate === 'custom') && (
              <div className="col-span-full grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={filters.customStartDate}
                    onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={filters.customEndDate}
                    onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
                    className="w-full rounded-md border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      )}

      {viewMode === 'board' ? (
        <KanbanBoard
          tasks={sortedTasks}
          onEdit={onEditTask}
          onDelete={onDeleteTask}
          onStatusChange={onStatusChange}
        />
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {TABLE_COLUMNS.filter(column => visibleColumns.has(column.field)).map(column => (
                    <th
                      key={column.field}
                      scope="col"
                      className={cn(
                        "px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
                        column.sortable && "cursor-pointer hover:bg-gray-100"
                      )}
                      onClick={() => column.sortable && handleSort(column.field)}
                    >
                      <div className="flex items-center gap-2">
                        {column.label}
                        {column.sortable && (
                          <span className="text-gray-400">
                            {getSortIcon(column.field)}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  <th scope="col" className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedTasks.map((task) => {
                  const project = projects.find(p => p.id === task.projectId);
                  return (
                    <TaskRow
                      key={task.id}
                      task={task}
                      project={project}
                      onEdit={onEditTask}
                      onDelete={onDeleteTask}
                      visibleColumns={visibleColumns}
                    />
                  );
                })}
              </tbody>
            </table>
            {sortedTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {hasActiveFilters 
                  ? 'No tasks match the selected filters.'
                  : 'No tasks yet. Click the "New Task" button to create one!'}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}