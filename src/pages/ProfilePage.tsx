import React from 'react';
import Profile from '@/components/user/Profile';
import { useApp } from '@/contexts/AppContext';
import { Navigate } from 'react-router-dom';

const ProfilePage = () => {
  const { state: { isAuthenticated } } = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Profile />
    </div>
  );
};

export default ProfilePage;
