import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  createTask, 
  getTasks, 
  getTaskById, 
  updateTask, 
  deleteTask,
  addSubtask,
  updateSubtask,
  deleteSubtask,
  getTasksByProject,
  getTaskHistory
} from '../controllers/taskController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Task routes
router.post('/', createTask);
router.get('/', getTasks);
router.get('/project/:projectId', getTasksByProject);
router.get('/:id', getTaskById);
router.get('/:taskId/history', getTaskHistory);
router.put('/:id', updateTask);
router.delete('/:id', deleteTask);

// Subtask routes
router.post('/:taskId/subtasks', addSubtask);
router.put('/:taskId/subtasks/:subtaskId', updateSubtask);
router.delete('/:taskId/subtasks/:subtaskId', deleteSubtask);

export default router; 