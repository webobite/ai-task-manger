import React, { useState } from 'react';
import { useTaskStore } from '../../store/taskStore';
import { useProjectStore } from '../../store/projectStore';
import { Task, TaskStatus } from '../../types';
import { isWithinInterval, parseISO, startOfToday, endOfToday, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfQuarter, endOfQuarter, startOfYear, endOfYear, format, eachDayOfInterval, isSameDay, addDays } from 'date-fns';
import { ChevronRight, ChevronDown, X } from 'lucide-react';
import { cn } from '../../lib/utils';

interface TaskGanttChartProps {
  filters: {
    projectId: string;
    timeRange: string;
    startDate?: string;
    endDate?: string;
  };
}

interface ProjectGroup {
  project: {
    id: string;
    name: string;
    color: string;
  };
  tasks: Task[];
}

interface TaskModalData {
  task: Task;
  project: {
    name: string;
    color: string;
  };
}

export function TaskGanttChart({ filters }: TaskGanttChartProps) {
  const tasks = useTaskStore((state) => state.tasks);
  const projects = useProjectStore((state) => state.projects);
  const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [selectedTask, setSelectedTask] = useState<TaskModalData | null>(null);

  const toggleProject = (projectId: string) => {
    const newExpanded = new Set(expandedProjects);
    if (newExpanded.has(projectId)) {
      newExpanded.delete(projectId);
    } else {
      newExpanded.add(projectId);
    }
    setExpandedProjects(newExpanded);
  };

  const toggleTask = (taskId: string) => {
    const newExpanded = new Set(expandedTasks);
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId);
    } else {
      newExpanded.add(taskId);
    }
    setExpandedTasks(newExpanded);
  };

  const formatDate = (date: string) => {
    return format(parseISO(date), 'MMM dd, yyyy');
  };

  const getCompletedSubtasks = (task: Task) => {
    return task.subtasks?.filter(st => st.completed).length || 0;
  };

  const getTotalSubtasks = (task: Task) => {
    return task.subtasks?.length || 0;
  };

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
        return { start: startOfMonth(today), end: endOfMonth(today) };
    }
  };

  // Get filtered tasks
  const filteredTasks = tasks.filter(task => {
    if (filters.projectId !== 'all' && task.projectId !== filters.projectId) {
      return false;
    }

    const dateRange = getDateRange();
    if (task.startDate) {
      const taskStartDate = parseISO(task.startDate);
      return isWithinInterval(taskStartDate, dateRange);
    }

    return false;
  });

  // Group tasks by project
  const projectGroups: ProjectGroup[] = projects
    .map(project => {
      const projectTasks = filteredTasks.filter(task => task.projectId === project.id);
      if (projectTasks.length === 0) return null;

      return {
        project: {
          id: project.id,
          name: project.name,
          color: project.color,
        },
        tasks: projectTasks,
      };
    })
    .filter((group): group is ProjectGroup => group !== null)
    .sort((a, b) => a.project.name.localeCompare(b.project.name));

  // Get date range for the chart
  const dateRange = getDateRange();
  const dates = eachDayOfInterval(dateRange);

  // Calculate task completion percentages
  const getTaskCompletion = (task: Task) => {
    if (task.status === TaskStatus.Completed) return 100;
    if (task.status === TaskStatus.Todo) return 0;
    
    const completedSubtasks = task.subtasks?.filter(st => st.completed).length || 0;
    const totalSubtasks = task.subtasks?.length || 1;
    return Math.round((completedSubtasks / totalSubtasks) * 100);
  };

  const statusColors = {
    [TaskStatus.Completed]: '#10B981',
    [TaskStatus.InProgress]: '#3B82F6',
    [TaskStatus.Blocked]: '#EF4444',
    [TaskStatus.OnHold]: '#F59E0B',
    [TaskStatus.Todo]: '#6B7280',
  };

  const renderTimelineCells = (task: Task, project: { name: string; color: string }) => {
    const startDate = task.startDate ? parseISO(task.startDate) : new Date();
    const endDate = task.endDate ? parseISO(task.endDate) : addDays(startDate, 1);
    const completion = getTaskCompletion(task);

    return dates.map(date => {
      const isActive = isWithinInterval(date, { start: startDate, end: endDate });
      const isToday = isSameDay(date, new Date());

      return (
        <div
          key={date.toISOString()}
          className={`p-2 border-l relative ${isToday ? 'bg-blue-50' : ''}`}
          onClick={() => isActive && setSelectedTask({ task, project })}
        >
          {isActive && (
            <div
              className="absolute inset-y-0 left-0 right-0 mx-1 cursor-pointer"
              style={{ backgroundColor: statusColors[task.status] }}
            >
              <div
                className="h-full bg-white bg-opacity-75"
                style={{ width: `${100 - completion}%` }}
              />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Task Gantt Chart</h3>
      <div className="overflow-x-auto relative">
        {/* Header */}
        <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(30px,1fr))] border-b">
          <div className="p-2 font-medium text-sm text-gray-700">Task</div>
          {dates.map(date => (
            <div
              key={date.toISOString()}
              className="p-1 text-center text-xs font-medium text-gray-600 border-l"
            >
              {format(date, 'dd')}
            </div>
          ))}
        </div>

        {/* Projects and Tasks */}
        <div className="divide-y">
          {projectGroups.map(({ project, tasks }) => (
            <React.Fragment key={project.id}>
              {/* Project Row */}
              <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(30px,1fr))] hover:bg-gray-50">
                <div className="p-2">
                  <button
                    onClick={() => toggleProject(project.id)}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    {expandedProjects.has(project.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="font-medium">{project.name}</span>
                  </button>
                </div>
                {dates.map(date => (
                  <div
                    key={date.toISOString()}
                    className="border-l"
                  />
                ))}
              </div>

              {/* Tasks */}
              {expandedProjects.has(project.id) && tasks.map(task => (
                <React.Fragment key={task.id}>
                  {/* Task Row */}
                  <div className="grid grid-cols-[200px_repeat(auto-fill,minmax(30px,1fr))] hover:bg-gray-50">
                    <div className="p-2 pl-8">
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex items-center gap-2 w-full text-left"
                      >
                        {task.subtasks?.length > 0 && (
                          expandedTasks.has(task.id) ? (
                            <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )
                        )}
                        <span className={cn(
                          "text-sm",
                          task.completed && "line-through text-gray-500"
                        )}>
                          {task.title}
                        </span>
                      </button>
                    </div>
                    {renderTimelineCells(task, project)}
                  </div>

                  {/* Subtasks */}
                  {expandedTasks.has(task.id) && task.subtasks?.map(subtask => (
                    <div
                      key={subtask.id}
                      className="grid grid-cols-[200px_repeat(auto-fill,minmax(30px,1fr))] hover:bg-gray-50"
                    >
                      <div className="p-2 pl-16">
                        <span className={cn(
                          "text-sm text-gray-600",
                          subtask.completed && "line-through text-gray-400"
                        )}>
                          {subtask.title}
                        </span>
                      </div>
                      {dates.map(date => (
                        <div
                          key={date.toISOString()}
                          className="border-l"
                        />
                      ))}
                    </div>
                  ))}
                </React.Fragment>
              ))}
            </React.Fragment>
          ))}
        </div>

        {/* Task Details Modal */}
        {selectedTask && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl mx-4 relative">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: selectedTask.project.color }}
                  />
                  <h3 className="text-lg font-semibold">{selectedTask.task.title}</h3>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="p-6 space-y-6">
                {/* Project Info */}
                <div>
                  <div className="text-sm text-gray-500 mb-1">Project</div>
                  <div className="font-medium">{selectedTask.project.name}</div>
                </div>

                {/* Status and Priority */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Status</div>
                    <div className="font-medium">{selectedTask.task.status}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Priority</div>
                    <div className="font-medium">{selectedTask.task.priority}</div>
                  </div>
                </div>

                {/* Dates */}
                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Start Date</div>
                    <div className="font-medium">
                      {selectedTask.task.startDate ? formatDate(selectedTask.task.startDate) : 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">End Date</div>
                    <div className="font-medium">
                      {selectedTask.task.endDate ? formatDate(selectedTask.task.endDate) : 'Not set'}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Due Date</div>
                    <div className="font-medium">
                      {selectedTask.task.dueDate ? formatDate(selectedTask.task.dueDate) : 'Not set'}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedTask.task.description && (
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Description</div>
                    <div className="text-gray-700">{selectedTask.task.description}</div>
                  </div>
                )}

                {/* Subtasks */}
                {selectedTask.task.subtasks && selectedTask.task.subtasks.length > 0 && (
                  <div>
                    <div className="text-sm text-gray-500 mb-2">
                      Subtasks ({getCompletedSubtasks(selectedTask.task)}/{getTotalSubtasks(selectedTask.task)})
                    </div>
                    <div className="space-y-2">
                      {selectedTask.task.subtasks.map(subtask => (
                        <div
                          key={subtask.id}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded bg-gray-50",
                            subtask.completed && "text-gray-400"
                          )}
                        >
                          <div className={cn(
                            "w-2 h-2 rounded-full",
                            subtask.completed ? "bg-green-500" : "bg-gray-300"
                          )} />
                          <span className={subtask.completed ? "line-through" : ""}>
                            {subtask.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="border-t p-4 flex justify-end">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 