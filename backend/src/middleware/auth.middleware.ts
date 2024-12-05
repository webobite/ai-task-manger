import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const authService = new AuthService();

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Invalid token format' });
    }

    const userId = await authService.validateToken(token);
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
}; 