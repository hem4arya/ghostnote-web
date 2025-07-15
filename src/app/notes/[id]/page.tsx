"use client";

// TV displaying the Notes Channel
import NoteDetailPage from "../../../../packages/notes/src/[id]/page";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function NotePage({ params }: NotePageProps) {
  return <NoteDetailPage params={params} />;
}
