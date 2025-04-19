import { Link, useLocation } from "wouter";
import { Snippet } from "@shared/schema";
import { cn } from "@/lib/utils";

interface SnippetTabsProps {
  snippets: Snippet[];
  activeId?: number;
}

export default function SnippetTabs({ snippets, activeId }: SnippetTabsProps) {
  const [location, setLocation] = useLocation();

  return (
    <div className="border-b border-border px-4 py-2 overflow-x-auto whitespace-nowrap">
      <div className="inline-flex" role="tablist">
        {snippets.map((snippet) => (
          <button
            key={snippet.id}
            role="tab"
            onClick={() => setLocation(`/snippet/${snippet.id}`)}
            className={cn(
              "px-3 py-2 text-sm font-medium border-b-2 mx-1",
              snippet.id === activeId
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            )}
            aria-selected={snippet.id === activeId}
          >
            {snippet.title}
          </button>
        ))}
      </div>
    </div>
  );
}
