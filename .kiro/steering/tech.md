# Technology Stack & Build System

## Core Framework
- **Next.js 15.5.0**: React framework with App Router architecture
- **React 19.0.0**: Latest React with concurrent features
- **TypeScript 5**: Full type safety across the codebase

## Backend & Database
- **Supabase**: Backend-as-a-Service for auth, database, and storage
- **PostgreSQL**: Database with Row Level Security (RLS)
- **Supabase Auth**: Authentication with social providers

## UI & Styling
- **Tailwind CSS 3.4.17**: Utility-first CSS framework
- **Radix UI**: Headless component primitives for accessibility
- **Framer Motion**: Animation library for smooth interactions
- **Lucide React**: Icon library

## Rich Text Editing
- **TipTap 2.26.1**: Extensible rich text editor
- **ProseMirror**: Underlying editor framework
- **Lowlight**: Syntax highlighting for code blocks
- **KaTeX**: Math equation rendering

## Development Tools
- **ESLint**: Code linting with Next.js config
- **Jest**: Testing framework
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## Common Commands

```bash
# Development
npm run dev          # Start dev server on all interfaces
npm run dev:local    # Start dev server on localhost only

# Build & Deploy
npm run build        # Production build
npm run start        # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking

# Utilities
npm run clear-cache  # Clear Next.js cache
npm test            # Run Jest tests
```

## Environment Setup
- Requires `.env.local` with Supabase credentials
- Mock mode available for development without Supabase
- Supports both local and network development modes