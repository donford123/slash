import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Snippet } from "@shared/schema";
import SnippetTabs from "@/components/snippet/SnippetTabs";
import SnippetHeader from "@/components/snippet/SnippetHeader";
import CodePane from "@/components/snippet/CodePane";
import PreviewPane from "@/components/snippet/PreviewPane";
import SnippetDetails from "@/components/snippet/SnippetDetails";

export default function SnippetPage() {
  const { id } = useParams();
  const snippetId = parseInt(id);

  const { data: snippets = [] } = useQuery<Snippet[]>({
    queryKey: ["/api/snippets"],
  });

  const { data: snippet, isLoading } = useQuery<Snippet>({
    queryKey: [`/api/snippets/${snippetId}`],
    enabled: !isNaN(snippetId),
  });

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!snippet) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Snippet not found</h2>
        <p className="text-muted-foreground">
          The snippet you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <>
      <SnippetTabs snippets={snippets} activeId={snippet.id} />
      
      <div className="flex-1 p-4">
        <SnippetHeader snippet={snippet} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <CodePane 
            html={snippet.html} 
            css={snippet.css} 
            javascript={snippet.javascript} 
          />
          
          <PreviewPane snippet={snippet} />
        </div>
        
        <SnippetDetails snippet={snippet} />
      </div>
    </>
  );
}
