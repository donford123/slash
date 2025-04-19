import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Category } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: recentSnippets = [] } = useQuery({
    queryKey: ["/api/snippets"],
    select: (data) => data.slice(0, 3)
  });

  return (
    <aside className="w-56 border-r border-border p-4 h-[calc(100vh-56px)] overflow-y-auto sticky top-[56px] hidden md:block">
      <div className="mb-6">
        <h2 className="font-medium text-sm text-muted-foreground mb-2">CATEGORIES</h2>
        <div>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant="ghost"
              className={cn(
                "w-full justify-start font-normal px-2 py-1.5 h-auto mb-1",
                location.includes(category.slug) && "bg-accent text-foreground font-medium"
              )}
              asChild
            >
              <Link href={`/category/${category.slug}`}>
                {category.name}
              </Link>
            </Button>
          ))}
        </div>
      </div>
      <div>
        <h2 className="font-medium text-sm text-muted-foreground mb-2">RECENTLY VIEWED</h2>
        <div>
          {recentSnippets.map((snippet) => (
            <Link 
              key={snippet.id} 
              href={`/snippet/${snippet.id}`}
              className="block px-2 py-1.5 rounded-md mb-1 text-muted-foreground hover:bg-accent transition-colors text-sm"
            >
              {snippet.title}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
