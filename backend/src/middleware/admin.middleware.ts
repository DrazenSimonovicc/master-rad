import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import { Role } from '@prisma/client';

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.userRole) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.userRole !== Role.ADMIN) {
    return res.status(403).json({ 
      error: 'Admin access required',
      message: 'You do not have permission to access this resource'
    });
  }

  next();
};

export const requireAdminOrModerator = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.userRole) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  if (req.userRole !== Role.ADMIN && req.userRole !== Role.MODERATOR) {
    return res.status(403).json({ 
      error: 'Moderator or Admin access required',
      message: 'You do not have permission to access this resource'
    });
  }

  next();
};


