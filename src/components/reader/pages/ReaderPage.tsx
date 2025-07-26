'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Heart, Share2, User, Flag, Volume2 } from "lucide-react";
import { Button } from '@/components/shared/ui/components/button';
import { Progress } from '@/components/shared/ui/components/progress';
import { Card } from '@/components/shared/ui/components/card';
import { Badge } from "@/components/shared/ui/components/badge";
import { Separator } from "@/components/shared/ui/components/separator";
import { toast } from "sonner";
import Navbar from '@/components/navbar/Navbar';

// Mock purchased note data
const purchasedNote = {
  id: "1",
  title: "Advanced React Patterns & Performance Optimization",
  author: "Sarah Chen",
  authorHandle: "@sarahchen_dev",
  authorAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b23c?w=40&h=40&fit=crop&crop=face",
  category: "Development",
  tags: ["React", "Performance", "JavaScript", "Frontend"],
  purchaseDate: "2024-12-20",
  readingTime: "45 min read",
  price: "$12.99",
  rating: 4.8,
  content: `
# Advanced React Patterns & Performance Optimization

Welcome to this comprehensive guide on advanced React patterns and performance optimization techniques.

## Table of Contents
1. [Performance Optimization Fundamentals](#performance)
2. [Advanced Component Patterns](#patterns)
3. [State Management Best Practices](#state)
4. [Memory Management](#memory)
5. [Bundle Optimization](#bundle)

## Performance Optimization Fundamentals {#performance}

React performance optimization is crucial for creating smooth, responsive applications. Here are the key principles:

### 1. Minimize Re-renders
- Use React.memo() for functional components
- Implement shouldComponentUpdate() for class components
- Leverage useMemo() and useCallback() hooks strategically

### 2. Code Splitting
- Implement lazy loading with React.lazy()
- Use dynamic imports for route-based splitting
- Consider component-based splitting for large features

### 3. Virtual DOM Optimization
- Provide stable keys for list items
- Avoid creating objects in render methods
- Use refs for direct DOM manipulation when necessary

## Advanced Component Patterns {#patterns}

Modern React development leverages several powerful patterns:

### Compound Components
This pattern allows you to create flexible, reusable components that work together seamlessly.

\`\`\`jsx
const Modal = ({ children }) => {
  return <div className="modal">{children}</div>;
};

Modal.Header = ({ children }) => (
  <div className="modal-header">{children}</div>
);

Modal.Body = ({ children }) => (
  <div className="modal-body">{children}</div>
);

Modal.Footer = ({ children }) => (
  <div className="modal-footer">{children}</div>
);
\`\`\`

### Render Props Pattern
Allows you to share code between components using a prop whose value is a function.

\`\`\`jsx
const DataFetcher = ({ render }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then(result => {
      setData(result);
      setLoading(false);
    });
  }, []);

  return render({ data, loading });
};
\`\`\`

### Higher-Order Components (HOCs)
A function that takes a component and returns a new component with additional functionality.

\`\`\`jsx
const withAuthentication = (WrappedComponent) => {
  return (props) => {
    const { user } = useAuth();
    
    if (!user) {
      return <LoginPrompt />;
    }
    
    return <WrappedComponent {...props} user={user} />;
  };
};
\`\`\`

## State Management Best Practices {#state}

Effective state management is crucial for maintainable React applications:

### 1. Local vs Global State
- Keep state as local as possible
- Lift state up only when necessary
- Use context for deeply nested prop drilling

### 2. State Structure
- Normalize complex state shapes
- Avoid deeply nested state objects
- Consider using useReducer for complex state logic

### 3. Side Effect Management
- Use useEffect appropriately
- Clean up subscriptions and timers
- Handle async operations properly

## Memory Management {#memory}

Preventing memory leaks is essential for long-running applications:

### Common Memory Leak Sources
1. **Event Listeners**: Always remove event listeners in cleanup
2. **Subscriptions**: Unsubscribe from observables and streams
3. **Timers**: Clear intervals and timeouts
4. **Closures**: Be careful with closure scope in effects

### Memory Optimization Techniques
- Use WeakMap and WeakSet for temporary references
- Implement proper cleanup in useEffect
- Avoid creating unnecessary closures

## Bundle Optimization {#bundle}

Reduce your application's bundle size for faster load times:

### Tree Shaking
- Use ES6 modules for better tree shaking
- Import only what you need from libraries
- Configure your bundler properly

### Code Splitting Strategies
1. **Route-based splitting**: Split on major routes
2. **Component-based splitting**: Split large components
3. **Library splitting**: Separate vendor code

### Performance Monitoring
- Use React DevTools Profiler
- Implement performance metrics
- Monitor bundle size regularly

## Conclusion

These advanced patterns and optimization techniques will help you build faster, more maintainable React applications. Remember to:

- Profile before optimizing
- Measure the impact of your changes
- Keep user experience as the primary goal
- Stay updated with React best practices

Happy coding! 🚀

---

*This note is part of the Advanced React Series. Check out other notes in this series for more in-depth coverage of React topics.*
  `,
  downloads: 1247,
  likes: 892,
  isBookmarked: false,
  readingProgress: 0
};

