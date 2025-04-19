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
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/api/create-payment", async (req, res) => {
  const { amount, currency = "INR" } = req.body;
  
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency,
    });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: "Error creating payment", error });
  }
});

app.post("/api/verify-payment", async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const sign = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSign = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(sign.toString())
    .digest("hex");
    
  if (razorpay_signature === expectedSign) {
    res.json({ verified: true });
  } else {
    res.status(400).json({ verified: false });
  }
});
