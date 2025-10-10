
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { PrinterIcon, XIcon, FileIcon, InfoIcon, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const PrintConfiguration = () => {
  const { 
    state, 
    setPrintSettings, 
    calculatePrice,
    fetchMerchants,
    setSelectedMerchant 
  } = useApp();
  const navigate = useNavigate();

  // Fetch merchants when component mounts
  useEffect(() => {
    const loadMerchants = async () => {
      try {
        await fetchMerchants();
      } catch (error) {
        console.error('Failed to load merchants:', error);
      }
    };

    loadMerchants();
  }, [fetchMerchants]);
  
  // Redirect if no documents are uploaded
  useEffect(() => {
    if (state.documents.length === 0) {
      navigate('/upload');
    }
  }, [state.documents, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculatePrice();
    
    // Check if user is authenticated before proceeding to payment
    if (!state.isAuthenticated) {
      toast.info('Please login or create an account to continue', {
        description: 'Authentication is required for payment processing',
        action: {
          label: 'Login',
          onClick: () => navigate('/login'),
        },
      });
      return;
    }
    
    // Check if a merchant is selected
    if (!state.selectedMerchant?.id) {
      toast.error('Please select a merchant before proceeding to payment');
      return;
    }
    
    // Proceed to payment with the selected merchant ID
    console.log('Proceeding to payment with merchant ID:', state.selectedMerchant.id);
    navigate('/payment');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Calculate total pages across all documents
  const totalPages = state.documents.reduce((sum, doc) => sum + doc.pageCount, 0);
  const totalSize = state.documents.reduce((sum, doc) => sum + doc.size, 0);

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Print Configuration</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/upload')}
            title="Upload different documents"
          >
            <XIcon size={18} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-medium mb-3">Documents to Print ({state.documents.length})</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {state.documents.map((doc, index) => (
              <div key={index} className="flex items-center space-x-4 p-2 bg-white rounded-md shadow-sm">
                <div className="bg-brand-100 p-2 rounded">
                  <FileIcon className="text-brand-600" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate" title={doc.name}>
                    {doc.name}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {doc.pageCount} pages • {formatFileSize(doc.size)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 pt-3 border-t flex items-center justify-between">
            <span className="text-sm font-medium">Total</span>
            <span className="text-sm">
              {totalPages} pages • {formatFileSize(totalSize)}
            </span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-8">
            {/* Merchant Selection */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Select Merchant</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">Select the merchant where you want to print your documents</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              {state.isLoadingMerchants ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="h-5 w-5 animate-spin text-brand-500" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading merchants...</span>
                </div>
              ) : state.merchants.length > 0 ? (
                <Select
                  value={state.selectedMerchant?.id || ''}
                  onValueChange={(value) => {
                    const merchant = state.merchants.find(m => m?.id === value) || null;
                    setSelectedMerchant(merchant);
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a merchant" />
                  </SelectTrigger>
                  <SelectContent>
                    {state.merchants.map((merchant) => (
                      merchant && (
                        <SelectItem key={merchant.id} value={merchant.id}>
                          <div className="flex flex-col">
                            <span className="font-medium">{merchant.businessName}</span>
                            <span className="text-xs text-muted-foreground">{merchant.address}</span>
                          </div>
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-sm text-muted-foreground p-2 bg-muted/50 rounded">
                  No merchants available. Please contact support.
                </div>
              )}
            </div>
            {/* Color Mode */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Color Mode</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">Currently only Black & White printing is available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ToggleGroup 
                type="single" 
                value="blackAndWhite"
                onValueChange={() => {}}
                className="grid grid-cols-2 gap-2 w-full"
              >
                <ToggleGroupItem 
                  value="blackAndWhite" 
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Black & White
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="color" 
                  disabled
                  className="opacity-50 cursor-not-allowed data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Color
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Orientation */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Orientation</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">Currently only Portrait orientation is available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ToggleGroup 
                type="single" 
                value="portrait"
                onValueChange={() => {}}
                className="grid grid-cols-2 gap-2 w-full"
              >
                <ToggleGroupItem 
                  value="portrait" 
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Portrait
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="landscape" 
                  disabled
                  className="opacity-50 cursor-not-allowed data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Landscape
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Page Size */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-medium">Page Size</h3>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <InfoIcon size={16} className="text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-[200px] text-sm">Currently only A4 page size is available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <ToggleGroup 
                type="single" 
                value="a4"
                onValueChange={() => {}}
                className="grid grid-cols-3 gap-2 w-full"
              >
                <ToggleGroupItem 
                  value="a4" 
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  A4
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="letter" 
                  disabled
                  className="opacity-50 cursor-not-allowed data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Letter
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="legal" 
                  disabled
                  className="opacity-50 cursor-not-allowed data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Legal
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Double Sided */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Double-sided Printing</h3>
                <p className="text-sm text-muted-foreground">Save paper with double-sided printing</p>
              </div>
              <Switch 
                checked={false}
                disabled={true}
                className="opacity-50 cursor-not-allowed"
              />
            </div>

            {/* Copies */}
            <div className="space-y-3">
              <h3 className="font-medium">Number of Copies</h3>
              <div className="flex items-center space-x-3">
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (state.printSettings.copies > 1) {
                      setPrintSettings({ copies: state.printSettings.copies - 1 });
                    }
                  }}
                  disabled={state.printSettings.copies <= 1}
                  className="hover:bg-brand-50 transition-colors"
                >
                  -
                </Button>
                <span className="w-8 text-center font-medium">{state.printSettings.copies}</span>
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={() => {
                    if (state.printSettings.copies < 10) {
                      setPrintSettings({ copies: state.printSettings.copies + 1 });
                    } else {
                      toast.info("Maximum 10 copies allowed");
                    }
                  }}
                  disabled={state.printSettings.copies >= 10}
                  className="hover:bg-brand-50 transition-colors"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          <CardFooter className="px-0 pt-6 mt-6 border-t flex justify-end">
            <Button 
              type="submit" 
              className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2 transition-colors"
            >
              <PrinterIcon size={18} />
              Continue to Payment
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
};

export default PrintConfiguration;
