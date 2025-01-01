import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';

interface UserCredentials {
  email: string;
  password: string;
}

interface AuthenticationResult {
  success: boolean;
  token?: string;
  user?: any;
  error?: string;
}

class AuthenticationService {
  private static SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret';
  private googleClient: OAuth2Client;

  constructor() {
    this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async registerUser(credentials: UserCredentials): Promise<AuthenticationResult> {
    try {
      // Hash password
      const hashedPassword = await bcrypt.hash(credentials.password, 10);
      
      // TODO: Save user to database
      return {
        success: true,
        user: { email: credentials.email }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Registration failed'
      };
    }
  }

  async authenticateUser(credentials: UserCredentials): Promise<AuthenticationResult> {
    try {
      // TODO: Fetch user from database
      const isPasswordValid = await bcrypt.compare(credentials.password, 'hashed_password');
      
      if (isPasswordValid) {
        const token = jwt.sign(
          { email: credentials.email },
          AuthenticationService.SECRET_KEY,
          { expiresIn: '24h' }
        );

        return {
          success: true,
          token,
          user: { email: credentials.email }
        };
      }

      return {
        success: false,
        error: 'Invalid credentials'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication failed'
      };
    }
  }

  async googleAuthentication(token: string): Promise<AuthenticationResult> {
    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID
      });

      const payload = ticket.getPayload();
      if (!payload) {
        return { success: false, error: 'Invalid Google token' };
      }

      const googleToken = jwt.sign(
        { email: payload.email },
        AuthenticationService.SECRET_KEY,
        { expiresIn: '24h' }
      );

      return {
        success: true,
        token: googleToken,
        user: {
          email: payload.email,
          name: payload.name,
          picture: payload.picture
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Google authentication failed'
      };
    }
  }

  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, AuthenticationService.SECRET_KEY);
      return true;
    } catch {
      return false;
    }
  }
}

export default new AuthenticationService();