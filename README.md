# GhostNote Web Platform

A modern web platform for sharing and monetizing knowledge through notes, with advanced transparency features for buyers.

## 🌟 Key Features

- **Note Marketplace**: Buy and sell knowledge-based content
- **Clone Transparency**: Revolutionary transparency system for content originality
- **Creator Tools**: Advanced authoring and monetization features
- **Buyer Protection**: Clear information about content similarity and sources
- **Privacy-First**: Respects creator privacy while ensuring transparency

## 🚀 Clone Transparency Feature

GhostNote includes a comprehensive transparency system that provides buyers with clear information about content originality:

### ✨ What It Does
- **Similarity Detection**: Analyzes content to detect potential clones
- **Originality Classification**: Labels content as Original, Modified, Heavily Inspired, or Clone
- **Source Attribution**: Links to original creators (when public)
- **Buyer Guidance**: Respectful messaging to help purchase decisions

### 🎯 How It Works
- **Smart Analysis**: Backend similarity scoring with transparent thresholds
- **Privacy Respecting**: Original creators can choose to remain anonymous
- **User-Friendly**: Clear badges like "35% Match – View Source"
- **Educational**: Informative rather than accusatory messaging

### 🧪 Try It Now
Visit `/transparency-demo` to see all transparency scenarios in action.

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase account (for backend features)
- TypeScript knowledge

### Quick Setup

1. **Clone and Install**
```bash
git clone <repository-url>
cd ghostnote-web
npm install
```

2. **Environment Setup**
```bash
# Copy environment template
cp .env.example .env.local

# Add your Supabase credentials
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Start Development**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Database Setup (Optional)
For transparency features, run the database migration:
```bash
supabase migration up --file 20250710000004_add_note_transparency.sql
```

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

## 📁 Project Structure

```
ghostnote-web/
├── src/
│   ├── app/                    # Next.js App Router pages
│   ├── components/             # React components
│   │   ├── CloneTransparency*.tsx  # Transparency components
│   │   └── ui/                 # UI components
│   ├── utils/                  # Utility functions
│   │   └── transparency.ts     # Transparency utilities
│   └── data/                   # Sample and mock data
├── supabase/
│   ├── functions/              # Edge Functions
│   │   └── note-transparency/  # Transparency API
│   └── migrations/             # Database migrations
├── docs/                       # Documentation
└── public/                     # Static assets
```

## 🎨 UI Components

### Transparency Components
- **`CloneTransparencyBadge`**: Main transparency display component
- **`CloneTransparencyWrapper`**: Production wrapper with API integration
- **`CloneTransparencyWrapperDev`**: Development wrapper with mock data

### Usage Example
```typescript
import { CloneTransparencyWrapperDev } from '@/components/CloneTransparencyWrapperDev';

// In your component
<CloneTransparencyWrapperDev 
  noteId="2" 
  showDetailedInfo={true} 
/>
```

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- **[📖 Documentation Index](./docs/README.md)** - Complete documentation overview
- **[🎯 Feature Guide](./docs/TRANSPARENCY_FEATURE.md)** - Transparency feature overview
- **[🏗️ Architecture](./docs/ARCHITECTURE.md)** - Technical architecture
- **[👨‍💻 Developer Guide](./docs/DEVELOPER_GUIDE.md)** - Development workflow
- **[🧩 Component Reference](./docs/COMPONENT_REFERENCE.md)** - UI component docs
- **[🌐 API Reference](./docs/API_REFERENCE.md)** - API specification

## 🧪 Testing & Development

### Mock Data
The project includes comprehensive mock data for testing transparency features without backend setup:

```typescript
// Available test scenarios
noteId="1" // Original content (no badge)
noteId="2" // Modified content (35% similarity)
noteId="3" // Heavily inspired (60% similarity)
noteId="4" // Clone content (85% similarity)
noteId="5" // Private original creator
```

### Demo Page
Visit `/transparency-demo` to explore all transparency scenarios interactively.

## 🔧 Technology Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Backend**: Supabase (Database, Edge Functions, Auth)
- **Deployment**: Vercel (recommended)

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically with Git pushes

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation if needed
5. Submit a pull request

### Documentation Updates
When adding features, please update:
- Component documentation in `/docs`
- README examples
- Mock data if applicable

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check `/docs` directory for comprehensive guides
- **Demo**: Visit `/transparency-demo` for interactive examples
- **Issues**: Report bugs and feature requests via GitHub issues

---

**Built with ❤️ by the GhostNote team**
