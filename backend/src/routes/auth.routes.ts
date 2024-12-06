import { Router } from 'express';
import { AuthService } from '../services/auth.service';
import { LoginRequest, RegisterRequest } from '../types';
import { z } from 'zod';

const router = Router();
const authService = new AuthService();

// Validation schemas
const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters')
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Invalid input or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', async (req, res) => {
  try {
    console.log('📨 Received registration request:', req.body);
    
    const validatedData = registerSchema.parse(req.body);
    console.log('✅ Validation passed');
    
    const user = await authService.register(validatedData);
    console.log('👤 User registered successfully:', user.email);
    
    res.status(201).json(user);
  } catch (error) {
    console.error('❌ Registration error:', error);
    
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors
      });
    }
    
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', async (req, res) => {
  try {
    console.log('📨 Received login request:', req.body);
    
    const validatedData = loginSchema.parse(req.body);
    console.log('✅ Validation passed');
    
    const user = await authService.login(validatedData);
    console.log('👤 User logged in successfully:', user.email);
    
    res.json(user);
  } catch (error) {
    console.error('❌ Login error:', error);
    
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return res.status(400).json({ 
        error: 'Validation failed',
        details: errors
      });
    }
    
    if (error instanceof Error) {
      return res.status(401).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 