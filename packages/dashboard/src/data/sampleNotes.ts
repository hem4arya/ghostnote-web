// Local sample notes data for dashboard package
import { Note } from "../types/Note";

export const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Getting Started with React Hooks",
    content:
      "Learn the fundamentals of React Hooks including useState, useEffect, and custom hooks. This comprehensive guide covers practical examples and best practices.",
    author: "Sarah Johnson",
    category: "Development",
    tags: ["react", "hooks", "javascript", "frontend"],
    price: 0,
    rating: 4.8,
    views: 12500,
    purchases: 0,
    created_at: "2025-01-10T10:00:00Z",
    is_free: true,
    snippet:
      "Learn the fundamentals of React Hooks including useState, useEffect...",
    previewText:
      "Learn the fundamentals of React Hooks including useState, useEffect...",
  },
  {
    id: "2",
    title: "Advanced TypeScript Patterns",
    content:
      "Deep dive into advanced TypeScript concepts including generics, conditional types, mapped types, and utility types.",
    author: "Mike Chen",
    category: "Development",
    tags: ["typescript", "patterns", "advanced", "programming"],
    price: 29.99,
    rating: 4.9,
    views: 8750,
    purchases: 1250,
    created_at: "2025-01-09T14:30:00Z",
    is_free: false,
    snippet:
      "Deep dive into advanced TypeScript concepts including generics...",
    previewText:
      "Deep dive into advanced TypeScript concepts including generics...",
  },
  {
    id: "3",
    title: "Building Scalable APIs with Node.js",
    content:
      "Complete guide to building production-ready APIs with Node.js, Express, and best practices for scalability.",
    author: "David Rodriguez",
    category: "Backend",
    tags: ["nodejs", "api", "express", "scalability"],
    price: 39.99,
    rating: 4.7,
    views: 9500,
    purchases: 750,
    created_at: "2025-01-08T16:45:00Z",
    is_free: false,
    snippet: "Complete guide to building production-ready APIs with Node.js...",
    previewText:
      "Complete guide to building production-ready APIs with Node.js...",
  },
  {
    id: "4",
    title: "UI/UX Design Principles",
    content:
      "Master the fundamentals of user interface and user experience design with practical examples and case studies.",
    author: "Emma Wilson",
    category: "Design",
    tags: ["ui", "ux", "design", "principles"],
    price: 24.99,
    rating: 4.6,
    views: 7800,
    purchases: 650,
    created_at: "2025-01-07T11:20:00Z",
    is_free: false,
    snippet:
      "Master the fundamentals of user interface and user experience design...",
    previewText:
      "Master the fundamentals of user interface and user experience design...",
  },
];
