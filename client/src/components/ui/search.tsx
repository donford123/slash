import { ChangeEvent, useState } from "react";
import { useLocation } from "wouter";
import { Input, InputProps } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

export interface SearchProps extends InputProps {
  className?: string;
}

export function Search({ className, ...props }: SearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [_, navigate] = useLocation();

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search snippets..."
        className={`pl-10 ${className}`}
        value={searchQuery}
        onChange={handleSearch}
        onKeyDown={handleKeyDown}
        {...props}
      />
    </div>
  );
}
