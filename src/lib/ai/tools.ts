// ══════════════════════════════════════════════════════════
// Tool Definitions for Groq (OpenAI-compatible format)
// ══════════════════════════════════════════════════════════
export const TOOL_DEFINITIONS = [
  {
    type: "function" as const,
    function: {
      name: "search_products",
      description:
        "Search for products in the store catalog. Use this whenever the customer wants to browse, find, or discover products. Can filter by search term, category, or price range.",
      parameters: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description:
              "Search term — product name, style, color, or keyword (e.g. 'sherwani', 'red dress', 'kashmiri')",
          },
          category: {
            type: "string",
            description:
              "Filter by category slug. Options: women, men, footwear, watches, jewelry, bags, sale, new-arrivals",
          },
          max_price: {
            type: "number",
            description: "Maximum price in PKR (e.g. 30000)",
          },
          min_price: {
            type: "number",
            description: "Minimum price in PKR",
          },
          limit: {
            type: "number",
            description: "Max results to return (default 5)",
          },
        },
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "get_product_details",
      description:
        "Get full details of a specific product by its slug. Use when customer asks about a specific product's features, price, description, or availability.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description:
              "The product's URL slug (e.g. 'ivory-sherwani', 'gold-sequin-clutch')",
          },
        },
        required: ["slug"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "check_stock",
      description:
        "Check if a product is currently available in stock. Use when customer asks about availability.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "The product's URL slug",
          },
        },
        required: ["slug"],
      },
    },
  },
  {
    type: "function" as const,
    function: {
      name: "recommend_similar",
      description:
        "Find products similar to a given product (same category, similar price). Use when customer likes one product and wants to see alternatives.",
      parameters: {
        type: "object",
        properties: {
          slug: {
            type: "string",
            description: "The reference product's slug",
          },
          limit: {
            type: "number",
            description: "Number of recommendations (default 3)",
          },
        },
        required: ["slug"],
      },
    },
  },
];