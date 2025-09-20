// API client for communicating with the backend server
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://syncspace-production.up.railway.app';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    };

    // Add auth header if we have a session
    const { supabase } = await import('@/integrations/supabase/client');
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session?.access_token) {
      defaultHeaders.Authorization = `Bearer ${session.access_token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText };
        }
        return { error: errorData.error || `HTTP ${response.status}: ${response.statusText}` };
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      console.error('API request failed:', error);
      return { 
        error: error instanceof Error ? error.message : 'Network error' 
      };
    }
  }

  // Auth endpoints
  async getProfile() {
    return this.request('/api/profiles/me');
  }

  // Groups endpoints
  async getGroups() {
    return this.request('/api/groups');
  }

  async createGroup(groupName: string) {
    return this.request('/api/groups', {
      method: 'POST',
      body: JSON.stringify({ group_name: groupName }),
    });
  }

  async joinGroup(groupId: string) {
    return this.request('/api/groups/join', {
      method: 'POST',
      body: JSON.stringify({ group_id: groupId }),
    });
  }

  async getGroupMembers(groupId: string) {
    return this.request(`/api/groups/${groupId}/members`);
  }

  // Schedules endpoints
  async getSchedule() {
    return this.request('/api/schedules/me');
  }

  async updateSchedule(scheduleData: { schedule_json?: any; free_times?: any }) {
    return this.request('/api/schedules/me', {
      method: 'PUT',
      body: JSON.stringify(scheduleData),
    });
  }

  async getUserFreeTimes(userId: string) {
    return this.request(`/api/schedules/user/${userId}`);
  }

  // Users endpoints
  async searchUsers(query: string, limit = 10) {
    return this.request(`/api/users/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  }

  async getUser(userId: string) {
    return this.request(`/api/users/${userId}`);
  }

  async followUser(userId: string) {
    return this.request('/api/users/follow', {
      method: 'POST',
      body: JSON.stringify({ user_id: userId }),
    });
  }

  async unfollowUser(userId: string) {
    return this.request(`/api/users/follow/${userId}`, {
      method: 'DELETE',
    });
  }

  async getFollowers(userId: string) {
    return this.request(`/api/users/${userId}/followers`);
  }

  async getFollowing(userId: string) {
    return this.request(`/api/users/${userId}/following`);
  }

  async updateProfile(profileData: { full_name?: string; bio?: string; avatar_url?: string }) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  // Health check
  async health() {
    return this.request('/health');
  }
}

export const apiClient = new ApiClient();
