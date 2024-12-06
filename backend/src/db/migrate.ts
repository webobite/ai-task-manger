import sqlite3 from 'sqlite3';
import { DATABASE_PATH } from '../config';
import { initializeDatabase } from './init';

// Initialize database directory
initializeDatabase();

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  }
  console.log('Connected to SQLite database for migrations');
});

const createTables = () => {
  db.serialize(() => {
    // Create users table
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      )
    `);

    // Create projects table
    db.run(`
      CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        description TEXT,
        userId INTEGER NOT NULL,
        parentId INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (userId) REFERENCES users (id),
        FOREIGN KEY (parentId) REFERENCES projects (id)
      )
    `);

    // Create tasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL,
        priority TEXT NOT NULL,
        dueDate TEXT NOT NULL,
        projectId INTEGER NOT NULL,
        userId INTEGER NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (projectId) REFERENCES projects (id),
        FOREIGN KEY (userId) REFERENCES users (id)
      )
    `);

    // Create subtasks table
    db.run(`
      CREATE TABLE IF NOT EXISTS subtasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN NOT NULL DEFAULT 0,
        taskId INTEGER NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        FOREIGN KEY (taskId) REFERENCES tasks (id)
      )
    `);

    // Create task_history table
    db.run(`
      CREATE TABLE IF NOT EXISTS task_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        taskId INTEGER NOT NULL,
        message TEXT NOT NULL,
        details TEXT,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (taskId) REFERENCES tasks (id)
      )
    `);

    console.log('✅ All tables created successfully');
  });
};

createTables();

// Close the database connection after migrations
db.close((err) => {
  if (err) {
    console.error('Error closing database:', err);
    process.exit(1);
  } else {
    console.log('Database connection closed');
  }
}); 