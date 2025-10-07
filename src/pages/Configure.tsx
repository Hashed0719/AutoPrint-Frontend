
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import PrintConfiguration from '@/components/configure/PrintConfiguration';

const Configure = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Print Configuration</h1>
        <p className="text-muted-foreground text-center mb-8">
          Customize your print settings
        </p>
        <PrintConfiguration />
      </div>
    </AppLayout>
  );
};

export default Configure;
