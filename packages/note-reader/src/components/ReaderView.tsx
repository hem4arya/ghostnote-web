import React from 'react';

interface ReaderViewProps {
  content: string;
  title?: string;
  className?: string;
}

export default function ReaderView({ 
  content, 
  title, 
  className = "" 
}: ReaderViewProps) {
  return (
    <div className={`reader-view ${className}`}>
      {title && (
        <h1 className="text-3xl font-bold mb-6 text-foreground">
          {title}
        </h1>
      )}
      <div 
        className="prose prose-neutral dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export { ReaderView };
export type { ReaderViewProps };
