import { useState, useEffect, useCallback } from 'react';
import userService, { UserProfile } from '@/services/userService';
import { useApp } from '@/contexts/AppContext';

export const useUser = () => {
  const { state: { isAuthenticated }, logout: logoutFromApp } = useApp();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Fetch current user's profile
  const fetchUserProfile = useCallback(async () => {
    if (!isAuthenticated) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const profile = await userService.getMyProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
      // If unauthorized, log the user out
      if ((err as any)?.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load user profile when authentication state changes
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // Update user profile
  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const updatedProfile = await userService.updateMyProfile(profileData);
      setUser(prev => prev ? { ...prev, ...updatedProfile } : updatedProfile);
      return updatedProfile;
    } catch (err) {
      console.error('Failed to update profile:', err);
      throw err;
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    await userService.changePassword(currentPassword, newPassword);
  };

  // Logout
  const logout = () => {
    userService.logout().finally(() => {
      logoutFromApp();
    });
  };

  // Check if user has a specific role
  const hasRole = useCallback((role: string) => {
    return user?.roles?.includes(role) || false;
  }, [user]);

  // Check if user has any of the specified roles
  const hasAnyRole = useCallback((roles: string[]) => {
    if (!user?.roles) return false;
    return roles.some(role => user.roles?.includes(role));
  }, [user]);

  // Check if user has all of the specified roles
  const hasAllRoles = useCallback((roles: string[]) => {
    if (!user?.roles) return false;
    return roles.every(role => user.roles?.includes(role));
  }, [user]);

  return {
    user,
    loading,
    error,
    refresh: fetchUserProfile,
    updateProfile,
    changePassword,
    logout,
    hasRole,
    hasAnyRole,
    hasAllRoles,
  };
};

export default useUser;
