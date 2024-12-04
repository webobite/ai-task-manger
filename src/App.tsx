import React from 'react';
import { DashboardLayout } from './components/layout/DashboardLayout';
import { TaskList } from './components/TaskList';
import { TaskForm } from './components/TaskForm';
import { Modal } from './components/ui/Modal';
import { TaskMetrics } from './components/analytics/TaskMetrics';
import { TaskChart } from './components/analytics/TaskChart';
import { Plus } from 'lucide-react';
import { useTaskStore } from './store/taskStore';
import { Task } from './types/task';

function App() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();
  const addTask = useTaskStore((state) => state.addTask);
  const updateTask = useTaskStore((state) => state.updateTask);

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
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
          >
            <Plus className="w-4 h-4" />
            New Task
          </button>
        </div>

        <TaskMetrics />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TaskChart />
          </div>
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Recent Tasks</h3>
              <TaskList onEditTask={handleEditTask} limit={5} />
            </div>
          </div>
        </div>
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