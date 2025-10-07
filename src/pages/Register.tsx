
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import RegisterForm from '@/components/auth/RegisterForm';

const Register = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-8 text-center">Create AutoPrint Account</h1>
        <RegisterForm />
      </div>
    </AppLayout>
  );
};

export default Register;
