import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { 
  createProject, 
  getProjects, 
  getProjectById, 
  updateProject, 
  deleteProject 
} from '../controllers/projectController';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Project routes
router.post('/', createProject);
router.get('/', getProjects);
router.get('/:id', getProjectById);
router.put('/:id', updateProject);
router.delete('/:id', deleteProject);

export default router; 