import React from 'react';
import { Task, TaskStatus, TaskPriority, Project } from '../types';
import { useTaskStore } from '../store/taskStore';
import { useProjectStore } from '../store/projectStore';
import { KanbanBoard } from './KanbanBoard';
import { Pencil, Trash2, Filter, X, LayoutGrid, List, Search, ChevronDown, ChevronRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { format, isToday, isTomorrow, isThisWeek, isPast, startOfToday, isWithinInterval, parseISO } from 'date-fns';
import { cn } from '../lib/utils';

interface TaskListProps {
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
}

interface TaskFilters {
  projectId: string;
  priority: string;
  status: string;
  dueDate: string;
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

const DUE_DATE_OPTIONS: FilterOption[] = [
  { value: 'all', label: 'All Dates' },
  { value: 'today', label: 'Due Today' },
  { value: 'tomorrow', label: 'Due Tomorrow' },
  { value: 'this-week', label: 'Due This Week' },
  { value: 'overdue', label: 'Overdue' },
  { value: 'custom', label: 'Custom Range' },
];

interface TaskRowProps {
  task: Task;
  project: Project | undefined;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  level?: number;
}

function TaskRow({ task, project, onEdit, onDelete, level = 0 }: TaskRowProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const tasks = useTaskStore((state) => state.tasks);
  const subtasks = task.subtasks || [];
  const hasSubtasks = subtasks.length > 0;

  return (
    <>
      <tr className={cn(
        "hover:bg-gray-50",
        level > 0 && "bg-gray-50"
      )}>
        <td className="px-6 py-4 whitespace-nowrap">
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
            <div>
              <div className="text-sm font-medium text-gray-900">
                {task.title}
              </div>
              {task.description && (
                <div className="text-sm text-gray-500 truncate max-w-md">
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
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="text-sm text-gray-900">{project?.name}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
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
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            task.priority === TaskPriority.High ? 'bg-red-100 text-red-800' :
            task.priority === TaskPriority.Medium ? 'bg-yellow-100 text-yellow-800' :
            'bg-blue-100 text-blue-800'
          )}>
            {task.priority}
          </span>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className={cn(
            "text-sm",
            !task.completed && new Date(task.dueDate) < new Date() && "text-red-600 font-medium"
          )}>
            {format(new Date(task.dueDate), 'MMM d, yyyy')}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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
      {isExpanded && hasSubtasks && subtasks.map(subtask => (
        <tr key={subtask.id} className="bg-gray-50">
          <td colSpan={6} className="px-6 py-2">
            <div className="flex items-center gap-2 ml-8">
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
                "text-sm",
                subtask.completed && "line-through text-gray-500"
              )}>
                {subtask.title}
              </span>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
}

type SortField = 'title' | 'project' | 'status' | 'priority' | 'dueDate';
type SortDirection = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  direction: SortDirection;
}

interface TableColumn {
  field: SortField;
  label: string;
  sortable: boolean;
}

const TABLE_COLUMNS: TableColumn[] = [
  { field: 'title', label: 'Task', sortable: true },
  { field: 'project', label: 'Project', sortable: true },
  { field: 'status', label: 'Status', sortable: true },
  { field: 'priority', label: 'Priority', sortable: true },
  { field: 'dueDate', label: 'Due Date', sortable: true },
];

export function TaskList({ onEditTask, onDeleteTask, onAddTask, onStatusChange }: TaskListProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const [filters, setFilters] = React.useState<TaskFilters>({
    projectId: 'all',
    priority: 'all',
    status: 'all',
    dueDate: 'all',
  });
  const [showFilters, setShowFilters] = React.useState(false);
  const [viewMode, setViewMode] = React.useState<'board' | 'table'>('board');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortConfig, setSortConfig] = React.useState<SortConfig>({
    field: 'dueDate',
    direction: 'asc'
  });

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
    });
    setSearchQuery('');
  };

  const filterTasks = (task: Task): boolean => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch = 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        projects.find(p => p.id === task.projectId)?.name.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
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

    // Due date filter
    if (filters.dueDate !== 'all') {
      const dueDate = new Date(task.dueDate);
      
      if (filters.dueDate === 'custom' && filters.customStartDate && filters.customEndDate) {
        const startDate = parseISO(filters.customStartDate);
        const endDate = parseISO(filters.customEndDate);
        if (!isWithinInterval(dueDate, { start: startDate, end: endDate })) {
          return false;
        }
      } else {
        const today = startOfToday();
        switch (filters.dueDate) {
          case 'today':
            if (!isToday(dueDate)) return false;
            break;
          case 'tomorrow':
            if (!isTomorrow(dueDate)) return false;
            break;
          case 'this-week':
            if (!isThisWeek(dueDate)) return false;
            break;
          case 'overdue':
            if (!isPast(dueDate) || isToday(dueDate)) return false;
            break;
        }
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
      
      default:
        return 0;
    }
  });

  const hasActiveFilters = filters.projectId !== 'all' || 
                          filters.priority !== 'all' || 
                          filters.status !== 'all' ||
                          filters.dueDate !== 'all' ||
                          searchQuery !== '';

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search and Filters */}
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg",
              showFilters || hasActiveFilters
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-50"
            )}
          >
            <Filter className="w-4 h-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-1 bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full text-xs">
                Active
              </span>
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-50"
            >
              <X className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('board')}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md",
              viewMode === 'board'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
            Board
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={cn(
              "flex items-center gap-1 px-3 py-1.5 text-sm font-medium rounded-md",
              viewMode === 'table'
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            )}
          >
            <List className="w-4 h-4" />
            Table
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project
              </label>
              <select
                value={filters.projectId}
                onChange={(e) => handleFilterChange('projectId', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="all">All Projects</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {STATUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={filters.priority}
                onChange={(e) => handleFilterChange('priority', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {PRIORITY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <select
                value={filters.dueDate}
                onChange={(e) => handleFilterChange('dueDate', e.target.value)}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                {DUE_DATE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filters.dueDate === 'custom' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  value={filters.customStartDate ?? ''}
                  onChange={(e) => handleFilterChange('customStartDate', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={filters.customEndDate ?? ''}
                  onChange={(e) => handleFilterChange('customEndDate', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
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
                  {TABLE_COLUMNS.map(column => (
                    <th
                      key={column.field}
                      scope="col"
                      className={cn(
                        "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider",
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
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
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