import { Note } from '../types/Note';

export const sampleNotes: Note[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    content: 'React Hooks are functions that let you use state and other React features without writing a class component...',
    description: 'Learn the basics of React Hooks and how they revolutionize React development.',
    tags: ['react', 'hooks', 'javascript', 'frontend'],
    category: 'Programming',
    author: 'Tech Writer',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    isPublished: true,
    metadata: {
      wordCount: 850,
      readTime: 4,
      difficulty: 'intermediate'
    }
  },
  {
    id: '2',
    title: 'Advanced TypeScript Patterns',
    content: 'Explore advanced TypeScript patterns including conditional types, mapped types, and template literal types...',
    description: 'Master advanced TypeScript concepts to write more type-safe code.',
    tags: ['typescript', 'patterns', 'advanced', 'programming'],
    category: 'Programming',
    author: 'TypeScript Expert',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-15'),
    isPublished: true,
    metadata: {
      wordCount: 1200,
      readTime: 6,
      difficulty: 'advanced'
    }
  },
  {
    id: '3',
    title: 'CSS Grid Layout Guide',
    content: 'CSS Grid Layout is a two-dimensional layout system for the web. It lets you lay out items in rows and columns...',
    description: 'Complete guide to CSS Grid with practical examples.',
    tags: ['css', 'grid', 'layout', 'design'],
    category: 'Design',
    author: 'CSS Designer',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    isPublished: true,
    metadata: {
      wordCount: 950,
      readTime: 5,
      difficulty: 'intermediate'
    }
  }
];
