/**
 * apiClient.ts
 * Provides HTTP client for communicating with the backend API
 */

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  user?: any;
  token?: string;
  expiresIn?: number;
  session?: any;
  sessions?: any[];
  message?: any;
  messages?: any[];
  success?: boolean;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private getAuthToken(): string | null {
    try {
      const token = localStorage.getItem('app_auth_token');
      return token;
    } catch {
      return null;
    }
  }

  private async request<T>(
    endpoint: string,
    method: string = 'GET',
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const token = this.getAuthToken();
    if (token) {
      options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
      };
    }

    if (body) {
      options.body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      console.error(`API Error [${method} ${endpoint}]:`, error);
      throw error;
    }
  }

  // Auth endpoints
  async signup(username: string, password: string, name: string, email?: string) {
    return this.request('/auth/signup', 'POST', { username, password, name, email });
  }

  async login(username: string, password: string) {
    return this.request('/auth/login', 'POST', { username, password });
  }

  async verifyUser(userId: string) {
    return this.request('/auth/verify', 'POST', { userId });
  }

  // History endpoints
  async getSessions(userId: string) {
    return this.request(`/history/sessions/${userId}`, 'GET');
  }

  async getSession(sessionId: string) {
    return this.request(`/history/session/${sessionId}`, 'GET');
  }

  async createSession(userId: string, title?: string) {
    return this.request('/history/session', 'POST', { userId, title });
  }

  async saveMessage(
    sessionId: string,
    role: string,
    content: string,
    imageUrl?: string,
    extractedSymptoms?: any,
    groundingSources?: any,
    analysisResults?: any,
    messageId?: string
  ) {
    return this.request('/history/message', 'POST', {
      sessionId,
      role,
      content,
      imageUrl,
      extractedSymptoms,
      groundingSources,
      analysisResults,
      messageId,
    });
  }

  async updateSession(sessionId: string, title: string) {
    return this.request(`/history/session/${sessionId}`, 'PUT', { title });
  }

  async deleteSession(sessionId: string) {
    return this.request(`/history/session/${sessionId}`, 'DELETE');
  }

  async clearUserData(userId: string) {
    return this.request(`/history/user/${userId}`, 'DELETE');
  }

  async healthCheck() {
    return this.request('/health', 'GET');
  }
}

export const apiClient = new ApiClient();
