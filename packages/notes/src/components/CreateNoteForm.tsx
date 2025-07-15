"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useFormatting } from "../hooks/useFormatting";
import { useImageInteraction } from "../hooks/useImageInteraction";
import { useImageState } from "../hooks/useImageState";
import { useResponsive } from "../hooks/useResponsive";
import EditorHeader from "./editor/EditorHeader";
import FormattingToolbar from "./editor/FormattingToolbar";
import ImageToolbox from "./editor/ImageToolbox";
// import WordCountWidget from "./editor/WordCountWidget";

const CreateNoteForm = () => {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);

  // Basic state
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [focusMode, setFocusMode] = useState<boolean>(false);

  // Custom hooks
  const { activeFormats, executeCommand, checkFormatting } = useFormatting();
  const { isMobile } = useResponsive();
  const {
    selectedImage,
    setSelectedImage,
    activeMode,
    setActiveMode,
    imageTextWrap,
    setImageTextWrap,
    imageOpacity,
    setImageOpacity,
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
    showResizeHelp: false,
    setShowResizeHelp: () => {},
    hasSeenHelp: true,
  });

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const plainText = e.currentTarget.textContent || "";
    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
    setCharCount(plainText.length);

    // Simulate autosave
    setTimeout(() => setLastSaved(new Date()), 1000);

    // Check formatting status after change
    checkFormatting();
  };

  const handleExecuteCommand = (command: string, value?: string) => {
    executeCommand(command, value, editorRef);
  };

  // Handler functions for EditorHeader
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const handleSave = () => {
    // Implement save logic
    console.log("Saving note:", { title /* content */ });
    setLastSaved(new Date());
  };

  const handlePublish = () => {
    // Implement publish logic
    console.log("Publishing note:", { title /* content */ });
  };

  // Adapter functions for ImageToolbox compatibility
  const handleImageTextWrapChange = (
    wrap: "none" | "left" | "right" | "center"
  ) => {
    if (wrap !== "none") {
      setImageTextWrap(wrap);
    }
  };

  const handleActiveModeChange = (
    mode: "move" | "resize" | "rotate" | null
  ) => {
    // Convert ImageToolbox modes to view/edit modes
    setActiveMode(mode ? "edit" : "view");
  };

  return (
    <div className="min-h-screen bg-ghost-black text-white">
      {/* Header and toolbars - hidden in focus mode */}
      {!focusMode && (
        <EditorHeader
          title={title}
          onTitleChange={handleTitleChange}
          onSave={handleSave}
          onPublish={handlePublish}
          lastSaved={lastSaved || undefined}
          onBackClick={() => router.push("/")}
        >
          <FormattingToolbar
            activeFormats={activeFormats}
            executeCommand={handleExecuteCommand}
          />

          <ImageToolbox
            selectedImage={null} // Convert string to HTMLImageElement or pass null
            imageTextWrap={imageTextWrap as "left" | "right" | "center"}
            setImageTextWrap={handleImageTextWrapChange}
            imageOpacity={imageOpacity}
            setImageOpacity={setImageOpacity}
            activeMode={null} // Convert view/edit to ImageToolbox modes
            setActiveMode={handleActiveModeChange}
            onHelpClick={() => {}}
          />
        </EditorHeader>
      )}

      {/* Word Count Widget - hidden in focus mode */}
      {!focusMode && (
        <WordCountWidget wordCount={wordCount} characterCount={charCount} />
      )}

      {/* Editor - Responsive layout with full-screen focus mode */}
      <div
        className={
          focusMode
            ? "w-full h-screen relative"
            : "max-w-5xl mx-auto px-2 sm:px-4 py-3 sm:py-5 relative"
        }
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          className={
            focusMode
              ? "w-full h-full p-6 sm:p-8 md:p-12 bg-ghost-black focus:outline-none text-white prose-editor overflow-auto text-lg sm:text-xl leading-relaxed resize-none"
              : "min-h-[70vh] sm:min-h-[80vh] p-4 sm:p-6 md:p-8 bg-ghost-dark/80 rounded-lg border border-ghost-gray/50 focus:outline-none focus:ring-1 focus:ring-ghost-purple/50 focus:border-ghost-purple/30 transition-all duration-200 text-white prose-editor overflow-hidden text-base sm:text-lg leading-relaxed"
          }
          data-placeholder="Start writing your masterpiece..."
          style={{ caretColor: "var(--ghost-neon)", position: "relative" }}
        />

        {/* Focus mode toggle button */}
        <button
          onClick={() => setFocusMode(!focusMode)}
          className={
            focusMode
              ? "fixed top-4 right-4 p-3 rounded-full bg-ghost-dark/90 border border-ghost-purple/40 text-gray-400 hover:text-ghost-neon hover:border-ghost-neon/60 transition-all duration-200 z-50 focus:outline-none shadow-lg backdrop-blur-sm"
              : "absolute top-4 right-4 p-2 rounded-full bg-ghost-dark/80 border border-ghost-purple/30 text-gray-400 hover:text-ghost-neon hover:border-ghost-neon/50 transition-all duration-200 z-10 focus:outline-none shadow-md"
          }
          aria-label={focusMode ? "Exit focus mode" : "Enter focus mode"}
          title={focusMode ? "Exit focus mode" : "Enter focus mode"}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={focusMode ? "h-5 w-5" : "h-4 w-4"}
          >
            {focusMode ? (
              <path d="M8 3v3a2 2 0 0 1-2 2H3M18 3v3a2 2 0 0 0 2 2h3M3 18v-3a2 2 0 0 1 2-2h3M18 18v-3a2 2 0 0 0-2-2h-3" />
            ) : (
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3m13 0h-3a2 2 0 0 1-2-2v-3" />
            )}
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CreateNoteForm;
