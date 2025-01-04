import express from 'express';
import { MongoClient } from 'mongodb';
import AuthService from '../services/auth/auth-service';
import MonitoringService from '../services/monitoring-service';

const createAuthRoutes = (mongoClient: MongoClient) => {
    const router = express.Router();
    const authService = new AuthService(mongoClient);

    // Registration Route
    router.post('/register', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('user_registration');

        try {
            const { user, token } = await authService.registerUser(req.body);
            
            MonitoringService.recordRequest('auth', 'register');
            monitoringSpan.end();

            res.status(201).json({ user, token });
        } catch (error) {
            MonitoringService.recordError('auth', 'registration_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(400).json({ 
                message: error instanceof Error ? error.message : 'Registration failed' 
            });
        }
    });

    // Login Route
    router.post('/login', async (req, res) => {
        const monitoringSpan = MonitoringService.startTrace('user_login');

        try {
            const { user, token } = await authService.loginUser(req.body);
            
            MonitoringService.recordRequest('auth', 'login');
            monitoringSpan.end();

            res.json({ user, token });
        } catch (error) {
            MonitoringService.recordError('auth', 'login_failed');
            monitoringSpan.recordException(error);
            monitoringSpan.end();

            res.status(401).json({ 
                message: error instanceof Error ? error.message : 'Login failed' 
            });
        }
    });

    // Token Verification Middleware
    const authMiddleware = async (req, res, next) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        try {
            const user = await authService.verifyToken(token);
            
            if (!user) {
                return res.status(401).json({ message: 'Invalid token' });
            }

            req.user = user;
            next();
        } catch (error) {
            res.status(401).json({ message: 'Unauthorized' });
        }
    };

    // Protected Route Example
    router.get('/profile', authMiddleware, (req, res) => {
        res.json({ 
            message: 'Access granted to protected route', 
            user: req.user 
        });
    });

    return { router, authMiddleware };
};

export default createAuthRoutes;