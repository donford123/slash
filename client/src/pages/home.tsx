import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Snippet } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function Home() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const searchQuery = searchParams.get("search") || "";

  const { data: snippets = [], isLoading } = useQuery<Snippet[]>({
    queryKey: ["/api/snippets", searchQuery],
  });

  if (isLoading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (snippets.length === 0) {
    return (
      <div className="p-8 text-center">
        <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h2 className="text-xl font-bold mb-2">No snippets found</h2>
        <p className="text-muted-foreground mb-4">
          {searchQuery
            ? `No results for "${searchQuery}"`
            : "No snippets available yet"}
        </p>
        <Button>Add your first snippet</Button>
      </div>
    );
  }

  return (
    <div className="p-8">
      {searchQuery && (
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">
            Search results for "{searchQuery}"
          </h1>
          <p className="text-muted-foreground">
            Found {snippets.length} snippets matching your search
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {snippets.map((snippet) => (
          <Card key={snippet.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle>{snippet.title}</CardTitle>
              <CardDescription className="line-clamp-2">
                {snippet.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {snippet.tags && snippet.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">{tag}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <span className="text-sm text-muted-foreground">Compatible: {snippet.compatibility}</span>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/snippet/${snippet.id}`}>View Snippet</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
