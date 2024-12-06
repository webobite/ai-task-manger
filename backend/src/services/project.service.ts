import { query, run } from '../db';
import { Project } from '../types';

export class ProjectService {
  async getProjects(userId: number): Promise<Project[]> {
    try {
      console.log('🔍 Getting projects for user:', userId);
      const projects = await query<Project[]>(
        `SELECT * FROM projects WHERE userId = ? ORDER BY createdAt DESC`,
        [userId]
      );
      console.log('📋 Found projects:', projects.length);
      return projects;
    } catch (error) {
      console.error('❌ Error getting projects:', error);
      throw error;
    }
  }

  async createProject(data: { name: string; description?: string; userId: number; parentId?: number }): Promise<Project> {
    try {
      console.log('📝 Creating new project:', data);
      const now = new Date().toISOString();
      const result = await run(
        `INSERT INTO projects (name, description, userId, parentId, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [data.name, data.description, data.userId, data.parentId, now, now]
      );

      const project = await this.getProjectById(result.lastID.toString(), data.userId);
      if (!project) {
        throw new Error('Failed to create project');
      }

      console.log('✅ Project created:', project);
      return project;
    } catch (error) {
      console.error('❌ Error creating project:', error);
      throw error;
    }
  }

  async getProjectById(id: string, userId: number): Promise<Project | null> {
    try {
      console.log('🔍 Getting project by ID:', id);
      const projects = await query<Project[]>(
        `SELECT * FROM projects WHERE id = ? AND userId = ?`,
        [id, userId]
      );
      const project = projects[0] || null;
      console.log('📋 Found project:', project?.id);
      return project;
    } catch (error) {
      console.error('❌ Error getting project:', error);
      throw error;
    }
  }

  async updateProject(id: string, updates: Partial<Project>, userId: number): Promise<Project | null> {
    try {
      console.log('📝 Updating project:', id, updates);
      const now = new Date().toISOString();
      const setClause = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'userId' && key !== 'createdAt')
        .map(key => `${key} = ?`)
        .join(', ');
      const values = Object.keys(updates)
        .filter(key => key !== 'id' && key !== 'userId' && key !== 'createdAt')
        .map(key => updates[key as keyof Project]);

      await run(
        `UPDATE projects SET ${setClause}, updatedAt = ? WHERE id = ? AND userId = ?`,
        [...values, now, id, userId]
      );

      const project = await this.getProjectById(id, userId);
      console.log('✅ Project updated:', project?.id);
      return project;
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(id: string, userId: number): Promise<void> {
    try {
      console.log('🗑️ Deleting project:', id);
      await run(
        'DELETE FROM projects WHERE id = ? AND userId = ?',
        [id, userId]
      );
      console.log('✅ Project deleted:', id);
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  }
} 