"use client";

import { useParams } from "next/navigation";
import { ErrorState } from "./components/ErrorState";
import { LoadingState } from "./components/LoadingState";
import { ReaderContent } from "./components/ReaderContent";
import { ReaderHeader } from "./components/ReaderHeader";
import { ReaderSidebar } from "./components/ReaderSidebar";
import { useNoteAccess } from "./hooks/useNoteAccess";
import { useReaderSettings } from "./hooks/useReaderSettings";

// TODO: Replace with actual AccessControl component once available
interface TempAccessControlProps {
  contentId: number;
  note: unknown;
  accessType: string;
}

const AccessControl = ({ contentId, accessType }: TempAccessControlProps) => (
  <div className="p-8 text-center">
    <h2 className="text-xl mb-4">Access Control</h2>
    <p>
      Note {contentId} requires {accessType} access
    </p>
  </div>
);

export default function NoteReaderPage() {
  const params = useParams();
  const noteId = parseInt(params.id as string);

  const {
    note,
    loading: noteLoading,
    error: noteError,
    hasAccess,
    accessType,
  } = useNoteAccess(noteId);

  const {
    fontSize,
    lineHeight,
    colorScheme,
    showSidebar,
    setFontSize,
    setLineHeight,
    setColorScheme,
    toggleSidebar,
  } = useReaderSettings();

  // Show loading state
  if (noteLoading) {
    return <LoadingState />;
  }

  // Show error state
  if (noteError || !note) {
    return <ErrorState error={noteError} />;
  }

  // Show access control if needed
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-ghost-black text-white">
        <AccessControl contentId={noteId} note={note} accessType={accessType} />
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        colorScheme === "dark"
          ? "bg-ghost-black text-white"
          : colorScheme === "sepia"
          ? "bg-amber-50 text-amber-900"
          : "bg-white text-gray-900"
      }`}
    >
      {/* Header */}
      <ReaderHeader
        note={note}
        onToggleSidebar={toggleSidebar}
        colorScheme={colorScheme}
        onColorSchemeChange={setColorScheme}
      />

      <div className="flex">
        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            showSidebar ? "mr-80" : "mr-0"
          }`}
        >
          <ReaderContent
            note={note}
            fontSize={fontSize}
            lineHeight={lineHeight}
            colorScheme={colorScheme}
          />
        </main>

        {/* Sidebar */}
        {showSidebar && (
          <ReaderSidebar
            note={note}
            fontSize={fontSize}
            lineHeight={lineHeight}
            onFontSizeChange={setFontSize}
            onLineHeightChange={setLineHeight}
          />
        )}
      </div>
    </div>
  );
}
