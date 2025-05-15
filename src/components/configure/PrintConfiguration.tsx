
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { PrinterIcon, XIcon, FileIcon } from 'lucide-react';
import { toast } from 'sonner';

const PrintConfiguration = () => {
  const { state, setPrintSettings, calculatePrice } = useApp();
  const navigate = useNavigate();
  
  // Redirect if no document is uploaded
  if (!state.document) {
    navigate('/upload');
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculatePrice();
    navigate('/payment');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} bytes`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl">Print Configuration</span>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/upload')}
            title="Upload a different document"
          >
            <XIcon size={18} />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6 p-4 bg-muted/50 rounded-lg flex items-center space-x-4">
          <div className="bg-brand-100 p-2 rounded">
            <FileIcon className="text-brand-600" size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-medium truncate" title={state.document.name}>
              {state.document.name}
            </h3>
            <p className="text-sm text-muted-foreground">
              {state.document.pageCount} pages • {formatFileSize(state.document.size)}
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            {/* Color Mode */}
            <div className="space-y-2">
              <h3 className="font-medium">Color Mode</h3>
              <RadioGroup 
                defaultValue={state.printSettings.colorMode}
                onValueChange={(value: 'color' | 'blackAndWhite') => 
                  setPrintSettings({ colorMode: value })
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blackAndWhite" id="bw" />
                  <Label htmlFor="bw">Black & White</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="color" id="color" />
                  <Label htmlFor="color">Color</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Orientation */}
            <div className="space-y-2">
              <h3 className="font-medium">Orientation</h3>
              <RadioGroup 
                defaultValue={state.printSettings.orientation}
                onValueChange={(value: 'portrait' | 'landscape') => 
                  setPrintSettings({ orientation: value })
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="portrait" id="portrait" />
                  <Label htmlFor="portrait">Portrait</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="landscape" id="landscape" />
                  <Label htmlFor="landscape">Landscape</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Page Size */}
            <div className="space-y-2">
              <h3 className="font-medium">Page Size</h3>
              <RadioGroup 
                defaultValue={state.printSettings.pageSize}
                onValueChange={(value: 'a4' | 'letter' | 'legal') => 
                  setPrintSettings({ pageSize: value })
                }
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="a4" id="a4" />
                  <Label htmlFor="a4">A4</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="letter" id="letter" />
                  <Label htmlFor="letter">Letter</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="legal" id="legal" />
                  <Label htmlFor="legal">Legal</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Double Sided */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Double-sided Printing</h3>
                <p className="text-sm text-muted-foreground">Save paper with double-sided printing</p>
              </div>
              <Switch 
                checked={state.printSettings.doubleSided}
                onCheckedChange={(checked) => setPrintSettings({ doubleSided: checked })}
              />
            </div>

            {/* Copies */}
            <div className="space-y-2">
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
                >
                  -
                </Button>
                <span className="w-8 text-center">{state.printSettings.copies}</span>
                <Button 
                  type="button"
                  variant="outline" 
                  size="icon"
                  onClick={() => setPrintSettings({ copies: state.printSettings.copies + 1 })}
                >
                  +
                </Button>
              </div>
            </div>
          </div>
          
          <CardFooter className="px-0 pt-6 mt-6 border-t flex justify-end">
            <Button 
              type="submit" 
              className="bg-brand-600 hover:bg-brand-700 text-white flex items-center gap-2"
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
