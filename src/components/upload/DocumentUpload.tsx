
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { FileIcon, UploadIcon, FileTextIcon } from 'lucide-react';

const DocumentUpload = () => {
  const { uploadDocument, state } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!isValidFileType(file)) {
      toast.error('Please upload a PDF file');
      return;
    }

    try {
      await uploadDocument(file);
      toast.success('Document uploaded successfully');
      navigate('/configure');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    if (!isValidFileType(file)) {
      toast.error('Please upload a PDF file');
      return;
    }

    try {
      await uploadDocument(file);
      toast.success('Document uploaded successfully');
      navigate('/configure');
    } catch (error) {
      toast.error('Failed to upload document');
    }
  };

  const isValidFileType = (file: File) => {
    // For now, we'll only accept PDF files
    return file.type === 'application/pdf';
  };

  return (
    <Card className="w-full max-w-xl shadow-lg">
      <CardContent className="p-6">
        <div
          className={`file-input-field flex flex-col items-center justify-center ${
            isDragging ? 'border-brand-500 bg-brand-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <UploadIcon size={48} className="text-brand-400 mb-4" />
          <h3 className="text-lg font-medium mb-2">Upload your document</h3>
          <p className="text-muted-foreground text-sm mb-4 text-center max-w-xs">
            Drag and drop your PDF here, or click to browse files
          </p>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button 
            variant="outline" 
            className="pointer-events-none"
            type="button"
          >
            Select PDF
          </Button>
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Supported File Types</h4>
          <div className="flex items-center text-sm text-muted-foreground space-x-4">
            <div className="flex items-center">
              <FileTextIcon size={16} className="mr-1 text-brand-500" />
              <span>PDF</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
