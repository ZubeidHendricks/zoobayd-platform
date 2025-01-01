import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import cors from 'cors';

class SecurityMiddleware {
  // Rate limiting to prevent brute force attacks
  public static rateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later'
  });

  // CORS configuration
  public static corsOptions = {
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  };

  // Security headers and protection
  public static securityMiddleware(req: Request, res: Response, next: NextFunction) {
    // Custom security checks
    if (!req.headers.authorization) {
      return res.status(403).json({ error: 'Authentication token required' });
    }

    // Additional custom security logic
    const token = req.headers.authorization.split(' ')[1];
    if (!this.validateToken(token)) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    next();
  }

  private static validateToken(token: string): boolean {
    // Implement token validation logic
    // This could involve checking against a blacklist, verifying signature, etc.
    return token.length > 10; // Placeholder validation
  }

  // Method to apply all security middlewares
  public static applyMiddlewares(app: any) {
    app.use(helmet()); // Set various HTTP headers for security
    app.use(cors(this.corsOptions));
    app.use(this.rateLimiter);
    app.use(this.securityMiddleware);
  }
}