import { Request, Response } from 'express';
import { db } from '../db';
import { Task, TaskStatus, TaskPriority, TaskHistoryActionType } from '../types';
import { generateId } from '../utils';

// Create a new task
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      projectId,
      status = TaskStatus.Todo,
      priority = TaskPriority.Medium,
      dueDate,
      subtasks = []
    } = req.body;
    const userId = req.user?.id;

    if (!title || !projectId) {
      return res.status(400).json({ error: 'Title and project ID are required' });
    }

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Create task
      const taskResult = await db.run(
        `INSERT INTO tasks (title, description, projectId, status, priority, dueDate, userId, completed, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))`,
        [title, description, projectId, status, priority, dueDate, userId]
      );

      const taskId = taskResult.lastID;

      // Add subtasks if any
      for (const subtask of subtasks) {
        await db.run(
          `INSERT INTO subtasks (taskId, title, completed, createdAt, updatedAt)
           VALUES (?, ?, 0, datetime('now'), datetime('now'))`,
          [taskId, subtask.title]
        );
      }

      // Add task creation history
      await db.run(
        `INSERT INTO task_history (taskId, actionType, userId, timestamp)
         VALUES (?, ?, ?, datetime('now'))`,
        [taskId, TaskHistoryActionType.Created, userId]
      );

      // Commit transaction
      await db.run('COMMIT');

      // Get the created task with subtasks
      const task = await getTaskWithDetails(taskId);
      res.status(201).json(task);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

// Get all tasks for the current user
export const getTasks = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    const tasks = await getAllTasksWithDetails(userId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting tasks:', error);
    res.status(500).json({ error: 'Failed to get tasks' });
  }
};

// Get tasks by project
export const getTasksByProject = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const userId = req.user?.id;

    const tasks = await getAllTasksWithDetails(userId, projectId);
    res.json(tasks);
  } catch (error) {
    console.error('Error getting project tasks:', error);
    res.status(500).json({ error: 'Failed to get project tasks' });
  }
};

// Get a specific task by ID
export const getTaskById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const task = await getTaskWithDetails(id, userId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(task);
  } catch (error) {
    console.error('Error getting task:', error);
    res.status(500).json({ error: 'Failed to get task' });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user?.id;

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      const existingTask = await getTaskWithDetails(id, userId);
      if (!existingTask) {
        await db.run('ROLLBACK');
        return res.status(404).json({ error: 'Task not found' });
      }

      // Update task
      await db.run(
        `UPDATE tasks 
         SET title = ?, description = ?, status = ?, priority = ?, dueDate = ?, 
             completed = ?, updatedAt = datetime('now')
         WHERE id = ? AND userId = ?`,
        [
          updates.title || existingTask.title,
          updates.description || existingTask.description,
          updates.status || existingTask.status,
          updates.priority || existingTask.priority,
          updates.dueDate || existingTask.dueDate,
          updates.completed || existingTask.completed,
          id,
          userId
        ]
      );

      // Add history entry
      await db.run(
        `INSERT INTO task_history (taskId, actionType, userId, timestamp, changes)
         VALUES (?, ?, ?, datetime('now'), ?)`,
        [id, TaskHistoryActionType.Updated, userId, JSON.stringify(updates)]
      );

      // Commit transaction
      await db.run('COMMIT');

      // Get updated task
      const updatedTask = await getTaskWithDetails(id);
      res.json(updatedTask);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
};

// Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Delete subtasks
      await db.run('DELETE FROM subtasks WHERE taskId = ?', [id]);

      // Delete task history
      await db.run('DELETE FROM task_history WHERE taskId = ?', [id]);

      // Delete task
      await db.run('DELETE FROM tasks WHERE id = ? AND userId = ?', [id, userId]);

      // Commit transaction
      await db.run('COMMIT');
      res.json({ message: 'Task deleted successfully' });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
};

