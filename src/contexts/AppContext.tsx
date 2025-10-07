import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { authService } from '@/services/authService';
import { processPdfFiles } from '@/utils/pdfUtils';

// Define our print settings types
export type PrintSettings = {
  color: 'color' | 'blackAndWhite';
  orientation: 'portrait' | 'landscape';
  pageSize: 'A4' | 'A3' | 'letter' | 'legal';
  copies: number;
  sides: 'single' | 'double';
  pages: string;
  colorMode?: 'color' | 'blackAndWhite'; // Legacy support
  doubleSided?: boolean; // Legacy support
};

// Define the document type
export type UploadedDocument = {
  id?: string;
  documentId?: string;
  file?: File;
  pageCount: number;
  name: string;
  fileName?: string;
  size: number;
  uploadDate: Date;
  price?: number;
  printSettings?: {
    sides: 'single' | 'double';
    color: 'color' | 'blackAndWhite';
    pageSize: 'A4' | 'A3' | 'letter' | 'legal';
    copies: number;
    orientation: 'portrait' | 'landscape';
    pages: string;
  };
};

// Define the user type
type User = {
  id?: string;
  email: string;
  username: string;
  name?: string;
  phone?: string;
} | null;

// Define the app state type
type AppState = {
  isAuthenticated: boolean;
  user: User;
  documents: UploadedDocument[];
  printSettings: PrintSettings;
  totalPrice: number;
  pricePerPage: number;
  isPriceCalculated: boolean;
};

// Define the context type
type AppContextType = {
  state: AppState;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (username: string, email: string, password: string) => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  uploadMultipleDocuments: (files: File[]) => Promise<void>;
  setPrintSettings: (settings: Partial<PrintSettings>) => void;
  calculatePrice: () => void;
};

// Default print settings
const defaultPrintSettings: PrintSettings = {
  color: 'blackAndWhite',
  orientation: 'portrait',
  pageSize: 'A4',
  copies: 1,
  sides: 'single',
  pages: '1',
  // Legacy support
  colorMode: 'blackAndWhite',
  doubleSided: false,
};

// Default price per page in INR (changed to 2 INR per page)
const DEFAULT_PRICE_PER_PAGE = 200; // 2 INR = 200 cents per page

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    documents: [],
    printSettings: defaultPrintSettings,
    totalPrice: 0,
    pricePerPage: DEFAULT_PRICE_PER_PAGE,
    isPriceCalculated: false,
  });

    // Initialize auth state from localStorage
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: { 
          email: user.email,
          username: user.username || user.email.split('@')[0] // Fallback to email prefix if username not provided
        }
      }));
    }
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ username: email, password });
      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        user: { 
          email: response.email || email,
          username: response.username || email.split('@')[0] // Fallback to email prefix if username not provided
        },
        documents: prev.documents,
        printSettings: prev.printSettings,
        totalPrice: prev.totalPrice,
        pricePerPage: prev.pricePerPage,
        isPriceCalculated: prev.isPriceCalculated
      }));
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setState(prev => ({
      ...prev,
      isAuthenticated: false,
      user: null,
    }));
  };

  // Register function
  const register = async (username: string, email: string, password: string) => {
    try {
      const response = await authService.register({ 
        username, 
        email, 
        password 
      });
      
      // Auto-login after registration
      if (response) {
        await login(email, password);
      }
      
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  // Legacy support for single document upload
  const uploadDocument = async (file: File) => {
    // Reuse multi-document upload for single file
    return uploadMultipleDocuments([file]);
  };

  // Upload multiple documents with accurate page count
  const uploadMultipleDocuments = async (files: File[]) => {
    try {
      const uploadedDocuments = await processPdfFiles(files);
      
      setState((prev) => ({
        ...prev,
        documents: uploadedDocuments,
        isPriceCalculated: false,
      }));
    } catch (error) {
      console.error('Error processing PDFs:', error);
      throw error;
    }
  };

  // Update print settings
  const setPrintSettings = (settings: Partial<PrintSettings>) => {
    setState((prev) => ({
      ...prev,
      printSettings: {
        ...prev.printSettings,
        ...settings,
      },
      isPriceCalculated: false,
    }));
  };

  // Calculate total price based on documents and settings
  const calculatePrice = () => {
    if (state.documents.length === 0) return;

    let pricePerPage = state.pricePerPage;
    
    // Apply modifiers based on settings
    if (state.printSettings.colorMode === 'color') {
      pricePerPage *= 2; // Color costs 2x more
    }
    
    if (state.printSettings.doubleSided) {
      pricePerPage *= 0.8; // 20% discount for double-sided
    }

    // Calculate total pages across all documents
    const totalPages = state.documents.reduce(
      (sum, doc) => sum + doc.pageCount, 
      0
    ) * state.printSettings.copies;
    
    const price = totalPages * pricePerPage;

    setState((prev) => ({
      ...prev,
      totalPrice: price,
      isPriceCalculated: true,
    }));
  };

  const value = {
    state,
    login,
    logout,
    register,
    uploadDocument,
    uploadMultipleDocuments,
    setPrintSettings,
    calculatePrice,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// Custom hook to use the app context
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
