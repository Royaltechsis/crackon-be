import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_here';

interface JwtPayload {
  id: string;
  role: UserRole;
}

// Extend Express Request type to include user data
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userRole?: UserRole;
    }
  }
}

// Authenticate JWT token
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'No token provided. Authorization denied.' });
      return;
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    
    // Attach user info to request
    req.userId = decoded.id;
    req.userRole = decoded.role;

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      res.status(401).json({ message: 'Invalid token' });
    } else if (error.name === 'TokenExpiredError') {
      res.status(401).json({ message: 'Token expired' });
    } else {
      res.status(500).json({ message: 'Server error during authentication' });
    }
  }
};

// Authorize specific roles
export const authorize = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.userRole) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    if (!roles.includes(req.userRole)) {
      res.status(403).json({ 
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.userRole}` 
      });
      return;
    }

    next();
  };
};

// Middleware to check if user is admin
export const isAdmin = authorize('admin');

// Middleware to check if user is artisan
export const isArtisan = authorize('artisan');

// Middleware to check if user is customer
export const isCustomer = authorize('customer');

// Middleware to check if user is artisan or admin
export const isArtisanOrAdmin = authorize('artisan', 'admin');
