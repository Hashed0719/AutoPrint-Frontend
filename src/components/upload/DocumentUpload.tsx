
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { FileIcon, UploadIcon, FileTextIcon, FilesIcon } from 'lucide-react';

const DocumentUpload = () => {
  const { uploadMultipleDocuments, state } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast.error('Please upload PDF files only');
      return;
    }

    try {
      await uploadMultipleDocuments(pdfFiles);
      toast.success(
        pdfFiles.length === 1 
          ? 'Document uploaded successfully' 
          : `${pdfFiles.length} documents uploaded successfully`
      );
      navigate('/configure');
    } catch (error) {
      toast.error('Failed to upload documents');
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

    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast.error('Please upload PDF files only');
      return;
    }

    try {
      await uploadMultipleDocuments(pdfFiles);
      toast.success(
        pdfFiles.length === 1 
          ? 'Document uploaded successfully' 
          : `${pdfFiles.length} documents uploaded successfully`
      );
      navigate('/configure');
    } catch (error) {
      toast.error('Failed to upload documents');
    }
  };

  return (
    <Card className="w-full max-w-xl shadow-lg">
      <CardContent className="p-6">
        <div
          className={`file-input-field border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer relative ${
            isDragging ? 'border-brand-500 bg-brand-50' : ''
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FilesIcon size={48} className="text-brand-400 mb-4 mx-auto" />
          <h3 className="text-lg font-medium mb-2">Upload your documents</h3>
          <p className="text-muted-foreground text-sm mb-4 text-center max-w-xs mx-auto">
            Drag and drop multiple PDFs here, or click to browse files
          </p>
          <input
            type="file"
            accept=".pdf"
            multiple
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Button 
            variant="outline" 
            className="pointer-events-none"
            type="button"
          >
            Select PDFs
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
