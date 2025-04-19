import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Categories schema
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
});

export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// Snippets schema
export const snippets = pgTable("snippets", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  html: text("html"),
  css: text("css"),
  javascript: text("javascript"),
  installation: text("installation"),
  howItWorks: text("how_it_works"),
  categoryId: integer("category_id").notNull(),
  tags: text("tags").array(),
  compatibility: text("compatibility").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  viewCount: integer("view_count").notNull().default(0),
});

export const insertSnippetSchema = createInsertSchema(snippets).pick({
  title: true,
  description: true,
  html: true,
  css: true,
  javascript: true,
  installation: true,
  howItWorks: true,
  categoryId: true,
  tags: true,
  compatibility: true,
});

export type InsertSnippet = z.infer<typeof insertSnippetSchema>;
export type Snippet = typeof snippets.$inferSelect;
