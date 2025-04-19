import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "wouter";
import { z } from "zod";
import { insertSnippetSchema, InsertSnippet, Category, Snippet } from "@shared/schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createSnippet } from "@/lib/snippets";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CodePane from "@/components/snippet/CodePane";
import PreviewPane from "@/components/snippet/PreviewPane";

// Extended schema with validation
const createSnippetSchema = insertSnippetSchema.extend({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
  tags: z.array(z.string()).optional(),
  tagInput: z.string().optional(),
});

type FormValues = z.infer<typeof createSnippetSchema>;

// Convert form data to preview snippet
const createPreviewSnippet = (data: FormValues): Snippet => {
  return {
    id: 0,
    title: data.title || "New Snippet",
    description: data.description || "Your snippet description",
    categoryId: data.categoryId || 1,
    compatibility: data.compatibility || "Shopify 2.0+",
    javascript: data.javascript || "",
    css: data.css || "",
    html: data.html || "",
    installation: data.installation || "",
    howItWorks: data.howItWorks || "",
    tags: data.tags || [],
    updatedAt: new Date(),
    viewCount: 0,
  };
};

export default function CreateSnippet() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [tagInput, setTagInput] = useState("");
  
  // Get categories for select dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  // Initialize form with default values
  const form = useForm<FormValues>({
    resolver: zodResolver(createSnippetSchema),
    defaultValues: {
      title: "",
      description: "",
      categoryId: 1, // Default to first category
      compatibility: "Shopify 2.0+",
      javascript: "// JavaScript code for your Shopify snippet\n\ndocument.addEventListener('DOMContentLoaded', function() {\n  // Your code here\n  console.log('Snippet initialized');\n});",
      css: "/* CSS styles for your Shopify snippet */\n\n.custom-button {\n  background-color: #5c6ac4;\n  color: white;\n  padding: 10px 20px;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: all 0.3s ease;\n}\n\n.custom-button:hover {\n  background-color: #4959bd;\n  transform: translateY(-2px);\n}",
      html: "<!-- HTML markup for your Shopify snippet -->\n\n<div class=\"custom-product-container\">\n  <button class=\"custom-button\">Add to Cart</button>\n</div>",
      installation: "<p>To install this snippet, add the code to your theme files:</p><ol><li>Add the JavaScript to theme.js</li><li>Add the CSS to theme.css</li><li>Add the HTML to your product template</li></ol>",
      howItWorks: "<p>This snippet works by:</p><ul><li>Enhancing the Add to Cart button with animations</li><li>Providing visual feedback to users</li><li>Improving the overall user experience</li></ul>",
      tags: [],
      tagInput: "",
    },
  });

  // Create a preview snippet based on form values
  const previewSnippet = createPreviewSnippet(form.watch());

  // Handle add tag
  const handleAddTag = () => {
    if (tagInput.trim() && !form.getValues().tags?.includes(tagInput.trim())) {
      const currentTags = form.getValues().tags || [];
      form.setValue("tags", [...currentTags, tagInput.trim()]);
      setTagInput("");
    }
  };

  // Handle remove tag
  const handleRemoveTag = (tag: string) => {
    const currentTags = form.getValues().tags || [];
    form.setValue("tags", currentTags.filter(t => t !== tag));
  };

  // Handle key press for tag input
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Create snippet mutation
  const createSnippetMutation = useMutation({
    mutationFn: createSnippet,
    onSuccess: (snippet) => {
      toast({
        title: "Snippet created",
        description: "Your snippet has been created successfully",
      });
      navigate(`/snippet/${snippet.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error creating snippet",
        description: "There was an error creating your snippet",
        variant: "destructive",
      });
      console.error("Error creating snippet:", error);
    },
  });

  // Form submission handler
  const onSubmit = (data: FormValues) => {
    // Create a new snippet object without the tagInput field
    const { tagInput, ...snippetData } = data;
    
    // Ensure all required fields are present with appropriate fallbacks
    const formattedData = {
      title: snippetData.title,
      description: snippetData.description,
      categoryId: snippetData.categoryId,
      compatibility: snippetData.compatibility,
      html: snippetData.html || "",
      css: snippetData.css || "",
      javascript: snippetData.javascript || "",
      installation: snippetData.installation || "",
      howItWorks: snippetData.howItWorks || "",
      tags: snippetData.tags || [],
    };
    
    createSnippetMutation.mutate(formattedData as InsertSnippet);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Snippet</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <div>
          <Card className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter snippet title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe what this snippet does" 
                          className="min-h-20"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Category */}
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={(value) => field.onChange(parseInt(value))}
                        defaultValue={field.value.toString()}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category: Category) => (
                            <SelectItem 
                              key={category.id} 
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Compatibility */}
                <FormField
                  control={form.control}
                  name="compatibility"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Compatibility</FormLabel>
                      <Select 
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select compatibility" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Shopify 1.0">Shopify 1.0</SelectItem>
                          <SelectItem value="Shopify 2.0+">Shopify 2.0+</SelectItem>
                          <SelectItem value="All versions">All versions</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Tags */}
                <div className="space-y-2">
                  <FormLabel>Tags</FormLabel>
                  <div className="flex">
                    <Input
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={handleTagKeyPress}
                      className="mr-2"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={handleAddTag}
                    >
                      Add
                    </Button>
                  </div>
                  
                  {/* Display tags */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.watch("tags")?.map((tag, index) => (
                      <div 
                        key={index} 
                        className="bg-muted text-muted-foreground px-3 py-1 rounded-full flex items-center text-sm"
                      >
                        {tag}
                        <button
                          type="button"
                          className="ml-2 text-muted-foreground hover:text-foreground"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* JavaScript Code */}
                <FormField
                  control={form.control}
                  name="javascript"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>JavaScript</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter JavaScript code" 
                          className="font-mono min-h-32"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* CSS Code */}
                <FormField
                  control={form.control}
                  name="css"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CSS</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter CSS code" 
                          className="font-mono min-h-32"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* HTML Code */}
                <FormField
                  control={form.control}
                  name="html"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>HTML</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter HTML code" 
                          className="font-mono min-h-32"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Installation Instructions */}
                <FormField
                  control={form.control}
                  name="installation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Installation Instructions</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide installation instructions (supports HTML)" 
                          className="min-h-20"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* How It Works */}
                <FormField
                  control={form.control}
                  name="howItWorks"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How It Works</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Explain how this snippet works (supports HTML)" 
                          className="min-h-20"
                          value={field.value || ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          ref={field.ref}
                          name={field.name}
                          disabled={field.disabled}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={createSnippetMutation.isPending}
                >
                  {createSnippetMutation.isPending ? "Creating..." : "Create Snippet"}
                </Button>
              </form>
            </Form>
          </Card>
        </div>
        
        {/* Preview Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Live Preview</h2>
          
          {/* Code Preview */}
          <CodePane
            javascript={form.watch("javascript") || ""}
            css={form.watch("css") || ""}
            html={form.watch("html") || ""}
          />
          
          {/* Visual Preview */}
          <PreviewPane snippet={previewSnippet} />
        </div>
      </div>
    </div>
  );
}