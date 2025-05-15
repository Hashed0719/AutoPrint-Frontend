
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define our print settings types
export type PrintSettings = {
  colorMode: 'color' | 'blackAndWhite';
  orientation: 'portrait' | 'landscape';
  pageSize: 'a4' | 'letter' | 'legal';
  copies: number;
  doubleSided: boolean;
};

// Define the document type
export type UploadedDocument = {
  file: File;
  pageCount: number;
  name: string;
  size: number;
  uploadDate: Date;
};

// Define the app state type
type AppState = {
  isAuthenticated: boolean;
  user: { email: string } | null;
  document: UploadedDocument | null;
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
  register: (email: string, password: string) => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  setPrintSettings: (settings: Partial<PrintSettings>) => void;
  calculatePrice: () => void;
};

// Default print settings
const defaultPrintSettings: PrintSettings = {
  colorMode: 'blackAndWhite',
  orientation: 'portrait',
  pageSize: 'a4',
  copies: 1,
  doubleSided: false,
};

// Default price per page in cents
const DEFAULT_PRICE_PER_PAGE = 15; // 15 cents per page

// Create the context with a default value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AppState>({
    isAuthenticated: false,
    user: null,
    document: null,
    printSettings: defaultPrintSettings,
    totalPrice: 0,
    pricePerPage: DEFAULT_PRICE_PER_PAGE,
    isPriceCalculated: false,
  });

  // Mock login function
  const login = async (email: string, password: string) => {
    // In a real app, this would validate with a backend
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: { email },
    }));
  };

  // Mock logout function
  const logout = () => {
    setState((prev) => ({
      ...prev,
      isAuthenticated: false,
      user: null,
    }));
  };

  // Mock register function
  const register = async (email: string, password: string) => {
    // In a real app, this would register with a backend
    setState((prev) => ({
      ...prev,
      isAuthenticated: true,
      user: { email },
    }));
  };

  // Mock document upload with page count estimation
  const uploadDocument = async (file: File) => {
    // In a real app, we'd analyze the PDF to get the page count
    // For now, we'll use a simple heuristic based on file size
    const estimatedPageCount = Math.max(1, Math.floor(file.size / 50000));
    
    setState((prev) => ({
      ...prev,
      document: {
        file,
        pageCount: estimatedPageCount,
        name: file.name,
        size: file.size,
        uploadDate: new Date(),
      },
      isPriceCalculated: false,
    }));
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

  // Calculate total price based on document and settings
  const calculatePrice = () => {
    if (!state.document) return;

    let pricePerPage = state.pricePerPage;
    
    // Apply modifiers based on settings
    if (state.printSettings.colorMode === 'color') {
      pricePerPage *= 2; // Color costs 2x more
    }
    
    if (state.printSettings.doubleSided) {
      pricePerPage *= 0.8; // 20% discount for double-sided
    }

    const totalPages = state.document.pageCount * state.printSettings.copies;
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
