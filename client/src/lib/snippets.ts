import { Snippet } from "@shared/schema";
import { apiRequest } from "./queryClient";

// Get all snippets
export async function getAllSnippets(): Promise<Snippet[]> {
  const res = await apiRequest("GET", "/api/snippets");
  return res.json();
}

// Get snippet by ID
export async function getSnippetById(id: number): Promise<Snippet> {
  const res = await apiRequest("GET", `/api/snippets/${id}`);
  return res.json();
}

// Get snippets by category
export async function getSnippetsByCategory(categoryId: number): Promise<Snippet[]> {
  const res = await apiRequest("GET", `/api/categories/${categoryId}`);
  const data = await res.json();
  return data.snippets;
}

// Search snippets
export async function searchSnippets(query: string): Promise<Snippet[]> {
  const res = await apiRequest("GET", `/api/snippets?search=${encodeURIComponent(query)}`);
  return res.json();
}

// Create a new snippet
export async function createSnippet(snippet: Omit<Snippet, "id" | "updatedAt" | "viewCount">): Promise<Snippet> {
  const res = await apiRequest("POST", "/api/snippets", snippet);
  return res.json();
}
