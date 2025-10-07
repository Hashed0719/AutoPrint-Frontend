
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircleIcon, PrinterIcon } from 'lucide-react';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <Card className="w-full max-w-md shadow-lg text-center">
      <CardHeader>
        <div className="flex justify-center mb-2">
          <CheckCircleIcon size={64} className="text-green-500" />
        </div>
        <CardTitle className="text-2xl">Payment Successful!</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-6">
          Your document has been sent to the printer. It will be ready for pickup soon.
        </p>
        
        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <h3 className="font-medium mb-2">Pickup Information</h3>
          <p className="text-sm mb-1">
            Pickup Location: <span className="font-medium">Main Campus Printing Center</span>
          </p>
          <p className="text-sm">
            Estimated Ready Time: <span className="font-medium">30 minutes</span>
          </p>
        </div>
        
        <p className="text-sm text-muted-foreground">
          A confirmation email has been sent with your order details.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center pt-4">
        <Button 
          onClick={() => navigate('/upload')}
          className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2"
        >
          <PrinterIcon size={16} />
          Print Another Document
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SuccessPage;
