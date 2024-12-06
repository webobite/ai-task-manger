import fs from 'fs';
import path from 'path';
import { DATABASE_PATH } from '../config';

// Ensure database directory exists
export const initializeDatabase = () => {
  const dbDir = path.dirname(DATABASE_PATH);
  
  if (!fs.existsSync(dbDir)) {
    console.log(`Creating database directory: ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  console.log(`Database will be stored at: ${DATABASE_PATH}`);
}; 