
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { QrCodeIcon, ArrowLeftIcon, CheckIcon, PrinterIcon, IndianRupeeIcon } from 'lucide-react';

const PaymentDetails = () => {
  const { state, calculatePrice } = useApp();
  const navigate = useNavigate();
  
  // Make sure we have documents and price is calculated
  useEffect(() => {
    if (state.documents.length === 0) {
      navigate('/upload');
      return;
    }
    
    if (!state.isPriceCalculated) {
      calculatePrice();
    }
  }, [state.documents, state.isPriceCalculated]);

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated]);

  // Format cents to INR
  const formatPrice = (cents: number): string => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  // Generate a fake "order ID" for the QR code
  const generateOrderId = (): string => {
    return `PRINT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  };

  const orderId = generateOrderId();
  
  // Calculate total pages across all documents
  const totalPages = state.documents.reduce((sum, doc) => sum + doc.pageCount, 0);

  return (
    <Card className="w-full max-w-xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl text-center">Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8">
          <h3 className="font-medium mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Documents</span>
              <span className="font-medium">{state.documents.length} file(s)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Pages</span>
              <span className="font-medium">{totalPages} pages</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Copies</span>
              <span className="font-medium">{state.printSettings.copies}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Color Mode</span>
              <span className="font-medium capitalize">{state.printSettings.colorMode === 'blackAndWhite' ? 'Black & White' : 'Color'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Double-sided</span>
              <span className="font-medium">{state.printSettings.doubleSided ? 'Yes' : 'No'}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Rate</span>
              <span className="font-medium">₹2.00 per page</span>
            </div>
            <div className="border-t my-2"></div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span className="text-lg flex items-center gap-1">
                <IndianRupeeIcon size={16} />
                {(state.totalPrice / 100).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 bg-muted/30">
          <div className="text-center mb-6">
            <h3 className="font-medium mb-1">Scan to Pay</h3>
            <p className="text-sm text-muted-foreground">
              Scan the QR code to complete your payment
            </p>
          </div>
          
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="relative w-48 h-48 border border-muted flex items-center justify-center">
                <QrCodeIcon size={120} className="text-brand-600" strokeWidth={1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white px-2 py-1 rounded text-xs text-brand-600 font-medium">
                    {orderId}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-1">
              Order ID: <span className="font-medium">{orderId}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Amount: <span className="font-medium flex items-center gap-1 justify-center">
                <IndianRupeeIcon size={14} />
                {(state.totalPrice / 100).toFixed(2)}
              </span>
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-6 border-t">
        <Button 
          variant="outline" 
          onClick={() => navigate('/configure')}
          className="flex items-center gap-1"
        >
          <ArrowLeftIcon size={16} />
          Back
        </Button>
        <Button 
          onClick={() => {
            // In a real app, this would verify payment and submit the print job
            navigate('/success');
          }}
          className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2"
        >
          <CheckIcon size={16} />
          Complete Order
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentDetails;
