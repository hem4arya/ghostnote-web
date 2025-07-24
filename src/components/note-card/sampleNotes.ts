/**
 * Sample Notes Data - Mock/Demo data for the note card system
 * Centralized demo data with realistic note information
 */

import type { Note } from './NoteCard.types';

export const sampleNotes: Note[] = [
  {
    id: 1,
    title: "Advanced React Patterns",
    category: "Development",
    rating: 4.9,
    reviews: 120,
    author: "CodeWizard",
    price: 29.99,
    previewText: "Learn advanced React patterns like Compound Components, Control Props, Custom Hooks, and Render Props. This guide will take your React skills to the next level with practical examples and real-world implementations. Perfect for intermediate to advanced React developers.",
    difficulty: "Advanced",
    readTime: 45,
    tags: ["React", "JavaScript", "Patterns", "Frontend"],
    isPublic: true,
  },
  {
    id: 2,
    title: "AI for Beginners",
    category: "AI/ML",
    rating: 4.8,
    reviews: 250,
    author: "AI-Guru",
    price: 19.99,
    previewText: "An introduction to artificial intelligence and machine learning concepts. This guide covers neural networks, supervised and unsupervised learning, and practical applications of AI in everyday software. No prior experience required, just a passion for learning.",
    difficulty: "Beginner",
    readTime: 30,
    tags: ["AI", "Machine Learning", "Neural Networks", "Beginner"],
    isPublic: false,
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    category: "Design",
    rating: 4.9,
    reviews: 300,
    author: "DesignMaster",
    price: 24.99,
    previewText: "Master the fundamental principles of user interface and user experience design. Learn about color theory, typography, layout grids, usability heuristics, and how to create designs that are both beautiful and functional. Includes case studies and practical exercises.",
    difficulty: "Intermediate",
    readTime: 35,
    tags: ["UI", "UX", "Design", "Typography", "Color Theory"],
    isPublic: true,
  },
  {
    id: 4,
    title: "Cybersecurity Essentials",
    category: "Security",
    rating: 4.7,
    reviews: 150,
    author: "SecureMind",
    price: 39.99,
    previewText: "A comprehensive guide to modern cybersecurity practices. Learn about threat modeling, encryption, secure coding practices, and how to protect systems from common attacks. Essential knowledge for developers and IT professionals in today's digital landscape.",
    difficulty: "Intermediate",
    readTime: 50,
    tags: ["Security", "Encryption", "Cybersecurity", "IT"],
  },
  {
    id: 5,
    title: "Mastering the Coding Interview",
    category: "Interview",
    rating: 4.8,
    reviews: 180,
    author: "InterviewAce",
    price: 34.99,
    previewText: "Comprehensive preparation guide for technical interviews at top tech companies. Covers data structures, algorithms, system design, and behavioral questions. Includes practice problems and solutions with detailed explanations and time complexity analysis.",
    difficulty: "Advanced",
    readTime: 60,
    tags: ["Interview", "Algorithms", "Data Structures", "System Design"],
  },
  {
    id: 6,
    title: "Creative Writing Workshop",
    category: "Writing",
    rating: 4.6,
    reviews: 90,
    author: "WordSmith",
    price: 22.99,
    previewText: "Unleash your creativity with this comprehensive writing workshop. Learn narrative techniques, character development, dialogue writing, and how to craft compelling stories. Perfect for beginners and experienced writers looking to refine their craft.",
    difficulty: "Beginner",
    readTime: 25,
    tags: ["Writing", "Creative", "Storytelling", "Narrative"],
  },
  {
    id: 7,
    title: "Digital Marketing Mastery",
    category: "Marketing",
    rating: 4.7,
    reviews: 210,
    author: "MarketingPro",
    price: 27.99,
    previewText: "Master the art of digital marketing with strategies for SEO, social media, content marketing, and paid advertising. Learn how to build brand awareness, generate leads, and convert customers in the digital age. Includes real-world case studies and actionable insights.",
    difficulty: "Intermediate",
    readTime: 40,
    tags: ["Marketing", "SEO", "Social Media", "Digital"],
  },
  {
    id: 8,
    title: "Blockchain Development Guide",
    category: "Blockchain",
    rating: 4.9,
    reviews: 95,
    author: "CryptoBuilder",
    price: 44.99,
    previewText: "Complete guide to blockchain development covering smart contracts, DeFi protocols, and dApp creation. Learn Solidity programming, Web3 integration, and how to build secure, scalable blockchain applications. Perfect for developers entering the Web3 space.",
    difficulty: "Advanced",
    readTime: 55,
    tags: ["Blockchain", "Solidity", "Web3", "DeFi", "Smart Contracts"],
  }
];

export const categories = [
  "All", 
  "Development", 
  "AI/ML", 
  "Design", 
  "Security", 
  "Interview", 
  "Writing", 
  "Marketing", 
  "Blockchain"
];

// Helper functions for filtering and sorting notes
export const getNotesByCategory = (category: string): Note[] => {
  if (category === "All") return sampleNotes;
  return sampleNotes.filter(note => note.category === category);
};

export const getNotesByDifficulty = (difficulty: string): Note[] => {
  return sampleNotes.filter(note => note.difficulty === difficulty);
};

export const getPopularNotes = (limit: number = 4): Note[] => {
  return [...sampleNotes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};

export const getRecentNotes = (limit: number = 4): Note[] => {
  return [...sampleNotes]
    .sort((a, b) => b.id - a.id) // Assuming higher ID means more recent
    .slice(0, limit);
};