// Add a subtask
export const addSubtask = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { title } = req.body;
    const userId = req.user?.id;

    if (!title) {
      return res.status(400).json({ error: 'Subtask title is required' });
    }

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Verify task exists and belongs to user
      const task = await db.get(
        'SELECT * FROM tasks WHERE id = ? AND userId = ?',
        [taskId, userId]
      );

      if (!task) {
        await db.run('ROLLBACK');
        return res.status(404).json({ error: 'Task not found' });
      }

      // Add subtask
      const result = await db.run(
        `INSERT INTO subtasks (taskId, title, completed, createdAt, updatedAt)
         VALUES (?, ?, 0, datetime('now'), datetime('now'))`,
        [taskId, title]
      );

      // Add history entry
      await db.run(
        `INSERT INTO task_history (taskId, actionType, userId, timestamp, changes)
         VALUES (?, ?, ?, datetime('now'), ?)`,
        [
          taskId,
          TaskHistoryActionType.SubtaskAdded,
          userId,
          JSON.stringify({ subtaskId: result.lastID, title })
        ]
      );

      // Commit transaction
      await db.run('COMMIT');

      const subtask = {
        id: result.lastID,
        taskId,
        title,
        completed: false
      };

      res.status(201).json(subtask);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error adding subtask:', error);
    res.status(500).json({ error: 'Failed to add subtask' });
  }
};

// Update a subtask
export const updateSubtask = async (req: Request, res: Response) => {
  try {
    const { taskId, subtaskId } = req.params;
    const { title, completed } = req.body;
    const userId = req.user?.id;

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Verify task exists and belongs to user
      const task = await db.get(
        'SELECT * FROM tasks WHERE id = ? AND userId = ?',
        [taskId, userId]
      );

      if (!task) {
        await db.run('ROLLBACK');
        return res.status(404).json({ error: 'Task not found' });
      }

      // Update subtask
      await db.run(
        `UPDATE subtasks 
         SET title = ?, completed = ?, updatedAt = datetime('now')
         WHERE id = ? AND taskId = ?`,
        [title, completed, subtaskId, taskId]
      );

      // Add history entry
      await db.run(
        `INSERT INTO task_history (taskId, actionType, userId, timestamp, changes)
         VALUES (?, ?, ?, datetime('now'), ?)`,
        [
          taskId,
          TaskHistoryActionType.SubtaskCompleted,
          userId,
          JSON.stringify({ subtaskId, title, completed })
        ]
      );

      // Commit transaction
      await db.run('COMMIT');

      const updatedSubtask = await db.get(
        'SELECT * FROM subtasks WHERE id = ?',
        [subtaskId]
      );

      res.json(updatedSubtask);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error updating subtask:', error);
    res.status(500).json({ error: 'Failed to update subtask' });
  }
};

