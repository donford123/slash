import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertSnippetSchema, insertCategorySchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Categories routes
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  app.get("/api/categories/:slug", async (req, res) => {
    const { slug } = req.params;
    const category = await storage.getCategoryBySlug(slug);
    
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    const snippets = await storage.getSnippetsByCategory(category.id);
    res.json({ category, snippets });
  });

  app.post("/api/categories", async (req, res) => {
    try {
      const categoryData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid category data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  // Snippets routes
  app.get("/api/snippets", async (req, res) => {
    const { search } = req.query;
    
    if (search && typeof search === "string") {
      const snippets = await storage.searchSnippets(search);
      return res.json(snippets);
    }
    
    const snippets = await storage.getAllSnippets();
    res.json(snippets);
  });

  app.get("/api/snippets/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid snippet ID" });
    }
    
    const snippet = await storage.getSnippetById(id);
    
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    
    // Increment view count
    await storage.updateSnippetViewCount(id);
    
    res.json(snippet);
  });

  app.post("/api/snippets", async (req, res) => {
    try {
      const snippetData = insertSnippetSchema.parse(req.body);
      const snippet = await storage.createSnippet(snippetData);
      res.status(201).json(snippet);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid snippet data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create snippet" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
