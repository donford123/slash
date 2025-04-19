import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  snippets, type Snippet, type InsertSnippet
} from "@shared/schema";
import { DatabaseStorage } from "./database-storage";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Category methods
  getAllCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Snippet methods
  getAllSnippets(): Promise<Snippet[]>;
  getSnippetById(id: number): Promise<Snippet | undefined>;
  getSnippetsByCategory(categoryId: number): Promise<Snippet[]>;
  createSnippet(snippet: InsertSnippet): Promise<Snippet>;
  updateSnippetViewCount(id: number): Promise<Snippet | undefined>;
  searchSnippets(query: string): Promise<Snippet[]>;
}

// Create a new instance of DatabaseStorage
const dbStorage = new DatabaseStorage();

// Seed the database with initial data if needed
dbStorage.seedInitialData()
  .then(() => console.log('Database initialized successfully'))
  .catch(err => console.error('Error initializing database:', err));

// Export the database storage for use in routes
export const storage = dbStorage;