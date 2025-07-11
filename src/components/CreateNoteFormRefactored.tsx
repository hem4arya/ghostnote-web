"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useFormatting } from "@/features/notes/hooks/useFormatting";
import { useResponsive } from "@/features/notes/hooks/useResponsive";
import { useHelpModal } from "@/features/notes/hooks/useHelpModal";
import { useImageState } from "@/features/notes/hooks/useImageState";
import { useImageInteraction } from "@/features/notes/hooks/useImageInteraction";
import EditorHeader from "@/features/notes/components/editor/EditorHeader";
import FormattingToolbar from "@/features/notes/components/editor/FormattingToolbar";
import ImageToolbox from "@/features/notes/components/editor/ImageToolbox";
import HelpModal from "@/features/notes/components/editor/HelpModal";

const CreateNoteForm = () => {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  
  // Basic state
  const [title, setTitle] = useState("");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Custom hooks
  const { activeFormats, executeCommand, checkFormatting } = useFormatting();
  const { isMobile } = useResponsive();
  const { hasSeenHelp, showResizeHelp, manualHelp, openHelpModal, closeHelpModal } = useHelpModal();
  const {
    selectedImage,
    setSelectedImage,
    activeMode,
    setActiveMode,
    imageTextWrap,
    setImageTextWrap,
    imageOpacity,
    setImageOpacity
  } = useImageState();

  // Image interaction hook
  useImageInteraction({
    editorRef,
    selectedImage,
    setSelectedImage,
    activeMode,
    setActiveMode,
    imageTextWrap,
    setImageTextWrap,
    imageOpacity,
    setImageOpacity,
    isMobile,
    showResizeHelp,
    setShowResizeHelp: (show: boolean) => show ? openHelpModal() : closeHelpModal(),
    hasSeenHelp
  });

  const handleContentChange = () => {
    // Simulate autosave
    setTimeout(() => setLastSaved(new Date()), 1000);
    
    // Check formatting status after change
    checkFormatting();
  };

  const handleExecuteCommand = (command: string, value?: string) => {
    executeCommand(command, value, editorRef);
  };

  return (
    <div className="min-h-screen bg-ghost-black text-white">
      <EditorHeader
        title={title}
        setTitle={setTitle}
        lastSaved={lastSaved}
        focusMode={focusMode}
        onBackClick={() => router.push('/')}
      >
        <FormattingToolbar
          activeFormats={activeFormats}
          executeCommand={handleExecuteCommand}
        />
        
        <ImageToolbox
          selectedImage={selectedImage}
          imageTextWrap={imageTextWrap}
          setImageTextWrap={setImageTextWrap}
          imageOpacity={imageOpacity}
          setImageOpacity={setImageOpacity}
          activeMode={activeMode}
          setActiveMode={setActiveMode}
          onHelpClick={openHelpModal}
        />
      </EditorHeader>

      {/* Editor - Optimized for mobile and small screens */}
      <div className="max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-5 relative">
        <div 
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          className="min-h-[70vh] sm:min-h-[80vh] p-3 sm:p-6 md:p-8 bg-ghost-dark/80 rounded-lg border border-ghost-gray/50 focus:outline-none focus:ring-1 focus:ring-ghost-purple/50 focus:border-ghost-purple/30 transition-all duration-200 text-white prose-editor overflow-hidden text-sm sm:text-base"
          data-placeholder="Start writing your masterpiece..."
          style={{ caretColor: 'var(--ghost-neon)', position: 'relative' }}
        />
        
        {/* Focus mode toggle button */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-ghost-dark/80 border border-ghost-gray/30 text-gray-400 hover:text-ghost-neon hover:border-ghost-purple/40 transition-all duration-200 z-10 focus:outline-none shadow-md"
          aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
          title={focusMode ? "Exit focus mode" : "Enter focus mode"}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="h-3.5 w-3.5"
          >
            {focusMode ? (
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
            ) : (
              <path d="M8 3v4M15 3v4M3 8h18M3 8v12a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V8" />
            )}
          </svg>
        </button>

        <HelpModal
          showResizeHelp={showResizeHelp}
          hasSeenHelp={hasSeenHelp}
          manualHelp={manualHelp}
          isMobile={isMobile}
          onClose={closeHelpModal}
        />
      </div>
    </div>
  );
};

export default CreateNoteForm;
