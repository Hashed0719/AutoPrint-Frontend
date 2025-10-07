
import React from 'react';
import AppLayout from '@/components/layout/AppLayout';
import DocumentUpload from '@/components/upload/DocumentUpload';

const Upload = () => {
  return (
    <AppLayout>
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Upload Documents</h1>
        <p className="text-muted-foreground text-center mb-8">
          Select one or more PDF documents to print
        </p>
        <DocumentUpload />
      </div>
    </AppLayout>
  );
};

export default Upload;
