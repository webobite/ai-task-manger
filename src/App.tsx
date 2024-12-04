import React from 'react';
import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TaskForm } from './components/TaskForm';
import { Modal } from './components/ui/Modal';
import { useTaskStore } from './store/taskStore';
import { useProjectStore } from './store/projectStore';
import { Task } from './types/task';
import { Plus } from 'lucide-react';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);
  const initializeWithMockData = useProjectStore((state) => state.initializeWithMockData);

  React.useEffect(() => {
    // Initialize with mock data if no tasks exist
    if (useTaskStore.getState().tasks.length === 0) {
      initializeWithMockData();
    }
  }, [initializeWithMockData]);

  const handleTaskSubmit = (task: Task) => {
    if (editingTask) {
      updateTask(task.id, task);
    } else {
      addTask(task);
    }
    setIsModalOpen(false);
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout onEditTask={handleEditTask}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Tasks</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        <Outlet context={{ onEditTask: handleEditTask }} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTask(undefined);
        }}
        title={editingTask ? 'Edit Task' : 'Create New Task'}
      >
        <TaskForm
          task={editingTask}
          onSubmit={handleTaskSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingTask(undefined);
          }}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default App;