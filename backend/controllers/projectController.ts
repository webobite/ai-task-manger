import { Request, Response } from 'express';
import { db } from '../db';
import { Project } from '../types';

// Create a new project
export const createProject = async (req: Request, res: Response) => {
  try {
    const { name, description, color, parentId } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const result = await db.run(
      `INSERT INTO projects (name, description, color, parentId, userId, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))`,
      [name, description, color, parentId, userId]
    );

    const project = {
      id: result.lastID,
      name,
      description,
      color,
      parentId,
      userId,
    };

    res.status(201).json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
};

// Get all projects for the current user
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const projects = await db.all(
      `SELECT * FROM projects WHERE userId = ? ORDER BY createdAt DESC`,
      [userId]
    );

    // Build project tree
    const projectMap = new Map();
    const rootProjects = [];

    // First pass: Create map of all projects
    projects.forEach(project => {
      projectMap.set(project.id, { ...project, children: [] });
    });

    // Second pass: Build tree structure
    projects.forEach(project => {
      const projectWithChildren = projectMap.get(project.id);
      if (project.parentId) {
        const parent = projectMap.get(project.parentId);
        if (parent) {
          parent.children.push(projectWithChildren);
        }
      } else {
        rootProjects.push(projectWithChildren);
      }
    });

    res.json(rootProjects);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
};

// Get a specific project by ID
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const project = await db.get(
      `SELECT * FROM projects WHERE id = ? AND userId = ?`,
      [id, userId]
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, color, parentId } = req.body;
    const userId = req.user?.id;

    if (!name) {
      return res.status(400).json({ error: 'Project name is required' });
    }

    const existingProject = await db.get(
      `SELECT * FROM projects WHERE id = ? AND userId = ?`,
      [id, userId]
    );

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    await db.run(
      `UPDATE projects 
       SET name = ?, description = ?, color = ?, parentId = ?, updatedAt = datetime('now')
       WHERE id = ? AND userId = ?`,
      [name, description, color, parentId, id, userId]
    );

    const updatedProject = {
      id: Number(id),
      name,
      description,
      color,
      parentId,
      userId,
    };

    res.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const existingProject = await db.get(
      `SELECT * FROM projects WHERE id = ? AND userId = ?`,
      [id, userId]
    );

    if (!existingProject) {
      return res.status(404).json({ error: 'Project not found' });
    }

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Delete all tasks associated with this project
      await db.run(
        `DELETE FROM tasks WHERE projectId = ?`,
        [id]
      );

      // Delete the project
      await db.run(
        `DELETE FROM projects WHERE id = ? AND userId = ?`,
        [id, userId]
      );

      // Commit transaction
      await db.run('COMMIT');
      res.json({ message: 'Project deleted successfully' });
    } catch (error) {
      // Rollback transaction on error
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
}; 