/**
 * Dynamic Word Handle Page
 * Route: /[word_handle]
 * Displays notes accessed by their word_handle (e.g., /Night-Forest)
 */

import { WordHandleNotePage } from '@/components/word-handle-note';

interface WordHandlePageProps {
  params: Promise<{
    word_handle: string;
  }>;
}

export default async function WordHandlePage({ params }: WordHandlePageProps) {
  const { word_handle } = await params;
  return <WordHandleNotePage wordHandle={word_handle} />;
}