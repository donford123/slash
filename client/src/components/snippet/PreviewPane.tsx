import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, Eye } from "lucide-react";
import { Snippet } from "@shared/schema";

interface PreviewPaneProps {
  snippet: Snippet;
}

export default function PreviewPane({ snippet }: PreviewPaneProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Function to simulate Add to Cart button click
  const handleAddToCart = () => {
    setIsLoading(true);
    
    // Simulate the loading state
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };
  
  return (
    <div className="border border-border rounded-md overflow-hidden h-[600px] flex flex-col">
      <div className="bg-muted border-b border-border px-4 py-2 flex justify-between items-center">
        <span className="font-medium text-sm">Preview</span>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
            <Maximize className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto bg-background p-4">
        {/* Mock product preview */}
        <div className="mx-auto max-w-md bg-background rounded-lg shadow-sm border border-border p-6">
          <div className="mb-4">
            <img 
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80" 
              alt="Product Image" 
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-bold">Premium Tote Bag</h2>
            <div className="flex items-center mt-1 mb-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
                <span className="ml-1 text-sm text-muted-foreground">(42 reviews)</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-2 text-sm">
              High-quality canvas tote bag perfect for everyday use. Spacious interior with inner pocket.
            </p>
            <div className="flex items-baseline mb-4">
              <span className="text-xl font-bold">$39.99</span>
              <span className="ml-2 text-sm line-through text-muted-foreground">$49.99</span>
              <span className="ml-2 text-sm text-green-600">20% Off</span>
            </div>
            
            <div className="flex items-center mb-4">
              <span className="mr-2 text-sm font-medium">Color:</span>
              <div className="flex space-x-1">
                <button className="w-6 h-6 bg-black rounded-full border-2 border-white shadow-sm"></button>
                <button className="w-6 h-6 bg-blue-600 rounded-full"></button>
                <button className="w-6 h-6 bg-red-500 rounded-full"></button>
                <button className="w-6 h-6 bg-green-500 rounded-full"></button>
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantity</label>
              <div className="flex items-center">
                <button className="w-8 h-8 flex items-center justify-center border border-border rounded-l-md bg-muted text-muted-foreground">
                  -
                </button>
                <input 
                  type="number" 
                  name="quantity" 
                  id="quantity" 
                  min="1" 
                  value="1" 
                  className="w-12 h-8 border-t border-b border-border text-center text-sm"
                  readOnly
                />
                <button className="w-8 h-8 flex items-center justify-center border border-border rounded-r-md bg-muted text-muted-foreground">
                  +
                </button>
              </div>
            </div>
            
            <span className="text-sm text-green-600 font-medium flex items-center mb-4">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
              </svg>
              In stock - 12 units left
            </span>
            
            <div>
              <button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 px-4 rounded-md font-medium transition-colors"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  'Add to Cart'
                )}
              </button>
            </div>
          </div>
        </div>
        
        {/* Quick Cart Preview (will appear after adding to cart) */}
        <div className="mt-8 mx-auto max-w-md bg-background rounded-lg shadow-md border border-border p-4 transition-all transform">
          <div className="flex justify-between items-center pb-3 border-b border-border mb-3">
            <h3 className="font-medium">Added to Cart</h3>
            <button className="text-muted-foreground hover:text-foreground text-lg leading-none">&times;</button>
          </div>
          <div>
            <div className="flex py-3">
              <img 
                src="https://images.unsplash.com/photo-1541643600914-78b084683601?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=800&q=80" 
                alt="Premium Tote Bag" 
                className="w-16 h-16 object-cover rounded mr-3"
              />
              <div className="flex-1">
                <p className="font-medium">Premium Tote Bag</p>
                <p className="text-sm text-muted-foreground">Black</p>
                <div className="flex justify-between mt-1">
                  <span className="text-sm">Qty: 1</span>
                  <span className="font-medium">$39.99</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex mt-3 pt-3 border-t border-border">
            <Button variant="outline" className="flex-1 mr-2">
              View Cart
            </Button>
            <Button className="flex-1">
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
