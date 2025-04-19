import { 
  users, type User, type InsertUser,
  categories, type Category, type InsertCategory,
  snippets, type Snippet, type InsertSnippet
} from "@shared/schema";
import { db } from "./db";
import { eq, ilike, or, sql } from "drizzle-orm";
import { IStorage } from "./storage";

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // Category methods
  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category || undefined;
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const [category] = await db.insert(categories).values(insertCategory).returning();
    return category;
  }

  // Snippet methods
  async getAllSnippets(): Promise<Snippet[]> {
    return db.select().from(snippets);
  }

  async getSnippetById(id: number): Promise<Snippet | undefined> {
    const [snippet] = await db.select().from(snippets).where(eq(snippets.id, id));
    
    if (snippet) {
      await this.updateSnippetViewCount(id);
    }
    
    return snippet || undefined;
  }

  async getSnippetsByCategory(categoryId: number): Promise<Snippet[]> {
    return db.select().from(snippets).where(eq(snippets.categoryId, categoryId));
  }

  async createSnippet(insertSnippet: InsertSnippet): Promise<Snippet> {
    const [snippet] = await db.insert(snippets).values(insertSnippet).returning();
    return snippet;
  }

  async updateSnippetViewCount(id: number): Promise<Snippet | undefined> {
    const [snippet] = await db
      .update(snippets)
      .set({ viewCount: sql`${snippets.viewCount} + 1` })
      .where(eq(snippets.id, id))
      .returning();
    
    return snippet || undefined;
  }

  async searchSnippets(query: string): Promise<Snippet[]> {
    return db
      .select()
      .from(snippets)
      .where(
        or(
          ilike(snippets.title, `%${query}%`),
          ilike(snippets.description, `%${query}%`)
        )
      );
  }

  // Seed initial data
  async seedInitialData() {
    // Check if categories exist
    const existingCategories = await this.getAllCategories();
    
    if (existingCategories.length === 0) {
      // Create categories
      const categoryData = [
        { name: "Product Pages", slug: "product-pages" },
        { name: "Collections", slug: "collections" },
        { name: "Cart Functionality", slug: "cart-functionality" },
        { name: "Customer Accounts", slug: "customer-accounts" },
        { name: "Checkout Customization", slug: "checkout-customization" },
        { name: "Analytics", slug: "analytics" }
      ];
      
      for (const category of categoryData) {
        await this.createCategory(category);
      }
      
      // Get the newly created categories
      const categories = await this.getAllCategories();
      
      // Create sample snippets
      if (categories.length > 0) {
        const snippetsData = [
          {
            title: "Add to Cart Button Enhancement",
            description: "This snippet enhances your product's \"Add to Cart\" button with animation, stock status, and adds an item to cart without page refresh.",
            html: "<button class=\"add-to-cart-button w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md font-medium transition-colors\">\n  Add to Cart\n</button>",
            css: ".add-to-cart-button {\n  transition: all 0.3s ease;\n}\n\n.add-to-cart-button.is-loading {\n  background-color: #4a90e2;\n  opacity: 0.8;\n}\n\n.add-to-cart-button.is-success {\n  background-color: #34c759;\n}\n\n.add-to-cart-button.is-error {\n  background-color: #ff3b30;\n}\n\n.loading-spinner {\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  border: 2px solid rgba(255,255,255,0.3);\n  border-radius: 50%;\n  border-top-color: white;\n  animation: spin 0.8s linear infinite;\n  margin-right: 0.5rem;\n}\n\n@keyframes spin {\n  to { transform: rotate(360deg); }\n}\n\n.cart-count {\n  position: relative;\n}\n\n.cart-count-updated {\n  animation: pulse 1s;\n}\n\n@keyframes pulse {\n  0% { transform: scale(1); }\n  50% { transform: scale(1.5); }\n  100% { transform: scale(1); }\n}\n\n.quick-cart {\n  position: fixed;\n  top: 80px;\n  right: 20px;\n  width: 320px;\n  max-width: 90vw;\n  background: white;\n  border-radius: 8px;\n  box-shadow: 0 4px 12px rgba(0,0,0,0.15);\n  z-index: 1000;\n  transform: translateY(-20px);\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease;\n}\n\n.quick-cart.is-active {\n  transform: translateY(0);\n  opacity: 1;\n  visibility: visible;\n}\n\n.quick-cart-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  padding: 15px;\n  border-bottom: 1px solid #eee;\n}\n\n.quick-cart-products {\n  max-height: 300px;\n  overflow-y: auto;\n}\n\n.quick-cart-item {\n  display: flex;\n  padding: 10px 15px;\n  border-bottom: 1px solid #eee;\n}\n\n.quick-cart-item img {\n  width: 60px;\n  height: 60px;\n  object-fit: cover;\n  margin-right: 10px;\n}\n\n.quick-cart-footer {\n  padding: 15px;\n  display: flex;\n  justify-content: space-between;\n}\n\n.view-cart-button, .checkout-button {\n  padding: 8px 16px;\n  border-radius: 4px;\n  font-weight: 500;\n  text-align: center;\n  font-size: 14px;\n}\n\n.view-cart-button {\n  border: 1px solid #ddd;\n  color: #333;\n}\n\n.checkout-button {\n  background: #4a90e2;\n  color: white;\n}",
            javascript: "document.addEventListener('DOMContentLoaded', function() {\n  const addToCartButtons = document.querySelectorAll('.add-to-cart-button');\n  \n  addToCartButtons.forEach(button => {\n    button.addEventListener('click', function(event) {\n      event.preventDefault();\n      \n      const form = this.closest('form');\n      const formData = new FormData(form);\n      const productId = this.dataset.productId;\n      const quantity = form.querySelector('[name=\"quantity\"]').value;\n      \n      // Change button state to loading\n      const originalText = this.innerHTML;\n      this.innerHTML = '<span class=\"loading-spinner\"></span> Adding...';\n      this.classList.add('is-loading');\n      this.disabled = true;\n      \n      // Add to cart AJAX request\n      fetch('/cart/add.js', {\n        method: 'POST',\n        body: formData,\n        credentials: 'same-origin',\n        headers: {\n          'X-Requested-With': 'XMLHttpRequest'\n        }\n      })\n      .then(response => response.json())\n      .then(data => {\n        // Success! Update mini cart\n        updateMiniCart();\n        \n        // Change button to success state\n        this.innerHTML = '<svg class=\"check-icon\" viewBox=\"0 0 24 24\"><path d=\"M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z\"></path></svg> Added!';\n        this.classList.remove('is-loading');\n        this.classList.add('is-success');\n        \n        // Show the quick cart view\n        showQuickCart(data);\n        \n        // Reset button after 2 seconds\n        setTimeout(() => {\n          this.innerHTML = originalText;\n          this.classList.remove('is-success');\n          this.disabled = false;\n        }, 2000);\n      })\n      .catch(error => {\n        // Handle error\n        console.error('Error:', error);\n        this.innerHTML = 'Error! Try again';\n        this.classList.remove('is-loading');\n        this.classList.add('is-error');\n        \n        // Reset button after 2 seconds\n        setTimeout(() => {\n          this.innerHTML = originalText;\n          this.classList.remove('is-error');\n          this.disabled = false;\n        }, 2000);\n      });\n    });\n  });\n  \n  // Function to update mini cart\n  function updateMiniCart() {\n    fetch('/cart.js')\n      .then(response => response.json())\n      .then(cart => {\n        const cartCountElements = document.querySelectorAll('.cart-count');\n        cartCountElements.forEach(element => {\n          element.textContent = cart.item_count;\n          \n          // Add animation\n          element.classList.add('cart-count-updated');\n          setTimeout(() => {\n            element.classList.remove('cart-count-updated');\n          }, 1000);\n        });\n      });\n  }\n  \n  // Function to show quick cart\n  function showQuickCart(product) {\n    // Create or show your quick cart view\n    const quickCart = document.querySelector('.quick-cart') || createQuickCart();\n    \n    // Add product to quick cart view\n    const productHTML = `\n      <div class=\"quick-cart-item\" data-product-id=\"${product.id}\">\n        <img src=\"${product.image || ''}\" alt=\"${product.product_title}\" width=\"60\" height=\"60\">\n        <div class=\"quick-cart-item-details\">\n          <p class=\"quick-cart-item-title\">${product.product_title}</p>\n          <p class=\"quick-cart-item-price\">${formatMoney(product.price)}</p>\n          <div class=\"quick-cart-item-quantity\">\n            Qty: ${product.quantity}\n          </div>\n        </div>\n      </div>\n    `;\n    \n    const productsContainer = quickCart.querySelector('.quick-cart-products');\n    productsContainer.insertAdjacentHTML('afterbegin', productHTML);\n    \n    // Show quick cart\n    quickCart.classList.add('is-active');\n    \n    // Auto-hide after 5 seconds\n    setTimeout(() => {\n      quickCart.classList.remove('is-active');\n    }, 5000);\n  }\n  \n  // Create quick cart if it doesn't exist\n  function createQuickCart() {\n    const quickCartHTML = `\n      <div class=\"quick-cart\">\n        <div class=\"quick-cart-header\">\n          <h3>Added to Cart</h3>\n          <button class=\"quick-cart-close\">×</button>\n        </div>\n        <div class=\"quick-cart-products\"></div>\n        <div class=\"quick-cart-footer\">\n          <a href=\"/cart\" class=\"view-cart-button\">View Cart</a>\n          <a href=\"/checkout\" class=\"checkout-button\">Checkout</a>\n        </div>\n      </div>\n    `;\n    \n    document.body.insertAdjacentHTML('beforeend', quickCartHTML);\n    \n    const quickCart = document.querySelector('.quick-cart');\n    const closeButton = quickCart.querySelector('.quick-cart-close');\n    \n    closeButton.addEventListener('click', () => {\n      quickCart.classList.remove('is-active');\n    });\n    \n    return quickCart;\n  }\n  \n  // Helper function to format money\n  function formatMoney(cents) {\n    return '$' + (cents / 100).toFixed(2);\n  }\n});",
            installation: "<p>To install this Add to Cart Button Enhancement, follow these steps:</p><ol><li>Add the JavaScript code to your theme.js file or as a separate JavaScript file that you include in your theme.</li><li>Add the CSS to your theme's stylesheet.</li><li>Replace your current Add to Cart button with the HTML template provided.</li><li>Make sure you have a cart count element with the class <code>cart-count</code> in your header or navigation.</li></ol>",
            howItWorks: "<p>This snippet works by:</p><ul><li>Intercepting the form submission when a user clicks the Add to Cart button</li><li>Displaying a loading state with a spinning animation</li><li>Using the Fetch API to submit the form data asynchronously to Shopify's cart API</li><li>Showing success or error states with visual feedback</li><li>Updating the cart count with an animation to draw attention to the change</li><li>Automatically resetting the button state after a brief delay</li></ul><p>The snippet creates a smoother shopping experience by providing immediate feedback to users without requiring a page refresh.</p>",
            categoryId: categories[0].id,
            tags: ["Product Page", "Add to Cart", "Animation", "UX"],
            compatibility: "Shopify 2.0+"
          },
          {
            title: "Image Zoom on Hover",
            description: "Add a smooth image zoom effect when hovering over product images for a better product browsing experience.",
            categoryId: categories[0].id,
            compatibility: "All versions",
            javascript: "document.addEventListener('DOMContentLoaded', function() {\n  const zoomContainers = document.querySelectorAll('.zoom-container');\n  \n  zoomContainers.forEach(container => {\n    const image = container.querySelector('.zoom-image');\n    const zoomFactor = container.dataset.zoomFactor || 1.5;\n    \n    container.addEventListener('mouseenter', function() {\n      image.style.transform = 'scale(' + zoomFactor + ')';\n    });\n    \n    container.addEventListener('mouseleave', function() {\n      image.style.transform = 'scale(1)';\n    });\n    \n    container.addEventListener('mousemove', function(e) {\n      const rect = container.getBoundingClientRect();\n      const x = (e.clientX - rect.left) / rect.width;\n      const y = (e.clientY - rect.top) / rect.height;\n      \n      image.style.transformOrigin = (x * 100) + '% ' + (y * 100) + '%';\n    });\n  });\n});",
            css: ".zoom-container {\n  position: relative;\n  overflow: hidden;\n  cursor: zoom-in;\n  width: 100%;\n  height: auto;\n  display: block;\n}\n\n.zoom-image {\n  width: 100%;\n  height: auto;\n  display: block;\n  transition: transform 0.3s ease;\n}\n\n/* Optional: Add a subtle border and shadow for better visual definition */\n.zoom-container {\n  border: 1px solid #e5e5e5;\n  border-radius: 4px;\n}\n\n.zoom-container:hover {\n  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);\n}\n\n/* For responsive design */\n@media (max-width: 768px) {\n  .zoom-container {\n    cursor: default; /* Disable on mobile */\n  }\n  \n  .zoom-container:hover .zoom-image {\n    transform: scale(1) !important; /* Prevent zoom on mobile/touch devices */\n  }\n}",
            html: "<!-- Basic implementation -->\n<div class=\"zoom-container\" data-zoom-factor=\"1.5\">\n  <img src=\"{{ product.featured_image | img_url: 'large' }}\" alt=\"{{ product.featured_image.alt }}\" class=\"zoom-image\">\n</div>\n\n<!-- For multiple product images -->\n<div class=\"product-gallery\">\n  {% for image in product.images %}\n    <div class=\"zoom-container\" data-zoom-factor=\"1.5\">\n      <img src=\"{{ image | img_url: 'large' }}\" alt=\"{{ image.alt }}\" class=\"zoom-image\">\n    </div>\n  {% endfor %}\n</div>",
            installation: "<p>To add the Image Zoom on Hover effect to your Shopify store:</p><ol><li>Add the JavaScript code to your theme.js file or as a separate JavaScript file included in your theme.</li><li>Add the CSS to your theme's stylesheet.</li><li>Update your product template by wrapping product images in the <code>zoom-container</code> div as shown in the HTML example.</li><li>Customize the zoom factor using the <code>data-zoom-factor</code> attribute (default is 1.5).</li></ol>",
            howItWorks: "<p>The image zoom functionality works using these principles:</p><ul><li>The script identifies all elements with the <code>zoom-container</code> class.</li><li>When a user hovers over an image, CSS transforms scale the image by the specified zoom factor.</li><li>As the user moves their cursor over the image, the script calculates the cursor position relative to the container.</li><li>The transform-origin property is dynamically updated to keep the area under the cursor as the focal point of the zoom.</li><li>When the user moves their cursor away, the image smoothly returns to its original size.</li><li>The effect is automatically disabled on mobile devices to prevent issues with touch interfaces.</li></ul>",
            tags: ["Product Images", "Zoom", "Product Page", "UX Enhancement"]
          }
        ];
        
        for (const snippet of snippetsData) {
          await this.createSnippet(snippet);
        }
      }
    }
  }
}