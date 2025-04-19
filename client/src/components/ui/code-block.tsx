import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
}

export function CodeBlock({ code, language = "javascript", className }: CodeBlockProps) {
  const codeRef = useRef<HTMLPreElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && codeRef.current) {
      const highlight = async () => {
        const hljs = (await import("highlight.js")).default;
        await import("highlight.js/styles/github.css");
        
        if (codeRef.current) {
          hljs.highlightElement(codeRef.current);
        }
      };
      
      highlight();
    }
  }, [code, language]);

  return (
    <pre 
      ref={codeRef}
      className={cn(
        "p-4 m-0 text-sm text-gray-800 font-mono overflow-auto whitespace-pre",
        `language-${language}`,
        className
      )}
    >
      <code className={`language-${language}`}>
        {code.trim()}
      </code>
    </pre>
  );
}
