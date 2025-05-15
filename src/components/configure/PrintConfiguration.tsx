
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useApp } from '@/contexts/AppContext';
import { PrinterIcon, XIcon, FileIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
          <div className="space-y-8">
            {/* Color Mode */}
            <div className="space-y-3">
              <h3 className="font-medium">Color Mode</h3>
              <ToggleGroup 
                type="single" 
                defaultValue={state.printSettings.colorMode}
                onValueChange={(value: 'color' | 'blackAndWhite') => {
                  if (value) setPrintSettings({ colorMode: value });
                }}
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
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Color
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Orientation */}
            <div className="space-y-3">
              <h3 className="font-medium">Orientation</h3>
              <ToggleGroup 
                type="single" 
                defaultValue={state.printSettings.orientation}
                onValueChange={(value: 'portrait' | 'landscape') => {
                  if (value) setPrintSettings({ orientation: value });
                }}
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
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Landscape
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            {/* Page Size */}
            <div className="space-y-3">
              <h3 className="font-medium">Page Size</h3>
              <ToggleGroup 
                type="single" 
                defaultValue={state.printSettings.pageSize}
                onValueChange={(value: 'a4' | 'letter' | 'legal') => {
                  if (value) setPrintSettings({ pageSize: value });
                }}
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
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
                >
                  Letter
                </ToggleGroupItem>
                <ToggleGroupItem 
                  value="legal" 
                  className="data-[state=on]:bg-brand-100 data-[state=on]:border-brand-500 data-[state=on]:text-brand-700 data-[state=off]:bg-muted data-[state=off]:hover:bg-muted/80 transition-all border-2 border-transparent px-4 py-2 rounded-md flex justify-center items-center gap-2"
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
                checked={state.printSettings.doubleSided}
                onCheckedChange={(checked) => setPrintSettings({ doubleSided: checked })}
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
                  onClick={() => setPrintSettings({ copies: state.printSettings.copies + 1 })}
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
