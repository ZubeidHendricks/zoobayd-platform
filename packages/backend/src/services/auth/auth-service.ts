import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { MongoClient, Db, Collection } from 'mongodb';

// User input validation schemas
const RegisterSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters')
});

const LoginSchema = z.object({
    username: z.string(),
    password: z.string()
});

interface User {
    id: string;
    username: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin' | 'developer';
    createdAt: Date;
}

class AuthService {
    private db: Db;
    private usersCollection: Collection;

    constructor(mongoClient: MongoClient) {
        this.db = mongoClient.db('zoobayd');
        this.usersCollection = this.db.collection('users');
    }

    async registerUser(userData: {
        username: string;
        email: string;
        password: string;
    }): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
        // Validate input
        const validatedData = RegisterSchema.parse(userData);

        // Check if user already exists
        const existingUser = await this.usersCollection.findOne({
            $or: [
                { username: validatedData.username },
                { email: validatedData.email }
            ]
        });

        if (existingUser) {
            throw new Error('Username or email already exists');
        }

        // Hash password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(validatedData.password, saltRounds);

        // Create user
        const newUser: User = {
            id: new Date().getTime().toString(), // Simple unique ID generation
            username: validatedData.username,
            email: validatedData.email,
            passwordHash,
            role: 'user',
            createdAt: new Date()
        };

        // Insert user
        await this.usersCollection.insertOne(newUser);

        // Generate JWT
        const token = this.generateJWT(newUser);

        // Remove sensitive data
        const { passwordHash: _, ...userWithoutHash } = newUser;

        return {
            user: userWithoutHash,
            token
        };
    }

    async loginUser(credentials: {
        username: string;
        password: string;
    }): Promise<{ user: Omit<User, 'passwordHash'>, token: string }> {
        // Validate input
        const validatedData = LoginSchema.parse(credentials);

        // Find user
        const user = await this.usersCollection.findOne({ 
            username: validatedData.username 
        });

        if (!user) {
            throw new Error('Invalid username or password');
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(
            validatedData.password, 
            user.passwordHash
        );

        if (!isPasswordValid) {
            throw new Error('Invalid username or password');
        }

        // Generate JWT
        const token = this.generateJWT(user);

        // Remove sensitive data
        const { passwordHash, ...userWithoutHash } = user;

        return {
            user: userWithoutHash,
            token
        };
    }

    private generateJWT(user: User): string {
        return jwt.sign(
            { 
                id: user.id, 
                username: user.username, 
                role: user.role 
            }, 
            process.env.JWT_SECRET || 'fallback_secret', 
            { expiresIn: '24h' }
        );
    }

    async verifyToken(token: string): Promise<User | null> {
        try {
            const decoded = jwt.verify(
                token, 
                process.env.JWT_SECRET || 'fallback_secret'
            ) as { id: string, username: string, role: string };

            // Find user
            const user = await this.usersCollection.findOne({ 
                id: decoded.id 
            });

            return user;
        } catch (error) {
            return null;
        }
    }
}

export default AuthService;