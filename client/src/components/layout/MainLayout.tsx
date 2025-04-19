import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import { Search } from "@/components/ui/search";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Code } from "lucide-react";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border sticky top-0 bg-background z-10">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link href="/">
            <div className="flex items-center gap-3 cursor-pointer">
              <Code className="w-8 h-8 text-primary" />
              <h1 className="text-xl font-semibold">Shopify Snippet Hub</h1>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Search placeholder="Search snippets..." className="w-64 hidden md:flex" />
            <Button>Submit Snippet</Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-screen-2xl mx-auto w-full flex">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </main>
    </div>
  );
}
