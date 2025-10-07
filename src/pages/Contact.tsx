import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

export default function Contact() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = 'Contact Us - AutoPrint';
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button 
        variant="outline" 
        className="mb-6" 
        onClick={() => navigate(-1)}
      >
        ← Back
      </Button>
      
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact us</CardTitle>
          <p className="text-sm text-muted-foreground">
            Last updated on May 25th 2025
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>You may contact us using the information below:</p>
          
          <div className="space-y-2">
            <p><span className="font-medium">Merchant Legal entity name:</span> HARSH TYAGI</p>
            <p><span className="font-medium">Telephone No:</span> +91 9351483787</p>
            <p><span className="font-medium">E-Mail ID:</span> 0212harshtyagi@gmail.com</p>
            <p className="whitespace-pre-line">
              <span className="font-medium">Address:</span> 215 Darpan Greens, Gate-4,
              Mohali, Kharar, Punjab, India - 140301
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
