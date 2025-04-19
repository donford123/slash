import { Snippet } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";

interface SnippetHeaderProps {
  snippet: Snippet;
}

export default function SnippetHeader({ snippet }: SnippetHeaderProps) {
  const formattedDate = snippet.updatedAt ? 
    formatDistanceToNow(new Date(snippet.updatedAt), { addSuffix: true }) : 
    "recently";

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold mb-2">{snippet.title}</h1>
      <p className="text-muted-foreground mb-3">
        {snippet.description}
      </p>
      <div className="flex flex-wrap gap-2 mb-4">
        {snippet.tags && snippet.tags.map((tag, index) => (
          <Badge key={index} variant="secondary">{tag}</Badge>
        ))}
      </div>
      <div className="text-sm text-muted-foreground flex items-center">
        <span>Compatible with: {snippet.compatibility}</span>
        <span className="mx-2">•</span>
        <span>Last updated: {formattedDate}</span>
      </div>
    </div>
  );
}
