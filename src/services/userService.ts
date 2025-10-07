import api from './api';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string;
  role?: string;
  roles?: string[]; // For role-based access control
  createdAt?: string;
  updatedAt?: string;
}

const userService = {
  // Get current user's profile
  async getMyProfile(): Promise<UserProfile> {
    const response = await api.get('/users/me');
    return response.data;
  },

  // Update current user's profile
  async updateMyProfile(profileData: Partial<UserProfile>): Promise<UserProfile> {
    // Only include fields that are allowed to be updated
    const { id, username, createdAt, updatedAt, ...updateData } = profileData;
    const response = await api.patch('/users/me', updateData);
    return response.data;
  },

  // Change current user's password
  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/users/change-password', { currentPassword, newPassword });
  },

  // Admin: Get all users (paginated)
  async getUsers(page: number = 0, size: number = 10): Promise<{ content: UserProfile[], totalElements: number }> {
    const response = await api.get(`/users?page=${page}&size=${size}`);
    return {
      content: response.data.content,
      totalElements: response.data.totalElements
    };
  },

  // Admin: Get user by ID
  async getUserById(userId: number): Promise<UserProfile> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Admin: Create new user
  async createUser(userData: {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    phoneNumber?: string;
    roles?: string[];
  }): Promise<UserProfile> {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Admin: Update user by ID
  async updateUser(userId: number, userData: Partial<UserProfile>): Promise<UserProfile> {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Admin: Delete user by ID
  async deleteUser(userId: number): Promise<void> {
    await api.delete(`/users/${userId}`);
  },

  // Check if username is available
  async checkUsernameAvailability(username: string): Promise<boolean> {
    const response = await api.get(`/users/check-username?username=${encodeURIComponent(username)}`);
    return response.data.available;
  },

  // Check if email is available
  async checkEmailAvailability(email: string): Promise<boolean> {
    const response = await api.get(`/users/check-email?email=${encodeURIComponent(email)}`);
    return response.data.available;
  }
};

export default userService;