export default function ReaderPage() {
  const router = useRouter();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  // Simulate reading progress
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrollTop / documentHeight) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(isBookmarked ? 'Removed from bookmarks' : 'Added to bookmarks');
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? 'Like removed' : 'Note liked!');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: purchasedNote.title,
        text: `Check out this amazing note: ${purchasedNote.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  const handleReport = () => {
    toast.success('Report submitted. Thank you for helping us maintain quality content.');
  };

  const handleTextToSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(purchasedNote.content);
      utterance.rate = 0.8;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      toast.success('Starting text-to-speech...');
    } else {
      toast.error('Text-to-speech not supported in your browser');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-ghost-dark dark:to-ghost-gray">
        {/* Reading Progress Bar */}
        <div className="fixed top-0 left-0 right-0 z-50">
          <Progress value={readingProgress} className="h-1 bg-transparent" />
        </div>

        {/* Header */}
        <div className="bg-white/90 dark:bg-ghost-dark/90 backdrop-blur-sm border-b border-gray-200 dark:border-ghost-purple/30 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.back()}
                  className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div className="hidden md:block">
                  <h1 className="text-lg font-semibold text-gray-900 dark:text-white truncate max-w-md">
                    {purchasedNote.title}
                  </h1>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleTextToSpeech}
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Volume2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleBookmark}
                  className={isBookmarked ? "text-blue-600" : "text-gray-600 dark:text-gray-300"}
                >
                  <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleShare}
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReport}
                  className="text-gray-600 dark:text-gray-300"
                >
                  <Flag className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Note Header */}
          <div className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {purchasedNote.category}
              </Badge>
              {purchasedNote.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {purchasedNote.title}
            </h1>

            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src={purchasedNote.authorAvatar}
                    alt={purchasedNote.author}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{purchasedNote.author}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{purchasedNote.authorHandle}</p>
                  </div>
                </div>
                <Separator orientation="vertical" className="h-8" />
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>Purchased {purchasedNote.purchaseDate}</p>
                  <p>{purchasedNote.readingTime}</p>
                </div>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <span>{purchasedNote.downloads.toLocaleString()} downloads</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={`${isLiked ? 'text-red-600' : 'text-gray-500 dark:text-gray-400'} hover:text-red-600`}
                >
                  <Heart className={`w-4 h-4 mr-1 ${isLiked ? 'fill-current' : ''}`} />
                  {purchasedNote.likes.toLocaleString()}
                </Button>
              </div>
            </div>
          </div>

          {/* Note Content */}
          <Card className="bg-white/90 dark:bg-ghost-dark/90 backdrop-blur-sm border border-gray-200 dark:border-ghost-purple/30">
            <div className="p-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none"
                dangerouslySetInnerHTML={{ 
                  __html: purchasedNote.content.replace(/\n/g, '<br>').replace(/```jsx[\s\S]*?```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto"><code>$&</code></pre>').replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm">$1</code>') 
                }}
              />
            </div>
          </Card>

          {/* Author Info */}
          <Card className="mt-8 bg-white/90 dark:bg-ghost-dark/90 backdrop-blur-sm border border-gray-200 dark:border-ghost-purple/30">
            <div className="p-6">
              <div className="flex items-start space-x-4">
                <Image
                  src={purchasedNote.authorAvatar}
                  alt={purchasedNote.author}
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-full"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    About {purchasedNote.author}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Senior Frontend Developer with 8+ years of experience in React, TypeScript, and modern web technologies. 
                    Passionate about performance optimization and developer experience.
                  </p>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      More Notes
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
