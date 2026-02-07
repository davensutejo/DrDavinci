
import { User } from '../types';
import { apiClient } from './apiClient';

const SESSION_KEY = 'app_current_user';
const TOKEN_KEY = 'app_auth_token';
const TOKEN_EXPIRY_KEY = 'app_token_expiry';
const REMEMBER_ME_KEY = 'app_remember_me';

interface AuthResponse {
  success: boolean;
  user?: User;
  error?: string;
}

export const authService = {
  async signup(username: string, password: string, name: string, email: string = ''): Promise<AuthResponse> {
    try {
      const response: any = await apiClient.signup(username, password, name, email);
      
      if (response.error) {
        return {
          success: false,
          error: response.error || 'Signup failed'
        };
      }

      if (response.user && response.token) {
        // Store user and token after successful signup
        localStorage.setItem(SESSION_KEY, JSON.stringify(response.user));
        localStorage.setItem(TOKEN_KEY, response.token);
        if (response.expiresIn) {
          const expiry = new Date().getTime() + response.expiresIn;
          localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
        }
        return {
          success: true,
          user: response.user as User
        };
      }
      
      return {
        success: false,
        error: 'Invalid response from server'
      };
    } catch (error: any) {
      console.error('Signup error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during signup'
      };
    }
  },

  async login(username: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> {
    try {
      const response: any = await apiClient.login(username, password);
      
      if (response.error) {
        return {
          success: false,
          error: response.error || 'Login failed'
        };
      }

      if (response.user && response.token) {
        // Store user and token
        localStorage.setItem(SESSION_KEY, JSON.stringify(response.user));
        localStorage.setItem(TOKEN_KEY, response.token);
        localStorage.setItem(REMEMBER_ME_KEY, rememberMe.toString());
        
        if (response.expiresIn) {
          const expiry = new Date().getTime() + response.expiresIn;
          localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
        }
        
        return {
          success: true,
          user: response.user as User
        };
      }
      
      return {
        success: false,
        error: 'Invalid response from server'
      };
    } catch (error: any) {
      console.error('Login error:', error);
      return {
        success: false,
        error: error.message || 'An unexpected error occurred during login'
      };
    }
  },

  async verifyUser(userId: string): Promise<User | null> {
    try {
      const response: any = await apiClient.verifyUser(userId);
      
      if (response.error) {
        console.error('Verify error:', response.error);
        return null;
      }

      if (response.user) {
        return response.user as User;
      }
      
      return null;
    } catch (error: any) {
      console.error('Verify error:', error);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REMEMBER_ME_KEY);
  },

  getCurrentUser(): User | null {
    try {
      const item = localStorage.getItem(SESSION_KEY);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error('Error parsing current user:', e);
      return null;
    }
  },

  getAuthToken(): string | null {
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      
      if (!token || !expiry) return null;
      
      // Check if token has expired
      if (new Date().getTime() > parseInt(expiry)) {
        this.logout();
        return null;
      }
      
      return token;
    } catch (e) {
      console.error('Error getting auth token:', e);
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!this.getAuthToken() && !!this.getCurrentUser();
  },

  refreshToken(): void {
    const rememberMe = localStorage.getItem(REMEMBER_ME_KEY) === 'true';
    if (rememberMe) {
      const currentUser = this.getCurrentUser();
      if (currentUser) {
        const thirtyDaysFromNow = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
        localStorage.setItem(TOKEN_EXPIRY_KEY, thirtyDaysFromNow.toString());
      }
    }
  }
};
