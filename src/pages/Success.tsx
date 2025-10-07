
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import SuccessPage from '@/components/payment/SuccessPage';

const Success = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold mb-2 text-center">Thank You!</h1>
        <p className="text-muted-foreground text-center mb-8">
          Your order has been successfully processed
        </p>
        <SuccessPage />
      </div>
    </AppLayout>
  );
};

export default Success;
