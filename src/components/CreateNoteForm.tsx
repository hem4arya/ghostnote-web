"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, RotateCcw, RotateCw, Save, FileText, Eye, ArrowLeft } from "lucide-react";

const CreateNoteForm = () => {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const plainText = e.currentTarget.textContent || "";
    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
    setCharCount(plainText.length);

    // Simulate autosave
    setTimeout(() => setLastSaved(new Date()), 1000);
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  };

  return (
    <div className="min-h-screen bg-ghost-black text-white">
      {/* Header */}
      <div className="border-b border-ghost-gray/50 bg-ghost-dark/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/')}
              className="p-2 rounded-md text-gray-300 hover:bg-ghost-purple/20 hover:text-ghost-neon flex items-center"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="h-6 w-px bg-ghost-gray/50 mx-2" />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Note"
              className="text-lg font-medium bg-transparent border-none shadow-none focus:ring-0 p-0 h-auto text-white placeholder-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-3">
            {lastSaved && (
              <div className="text-sm text-gray-400 flex items-center gap-2">
                <div className="h-2 w-2 bg-ghost-neon rounded-full animate-pulse" />
                Saved {lastSaved.toLocaleTimeString()}
              </div>
            )}
            <button className="px-4 py-2 text-sm font-semibold text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors flex items-center gap-2">
              <Save className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t border-ghost-gray/50 px-4 py-2">
          <div className="flex items-center gap-4 text-gray-400 max-w-7xl mx-auto">
            {/* Text Formatting */}
            <div className="flex items-center gap-1">
              <button onClick={() => executeCommand("bold")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><Bold className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("italic")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><Italic className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("underline")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><Underline className="h-4 w-4" /></button>
            </div>
            <div className="h-6 w-px bg-ghost-gray/50" />
            {/* Alignment */}
            <div className="flex items-center gap-1">
              <button onClick={() => executeCommand("justifyLeft")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><AlignLeft className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("justifyCenter")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><AlignCenter className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("justifyRight")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><AlignRight className="h-4 w-4" /></button>
            </div>
            <div className="h-6 w-px bg-ghost-gray/50" />
            {/* Lists */}
            <div className="flex items-center gap-1">
              <button onClick={() => executeCommand("insertUnorderedList")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><List className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("insertOrderedList")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><ListOrdered className="h-4 w-4" /></button>
            </div>
            <div className="h-6 w-px bg-ghost-gray/50" />
            {/* Media & Actions */}
            <div className="flex items-center gap-1">
              <button onClick={insertImage} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><ImageIcon className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("undo")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><RotateCcw className="h-4 w-4" /></button>
              <button onClick={() => executeCommand("redo")} className="p-2 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon"><RotateCw className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="max-w-4xl mx-auto p-8">
        <div 
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          className="min-h-[70vh] p-8 bg-ghost-dark/80 rounded-lg border border-ghost-gray/50 focus:outline-none focus:ring-2 focus:ring-ghost-purple/30 focus:border-ghost-purple/50 transition-all duration-200 text-white"
          data-placeholder="Start writing your masterpiece..."
        />
        
        {/* Status Bar */}
        <div className="flex items-center justify-between mt-4 text-sm text-gray-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-ghost-dark/70 px-3 py-1.5 rounded-md border border-ghost-gray/30">
              <FileText className="h-3 w-3" />
              <span>{wordCount} words</span>
            </div>
            <div className="flex items-center gap-2 bg-ghost-dark/70 px-3 py-1.5 rounded-md border border-ghost-gray/30">
              <Eye className="h-3 w-3" />
              <span>{charCount} characters</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-ghost-neon">Auto-saving enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateNoteForm;
