import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/components/ui/use-toast';
import { QrCodeIcon, ArrowLeftIcon, Loader2, IndianRupeeIcon } from 'lucide-react';
import { createOrder } from '@/services/orderService';
import { loadRazorpay, openRazorpay, verifyPayment } from '@/services/paymentService';
import { UploadedDocument } from '@/types/document';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentDetails = () => {
  const { state, calculatePrice } = useApp();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load Razorpay script when component mounts
  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpay();
      setIsRazorpayLoaded(loaded);
    };

    loadScript();
  }, []);

  // Make sure we have documents and price is calculated
  useEffect(() => {
    if (state.documents.length === 0) {
      navigate('/upload');
      return;
    }

    if (!state.isPriceCalculated) {
      calculatePrice();
    }
  }, [state.documents, state.isPriceCalculated, navigate, calculatePrice]);

  const handlePayment = async () => {
    if (!state.user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to continue with payment',
        variant: 'destructive',
      });
      return;
    }

    if (!state.totalPrice) {
      toast({
        title: 'Error',
        description: 'Please calculate the price first',
        variant: 'destructive',
      });
      return;
    }

    if (!isRazorpayLoaded) {
      toast({
        title: 'Payment Error',
        description: 'Payment service is still initializing. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Create order request with merchant ID
      if (!state.selectedMerchant?.id) {
        throw new Error('No merchant selected');
      }

      const orderRequest = {
        merchantId: state.selectedMerchant.id,
        documents: state.documents.map((doc) => ({
          documentId: doc.documentId || doc.id || `doc-${Math.random().toString(36).substr(2, 9)}`,
          fileName: doc.fileName || doc.name || 'document.pdf',
          pageCount: doc.pageCount || 1,
          price: doc.price || 0,
          printSettings: {
            sides: doc.printSettings?.sides || state.printSettings.sides || 'single',
            color: doc.printSettings?.color || state.printSettings.color || 'blackAndWhite',
            pageSize: doc.printSettings?.pageSize || state.printSettings.pageSize || 'A4',
            copies: doc.printSettings?.copies || state.printSettings.copies || 1,
            orientation: doc.printSettings?.orientation || state.printSettings.orientation || 'portrait',
            pages: doc.printSettings?.pages || state.printSettings.pages || '1',
          },
        })),
        totalAmount: state.totalPrice,
        currency: 'INR',
        notes: `Print order for ${state.user?.username || 'user'} to be fulfilled by ${state.selectedMerchant.businessName}`,
      };

      // Create order
      const order = await createOrder(orderRequest);

      if (!order.razorpayOrderId) {
        throw new Error('Failed to create payment order');
      }

      // Open Razorpay checkout
      openRazorpay({
        amount: order.totalAmount, // Amount is in paise (conversion handled in backend)
        currency: order.currency,
        name: 'AutoPrint',
        description: 'Print Order Payment',
        order_id: order.razorpayOrderId,
        prefill: {
          name: state.user?.name || state.user?.username || '',
          email: state.user?.email || '',
          contact: state.user?.phone || '',
        },
        theme: {
          color: '#4f46e5',
        },
        handler: async (response) => {
          try {
            // Verify payment
            await verifyPayment(
              order.id, // Internal order ID
              response.razorpay_payment_id,
              response.razorpay_signature,
              response.razorpay_order_id // Razorpay order ID
            );

            toast({
              title: 'Payment Successful',
              description: 'Your order has been placed successfully!',
              variant: 'default',
            });

            // Redirect to orders page
            navigate('/orders');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast({
              title: 'Payment Verification Failed',
              description: 'There was an error verifying your payment. Please contact support.',
              variant: 'destructive',
            });
          }
        },
        modal: {
          ondismiss: () => {
            // Handle modal close
            console.log('Payment modal was closed');
          },
        },
      });
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: error instanceof Error ? error.message : 'Failed to process payment',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!state.isAuthenticated) {
      navigate('/login');
    }
  }, [state.isAuthenticated]);

  // Format price to INR
  const formatPrice = (cents: number): string => {
    return `₹${(cents / 100).toFixed(2)}`;
  };

  // Generate a fake "order ID" for the QR code
  const generateOrderId = (): string => {
    return `PRINT-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
  };

  const orderId = generateOrderId();

  // Calculate total pages across all documents
  const totalPages = state.documents.reduce((sum, doc) => {
    const pageCount = doc.pageCount || 1; // Default to 1 if not provided
    return sum + pageCount;
  }, 0);

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
              <span className="font-medium capitalize">
                {state.printSettings.colorMode === 'blackAndWhite' ? 'Black & White' : 'Color'}
              </span>
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
          onClick={handlePayment}
          disabled={isLoading || !state.totalPrice || !isRazorpayLoaded}
          className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <IndianRupeeIcon className="mr-2 h-4 w-4" />
              Pay Now
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default PaymentDetails;
