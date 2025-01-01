import { Request, Response, NextFunction } from 'express';
import { User } from '../models';

export const rbac = (requiredRole: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await User.findById(req.user.id).populate('roles');
      const hasPermission = user.roles.some(role => role.name === requiredRole);
      
      if (!hasPermission) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }
      
      next();
    } catch (error) {
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
};