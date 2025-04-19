import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Maximize, RefreshCw, Eye } from "lucide-react";
import { Snippet } from "@shared/schema";

interface PreviewPaneProps {
  snippet: Snippet;
}

export default function PreviewPane({ snippet }: PreviewPaneProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [loading, setLoading] = useState(false);

  // Function to refresh the preview
  const refreshPreview = () => {
    setLoading(true);
    setTimeout(() => {
      renderPreview();
      setLoading(false);
    }, 500);
  };

  // Function to render HTML, CSS, and JavaScript in the iframe
  const renderPreview = () => {
    if (!iframeRef.current) return;

    const html = snippet.html || "";
    const css = snippet.css || "";
    const javascript = snippet.javascript || "";

    // Create a complete HTML document with the snippet's code
    const previewContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            /* Reset and basic styles */
            * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
            }
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              color: #333;
              line-height: 1.5;
              padding: 1rem;
              background-color: #fff;
            }
            /* Custom CSS from snippet */
            ${css}
          </style>
        </head>
        <body>
          <!-- HTML content from snippet -->
          ${html}
          
          <!-- JavaScript from snippet -->
          <script>
            ${javascript}
          </script>
        </body>
      </html>
    `;

    // Get the iframe document and write the content
    const iframeDoc = iframeRef.current.contentDocument || 
                    (iframeRef.current.contentWindow && iframeRef.current.contentWindow.document);

    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(previewContent);
      iframeDoc.close();
    }
  };

  // Render the preview when the component mounts or when the snippet changes
  useEffect(() => {
    renderPreview();
  }, [snippet.html, snippet.css, snippet.javascript]);

  return (
    <div className="border border-border rounded-md overflow-hidden h-[600px] flex flex-col">
      <div className="bg-muted border-b border-border px-4 py-2 flex justify-between items-center">
        <span className="font-medium text-sm">Live Preview</span>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-muted-foreground h-8 w-8"
            onClick={refreshPreview}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button variant="ghost" size="icon" className="text-muted-foreground h-8 w-8">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white relative">
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
            <div className="flex flex-col items-center">
              <RefreshCw className="animate-spin h-8 w-8 text-primary mb-2" />
              <span className="text-sm text-muted-foreground">Refreshing preview...</span>
            </div>
          </div>
        )}
        
        {/* Sandbox iframe for rendering the code */}
        <iframe
          ref={iframeRef}
          title="Snippet Preview"
          className="w-full h-full border-none"
          sandbox="allow-scripts allow-same-origin"
        />
      </div>
    </div>
  );
}
