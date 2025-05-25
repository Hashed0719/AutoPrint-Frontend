
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Sign In to AutoPrint</h1>
        <LoginForm />
      </div>
    </AppLayout>
  );
};

export default Login;
