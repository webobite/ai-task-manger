import React, { useState } from 'react';
import { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DroppableProvided, DraggableProvided, DraggableStateSnapshot, DroppableStateSnapshot, DropResult } from '@hello-pangea/dnd';
import { cn } from '../lib/utils';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

interface Column {
  id: TaskStatus;
  title: string;
}

const COLUMNS: Column[] = [
  { id: TaskStatus.Todo, title: 'To Do' },
  { id: TaskStatus.InProgress, title: 'In Progress' },
  { id: TaskStatus.Completed, title: 'Completed' },
];

const OPTIONAL_COLUMNS: Column[] = [
  { id: TaskStatus.OnHold, title: 'On Hold' },
  { id: TaskStatus.Blocked, title: 'Blocked' },
];

export function KanbanBoard({ tasks, onEdit, onDelete, onStatusChange }: KanbanBoardProps) {
  const [showOptionalColumns, setShowOptionalColumns] = useState(false);
  const columns = [...COLUMNS, ...(showOptionalColumns ? OPTIONAL_COLUMNS : [])];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newStatus = destination.droppableId as TaskStatus;
    onStatusChange(draggableId, newStatus);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={() => setShowOptionalColumns(!showOptionalColumns)}
          className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900"
        >
          {showOptionalColumns ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          {showOptionalColumns ? 'Hide' : 'Show'} Optional Columns
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex flex-col">
              <h3 className="text-sm font-medium text-gray-900 mb-3">
                {column.title}
              </h3>

              <Droppable droppableId={column.id}>
                {(provided: DroppableProvided, snapshot: DroppableStateSnapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={cn(
                      "flex-1 p-2 rounded-lg min-h-[200px]",
                      snapshot.isDraggingOver ? "bg-gray-100" : "bg-gray-50"
                    )}
                  >
                    <div className="space-y-2">
                      {tasks
                        .filter((task) => task.status === column.id)
                        .map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided: DraggableProvided, snapshot: DraggableStateSnapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={cn(
                                  snapshot.isDragging && "rotate-2"
                                )}
                              >
                                <TaskCard
                                  task={task}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
} 