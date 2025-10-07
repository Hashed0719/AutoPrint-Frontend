
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "./contexts/AppContext";

import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Upload from "./pages/Upload";
import Configure from "./pages/Configure";
import Payment from "./pages/Payment";
import Success from "./pages/Success";
import Contact from "./pages/Contact";
import Orders from "./pages/Orders";
import MerchantAuth from "./pages/MerchantAuth";
import NotFound from "./pages/NotFound";
import { useEffect } from 'react';

const queryClient = new QueryClient();

// A wrapper component to handle authentication redirects
const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { state: { isAuthenticated } } = useApp();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    const publicPaths = ['/login', '/register', '/', '/contact', '/merchant'];
    const currentPath = window.location.pathname;
    
    if (!isAuthenticated && !publicPaths.includes(currentPath)) {
      // Store the current path to redirect back after login
      sessionStorage.setItem('redirectAfterLogin', currentPath);
      window.location.href = '/login';
    }
  }, [isAuthenticated]);

  return <>{children}</>;
};

const AppRoutes = () => {
  const { state: { isAuthenticated } } = useApp();

  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/upload" />} />
      <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/upload" />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/merchant" element={!isAuthenticated ? <MerchantAuth /> : <Navigate to="/merchant/dashboard" />} />
      
      {/* Protected routes */}
      <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
      <Route path="/configure" element={isAuthenticated ? <Configure /> : <Navigate to="/login" />} />
      <Route path="/payment" element={isAuthenticated ? <Payment /> : <Navigate to="/login" />} />
      <Route path="/success" element={isAuthenticated ? <Success /> : <Navigate to="/login" />} />
      <Route path="/orders" element={isAuthenticated ? <Orders /> : <Navigate to="/login" />} />
  
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthWrapper>
            <AppRoutes />
          </AuthWrapper>
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
