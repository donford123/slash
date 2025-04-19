import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Copy, File } from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { useToast } from "@/hooks/use-toast";

interface CodePaneProps {
  html?: string;
  css?: string;
  javascript?: string;
}

type CodeTab = "javascript" | "css" | "html";

export default function CodePane({ html, css, javascript }: CodePaneProps) {
  const [activeTab, setActiveTab] = useState<CodeTab>("javascript");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const getActiveCode = () => {
    switch (activeTab) {
      case "javascript":
        return javascript || "";
      case "css":
        return css || "";
      case "html":
        return html || "";
      default:
        return "";
    }
  };

  const handleCopy = async () => {
    const code = getActiveCode();
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Code has been copied to your clipboard",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="border border-border rounded-md overflow-hidden h-[600px] flex flex-col">
      <div className="bg-muted border-b border-border px-4 py-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {/* File tabs */}
          <Button
            variant={activeTab === "javascript" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("javascript")}
            className={activeTab === "javascript" ? "bg-background shadow-sm border border-border" : ""}
          >
            <File className="w-3 h-3 mr-1" />
            JavaScript
          </Button>
          <Button
            variant={activeTab === "css" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("css")}
            className={activeTab === "css" ? "bg-background shadow-sm border border-border" : ""}
          >
            <File className="w-3 h-3 mr-1" />
            CSS
          </Button>
          <Button
            variant={activeTab === "html" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("html")}
            className={activeTab === "html" ? "bg-background shadow-sm border border-border" : ""}
          >
            <File className="w-3 h-3 mr-1" />
            HTML
          </Button>
        </div>
        {/* Copy button */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleCopy}
          className="text-muted-foreground"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 mr-1 text-green-500" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto code-block bg-accent">
        {getActiveCode() ? (
          <CodeBlock language={activeTab} code={getActiveCode()} />
        ) : (
          <div className="p-4 text-muted-foreground">
            No {activeTab} code available for this snippet
          </div>
        )}
      </div>
    </div>
  );
}
