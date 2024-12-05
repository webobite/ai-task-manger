import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, run } from '../db';
import { JWT_SECRET } from '../config';
import { User, UserResponse, LoginRequest, RegisterRequest } from '../types';

export class AuthService {
  private generateToken(userId: number): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' });
  }

  private async findUserByEmail(email: string): Promise<User | undefined> {
    try {
      console.log('🔍 Looking up user by email:', email);
      const users = await query<User[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      console.log('👥 Found users:', users.length);
      return users[0];
    } catch (error) {
      console.error('❌ Error finding user by email:', error);
      throw error;
    }
  }

  async register(data: RegisterRequest): Promise<UserResponse> {
    try {
      console.log('📝 Starting registration process for:', data.email);
      
      // Check if user already exists
      const existingUser = await this.findUserByEmail(data.email);
      if (existingUser) {
        console.log('⚠️ User already exists:', data.email);
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const now = new Date().toISOString();

      console.log('👤 Creating new user record');
      // Create user
      const result = await run(
        `INSERT INTO users (email, password, name, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?)`,
        [data.email, hashedPassword, data.name, now, now]
      );

      console.log('✅ User created successfully with ID:', result.lastID);
      const token = this.generateToken(result.lastID);

      return {
        id: result.lastID,
        email: data.email,
        name: data.name,
        token
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      throw error;
    }
  }

  async login(data: LoginRequest): Promise<UserResponse> {
    try {
      console.log('🔑 Starting login process for:', data.email);
      
      // Find user
      const user = await this.findUserByEmail(data.email);
      if (!user) {
        console.log('⚠️ User not found:', data.email);
        throw new Error('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(data.password, user.password);
      if (!isValidPassword) {
        console.log('⚠️ Invalid password for user:', data.email);
        throw new Error('Invalid credentials');
      }

      console.log('✅ Login successful for user:', data.email);
      const token = this.generateToken(user.id);

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        token
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  async validateToken(token: string): Promise<number> {
    try {
      console.log('🔒 Validating token');
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
      console.log('✅ Token valid for user ID:', decoded.userId);
      return decoded.userId;
    } catch (error) {
      console.error('❌ Token validation error:', error);
      throw new Error('Invalid token');
    }
  }
} 