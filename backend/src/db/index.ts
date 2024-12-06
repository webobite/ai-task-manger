import sqlite3 from 'sqlite3';
import { DATABASE_PATH } from '../config';
import { initializeDatabase } from './init';

// Initialize database directory
initializeDatabase();

const db = new sqlite3.Database(DATABASE_PATH, (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database');
  }
});

export const query = <T>(sql: string, params: any[] = []): Promise<T> => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        reject(err);
      } else {
        resolve(rows as T);
      }
    });
  });
};

export const run = (sql: string, params: any[] = []): Promise<{ lastID: number }> => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        console.error('Database run error:', err);
        reject(err);
      } else {
        resolve({ lastID: this.lastID });
      }
    });
  });
};

// Handle process termination
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error('Error closing database:', err);
      process.exit(1);
    } else {
      console.log('Database connection closed');
      process.exit(0);
    }
  });
});

export default db; 