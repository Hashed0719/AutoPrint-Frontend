
import React from 'react';
import { useApp } from '@/contexts/AppContext';
import { Button } from '@/components/ui/button';
import { useNavigate, useLocation } from 'react-router-dom';
import { PrinterIcon, UserIcon } from 'lucide-react';

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { state, logout } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if we're on an auth page
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={() => navigate('/')} role="button">
            <PrinterIcon className="text-brand-600" size={28} />
            <span className="font-bold text-xl">AutoPrint</span>
          </div>
          
          {state.isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => navigate('/orders')}
              >
                My Orders
              </Button>
              <Button
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => logout()}
              >
                Sign Out
              </Button>
              <div className="flex items-center gap-2">
                <span className="text-sm hidden sm:inline">{state.user?.email}</span>
                <div className="w-8 h-8 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center">
                  <UserIcon size={16} className="text-brand-600" />
                </div>
              </div>
            </div>
          ) : (
            !isAuthPage && (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-brand-600 hover:bg-brand-700 text-white"
                >
                  Sign Up
                </Button>
              </div>
            )
          )}
        </div>
      </header>
      
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4 flex flex-col items-center">
          {children}
        </div>
      </main>
      
      <footer className="border-t py-6 bg-white">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; 2025 AutoPrint. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-end">
            <a 
              href="https://merchant.razorpay.com/policy/QZ8APDS1hfqzx4/refund" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Cancellation & Refund
            </a>
            <button 
              onClick={() => navigate('/contact')}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Contact Us
            </button>
            <a 
              href="https://merchant.razorpay.com/policy/QZ8APDS1hfqzx4/terms" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Terms & Conditions
            </a>
            <button 
              onClick={() => navigate('/merchant')}
              className="text-sm text-muted-foreground hover:text-foreground hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              Merchant Login
            </button>
            <a 
              href="https://merchant.razorpay.com/policy/QZ8APDS1hfqzx4/privacy" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Privacy Policy
            </a>
            <a 
              href="https://merchant.razorpay.com/policy/QZ8APDS1hfqzx4/shipping" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground hover:underline"
            >
              Shipping Policy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
