import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { toast } from 'sonner';
import { FileIcon, UploadIcon, FileTextIcon, FilesIcon, Loader2 } from 'lucide-react';

const DocumentUpload = () => {
  const { uploadMultipleDocuments, state } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const processFiles = async (files: FileList) => {
    const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
    
    if (pdfFiles.length === 0) {
      toast.error('Please upload PDF files only');
      return false;
    }

    try {
      setIsLoading(true);
      await uploadMultipleDocuments(pdfFiles);
      toast.success(
        pdfFiles.length === 1 
          ? 'Document uploaded successfully' 
          : `${pdfFiles.length} documents uploaded successfully`
      );
      navigate('/configure');
      return true;
    } catch (error) {
      toast.error('Failed to process documents');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    await processFiles(files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isLoading) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (!files || files.length === 0) return;
    
    await processFiles(files);
  };

  return (
    <Card className="w-full max-w-xl shadow-lg">
      <CardContent className="p-6">
        <div
          className={`file-input-field border-2 border-dashed rounded-lg p-8 text-center relative transition-colors ${
            isDragging 
              ? 'border-brand-600 bg-brand-100' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          } ${isLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-brand-500 animate-spin mb-4" />
              <h3 className="text-lg font-medium mb-2">Processing PDFs...</h3>
              <p className="text-mutedForeground text-sm">Please wait while we analyze your documents</p>
            </div>
          ) : (
            <>
              <FilesIcon size={48} className="text-brand-400 mb-4 mx-auto" />
              <h3 className="text-lg font-medium mb-2">Upload your documents</h3>
              <p className="text-mutedForeground text-sm mb-4 text-center max-w-xs mx-auto">
                Drag and drop multiple PDFs here, or click to browse files
              </p>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handleFileChange}
                disabled={isLoading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
              <Button 
                variant="outline" 
                className="pointer-events-none"
                type="button"
                disabled={isLoading}
              >
                Select PDFs
              </Button>
            </>
          )}
        </div>
        
        <div className="mt-6">
          <h4 className="text-sm font-medium mb-3">Supported File Types</h4>
          <div className="flex items-center text-sm text-mutedForeground space-x-4">
            <div className="flex items-center">
              <FileTextIcon size={16} className="mr-1 text-brand-600" />
              <span>PDF</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
