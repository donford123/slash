import { Snippet } from "@shared/schema";

interface SnippetDetailsProps {
  snippet: Snippet;
}

export default function SnippetDetails({ snippet }: SnippetDetailsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-3">Installation Instructions</h2>
      <div className="bg-muted rounded-md p-4 mb-6">
        {snippet.installation || ''}
      </div>
      
      <h2 className="text-xl font-bold mb-3">How It Works</h2>
      <div>{snippet.howItWorks || ''}</div>
    </div>
  );
}
