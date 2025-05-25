
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Button } from '@/components/ui/button';
import { PrinterIcon, FileIcon, CreditCardIcon } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileIcon className="h-10 w-10 text-brand-600" />,
      title: 'Easy Document Upload',
      description: 'Upload PDFs quickly and securely from any device.'
    },
    {
      icon: <PrinterIcon className="h-10 w-10 text-brand-600" />,
      title: 'Customizable Print Settings',
      description: 'Choose from a variety of print options to fit your needs.'
    },
    {
      icon: <CreditCardIcon className="h-10 w-10 text-brand-600" />,
      title: 'Simple Payment Process',
      description: 'Pay seamlessly with our secure QR code payment system.'
    }
  ];

  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="w-full max-w-6xl">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent">
            Print Documents Easily & Affordably
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Upload your document, customize your print settings, and pay with a quick scan.
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            size="lg"
            className="bg-brand-600 hover:bg-brand-700 text-white px-8"
          >
            Start Printing
          </Button>
        </div>

        {/* How It Works */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-brand-50 rounded-lg p-6 h-full">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <span className="font-bold text-brand-600">1</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Upload Your Document</h3>
                <p className="text-muted-foreground">
                  Select and upload your PDF document in just seconds.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM0 6.75L39 6.75V5.25L0 5.25L0 6.75Z" fill="#4338E4" fillOpacity="0.3" />
                </svg>
              </div>
            </div>
            <div className="relative">
              <div className="bg-brand-50 rounded-lg p-6 h-full">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <span className="font-bold text-brand-600">2</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Configure Print Settings</h3>
                <p className="text-muted-foreground">
                  Choose color mode, orientation, and other print options.
                </p>
              </div>
              <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
                <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M39.5303 6.53033C39.8232 6.23744 39.8232 5.76256 39.5303 5.46967L34.7574 0.696699C34.4645 0.403806 33.9896 0.403806 33.6967 0.696699C33.4038 0.989593 33.4038 1.46447 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM0 6.75L39 6.75V5.25L0 5.25L0 6.75Z" fill="#4338E4" fillOpacity="0.3" />
                </svg>
              </div>
            </div>
            <div>
              <div className="bg-brand-50 rounded-lg p-6 h-full">
                <div className="bg-white w-10 h-10 rounded-full flex items-center justify-center mb-4 shadow-sm">
                  <span className="font-bold text-brand-600">3</span>
                </div>
                <h3 className="font-bold text-lg mb-2">Pay & Pick Up</h3>
                <p className="text-muted-foreground">
                  Scan the QR code to pay and pick up your prints.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16 md:mb-24">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose AutoPrint</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* CTA */}
        <div className="bg-gradient-to-r from-brand-500 to-brand-700 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Print?</h2>
          <p className="mb-6 opacity-90 max-w-xl mx-auto">
            Start printing your documents in minutes with our easy-to-use platform.
          </p>
          <Button 
            onClick={() => navigate('/upload')}
            size="lg"
            variant="secondary"
            className="bg-white text-brand-600 hover:bg-gray-100"
          >
            Upload Document
          </Button>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