// Delete a subtask
export const deleteSubtask = async (req: Request, res: Response) => {
  try {
    const { taskId, subtaskId } = req.params;
    const userId = req.user?.id;

    // Begin transaction
    await db.run('BEGIN TRANSACTION');

    try {
      // Verify task exists and belongs to user
      const task = await db.get(
        'SELECT * FROM tasks WHERE id = ? AND userId = ?',
        [taskId, userId]
      );

      if (!task) {
        await db.run('ROLLBACK');
        return res.status(404).json({ error: 'Task not found' });
      }

      // Get subtask details before deletion
      const subtask = await db.get(
        'SELECT * FROM subtasks WHERE id = ? AND taskId = ?',
        [subtaskId, taskId]
      );

      if (!subtask) {
        await db.run('ROLLBACK');
        return res.status(404).json({ error: 'Subtask not found' });
      }

      // Delete subtask
      await db.run(
        'DELETE FROM subtasks WHERE id = ? AND taskId = ?',
        [subtaskId, taskId]
      );

      // Add history entry
      await db.run(
        `INSERT INTO task_history (taskId, actionType, userId, timestamp, changes)
         VALUES (?, ?, ?, datetime('now'), ?)`,
        [
          taskId,
          TaskHistoryActionType.SubtaskRemoved,
          userId,
          JSON.stringify({ subtaskId, title: subtask.title })
        ]
      );

      // Commit transaction
      await db.run('COMMIT');
      res.json({ message: 'Subtask deleted successfully' });
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error('Error deleting subtask:', error);
    res.status(500).json({ error: 'Failed to delete subtask' });
  }
};

// Helper function to get task with all details
async function getTaskWithDetails(taskId: number | string, userId?: number) {
  const task = await db.get(
    `SELECT t.*, p.name as projectName, p.color as projectColor
     FROM tasks t
     LEFT JOIN projects p ON t.projectId = p.id
     WHERE t.id = ? ${userId ? 'AND t.userId = ?' : ''}`,
    userId ? [taskId, userId] : [taskId]
  );

  if (!task) return null;

  const subtasks = await db.all(
    'SELECT * FROM subtasks WHERE taskId = ? ORDER BY createdAt',
    [taskId]
  );

  const history = await db.all(
    'SELECT * FROM task_history WHERE taskId = ? ORDER BY timestamp DESC',
    [taskId]
  );

  return {
    ...task,
    subtasks,
    history
  };
}

// Helper function to get all tasks with details
async function getAllTasksWithDetails(userId: number, projectId?: string) {
  const tasks = await db.all(
    `SELECT t.*, p.name as projectName, p.color as projectColor
     FROM tasks t
     LEFT JOIN projects p ON t.projectId = p.id
     WHERE t.userId = ? ${projectId ? 'AND t.projectId = ?' : ''}
     ORDER BY t.createdAt DESC`,
    projectId ? [userId, projectId] : [userId]
  );

  const tasksWithDetails = await Promise.all(
    tasks.map(async (task) => {
      const subtasks = await db.all(
        'SELECT * FROM subtasks WHERE taskId = ? ORDER BY createdAt',
        [task.id]
      );

      const history = await db.all(
        'SELECT * FROM task_history WHERE taskId = ? ORDER BY timestamp DESC',
        [task.id]
      );

      return {
        ...task,
        subtasks,
        history
      };
    })
  );

  return tasksWithDetails;
}

export const getTaskHistory = async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const { 
      limit = 20, 
      offset = 0, 
      actionType, 
      startDate, 
      endDate 
    } = req.query;
    const userId = req.user?.id;

    // Validate task exists and belongs to user
    const task = await db.get(
      'SELECT id FROM tasks WHERE id = ? AND userId = ?',
      [taskId, userId]
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    // Build the query
    let query = `
      SELECT 
        th.id,
        th.taskId,
        th.actionType,
        th.timestamp,
        th.changes,
        th.userId,
        u.name as userName
      FROM task_history th
      LEFT JOIN users u ON th.userId = u.id
      WHERE th.taskId = ?
    `;
    const queryParams: any[] = [taskId];

    // Add filters
    if (actionType) {
      query += ' AND th.actionType = ?';
      queryParams.push(actionType);
    }

    if (startDate) {
      query += ' AND th.timestamp >= ?';
      queryParams.push(startDate);
    }

    if (endDate) {
      query += ' AND th.timestamp <= ?';
      queryParams.push(endDate);
    }

    // Get total count
    const countQuery = query.replace(
      'SELECT th.id, th.taskId, th.actionType, th.timestamp, th.changes, th.userId, u.name as userName',
      'SELECT COUNT(*) as total'
    );
    const { total } = await db.get(countQuery, queryParams);

    // Add pagination
    query += ' ORDER BY th.timestamp DESC LIMIT ? OFFSET ?';
    queryParams.push(Number(limit), Number(offset));

    // Get history entries
    const history = await db.all(query, queryParams);

    // Parse changes JSON if it exists
    const formattedHistory = history.map(entry => ({
      ...entry,
      changes: entry.changes ? JSON.parse(entry.changes) : null
    }));

    res.json({
      total,
      limit: Number(limit),
      offset: Number(offset),
      history: formattedHistory
    });
  } catch (error) {
    console.error('Error getting task history:', error);
    res.status(500).json({ error: 'Failed to get task history' });
  }
}; 