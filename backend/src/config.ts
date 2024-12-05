import dotenv from 'dotenv';
import path from 'path';

// Load environment variables based on NODE_ENV
const envFile = process.env.NODE_ENV === 'production' 
  ? '.env.production'
  : '.env.development';

dotenv.config({ path: path.resolve(process.cwd(), envFile) });

// Environment variables with types and validation
export const PORT = Number(process.env.PORT) || 3000;
export const JWT_SECRET = process.env.JWT_SECRET || 'default-dev-secret';
export const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_PATH = process.env.DB_PATH 
  ? path.resolve(process.cwd(), process.env.DB_PATH)
  : path.join(process.cwd(), 'data', 'taskmanager.db');

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'CORS_ORIGIN'] as const;
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

// Configuration object for easy imports
export const config = {
  port: PORT,
  jwtSecret: JWT_SECRET,
  corsOrigin: CORS_ORIGIN,
  nodeEnv: NODE_ENV,
  databasePath: DATABASE_PATH,
  isDevelopment: NODE_ENV === 'development',
  isProduction: NODE_ENV === 'production',
} as const;