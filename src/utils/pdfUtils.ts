import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

let pdfWorkerInitialized = false;

const initializePdfWorker = async () => {
  if (!pdfWorkerInitialized && typeof window !== 'undefined') {
    const pdfjs = await import('pdfjs-dist');
    const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.entry');
    GlobalWorkerOptions.workerSrc = pdfjsWorker;
    pdfWorkerInitialized = true;
  }
};

export const getPdfPageCount = async (file: File): Promise<number> => {
  try {
    // Initialize PDF.js worker if not already done
    await initializePdfWorker();
    
    // Convert file to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load the PDF document with proper configuration
    const loadingTask = getDocument({
      data: arrayBuffer,
      // Enable worker for better performance
      worker: null, // Let pdf.js use the worker we set up
      // Disable range requests for better compatibility
      disableRange: true,
      // Disable auto fetch for better compatibility
      disableAutoFetch: true,
      // Disable stream for better compatibility
      disableStream: true,
    });
    
    const pdfDocument = await loadingTask.promise;
    
    // Return the number of pages
    return pdfDocument.numPages;
  } catch (error) {
    console.error('Error counting PDF pages:', error);
    // Fallback to 1 page if there's an error
    return 1;
  }
};

export const processPdfFiles = async (files: File[]) => {
  const processedFiles = [];
  
  for (const file of files) {
    const pageCount = await getPdfPageCount(file);
    processedFiles.push({
      file,
      pageCount,
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
    });
  }
  
  return processedFiles;
};
