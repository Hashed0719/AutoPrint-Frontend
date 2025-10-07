
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PaymentDetails from '@/components/payment/PaymentDetails';

const Payment = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Complete Payment</h1>
        <p className="text-muted-foreground text-center mb-8">
          Review your order and proceed with payment
        </p>
        <PaymentDetails />
      </div>
    </AppLayout>
  );
};

export default Payment;
