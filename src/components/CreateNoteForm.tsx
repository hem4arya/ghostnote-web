"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, RotateCcw, RotateCw, Save, FileText, Eye, ArrowLeft, HelpCircle } from "lucide-react";

const CreateNoteForm = () => {
  const router = useRouter();
  const editorRef = useRef<HTMLDivElement>(null);
  const [title, setTitle] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showResizeHelp, setShowResizeHelp] = useState(false);
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [activeMode, setActiveMode] = useState<'move' | 'resize' | null>(null);

  // Track active formatting states
  const [activeFormats, setActiveFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertUnorderedList: false,
    insertOrderedList: false
  });

  // State to track if user has seen the help popup
  const [hasSeenHelp, setHasSeenHelp] = useState<boolean>(false);

  // State to track if user manually opened help vs automatic
  const [manualHelp, setManualHelp] = useState<boolean>(false);

  // Check formatting status when selection changes
  const checkFormatting = () => {
    if (typeof document !== 'undefined') {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList')
      });
    }
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const plainText = e.currentTarget.textContent || "";
    setWordCount(plainText.trim() ? plainText.trim().split(/\s+/).length : 0);
    setCharCount(plainText.length);

    // Simulate autosave
    setTimeout(() => setLastSaved(new Date()), 1000);
    
    // Check formatting status after change
    checkFormatting();
  };

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    checkFormatting();
    editorRef.current?.focus();
  };

  const insertImage = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }
    
    // Create a local URL for the image
    const imageUrl = URL.createObjectURL(file);
    
    // Insert the image at the cursor position
    executeCommand('insertImage', imageUrl);
    
    // Reset the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    // Show resize instructions tooltip
    setTimeout(() => {
      if (editorRef.current) {
        const newImage = editorRef.current.querySelector('img:not(.resizable)') as HTMLImageElement;
        if (newImage) {
          // Add the resizable class (will be picked up by the MutationObserver)
          newImage.classList.add('resizable');
          
          // Show a tooltip with instructions
          const tooltip = document.createElement('div');
          tooltip.className = 'image-resize-tooltip';
          tooltip.innerHTML = `
            <div class="tooltip-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon-cyan"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z"></path><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
              <span>Image Controls</span>
            </div>
            <p><span class="highlight-cyan">Click</span> to select an image</p>
            <p><span class="highlight-neon">Choose mode</span> to resize or move</p>
            <p>Use <span class="highlight-purple">Alt + Arrow keys</span> to adjust</p>
          `;
          
          // Position the tooltip near the image
          newImage.parentNode?.appendChild(tooltip);
          
          // Remove the tooltip after a few seconds
          setTimeout(() => {
            tooltip.classList.add('fade-out');
            setTimeout(() => tooltip.remove(), 500);
          }, 5000);
        }
      }
    }, 100);
  };
  
  // Add selection change event to monitor formatting
  useEffect(() => {
    const handleSelectionChange = () => {
      checkFormatting();
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    
    // Ensure editor is initialized with default settings
    if (editorRef.current) {
      // Set initial caret and make sure it's focused
      editorRef.current.style.caretColor = 'var(--ghost-neon)';
      
      // Apply initial placeholder if needed
      if (!editorRef.current.textContent) {
        editorRef.current.dataset.placeholder = "Start writing your masterpiece...";
      }
    }
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);    // Setup image resizing functionality
  useEffect(() => {
    if (!editorRef.current) return;
    
    const editor = editorRef.current;
    let resizing = false;
    let dragging = false;
    let currentImage: HTMLImageElement | null = null;
    let startX = 0;
    let startY = 0;
    let startWidth = 0;
    let startHeight = 0;
    let initialLeft = 0;
    let initialTop = 0;
    
    // Function to make images resizable and draggable
    const makeImagesInteractive = () => {
      const images = editor.querySelectorAll('img');
      
      images.forEach((img) => {
        if (!img.classList.contains('resizable')) {
          img.classList.add('resizable');
          img.draggable = false; // Prevent default dragging
          
          // Give the image a relative position if it doesn't have a position already
          if (window.getComputedStyle(img).position === 'static') {
            img.style.position = 'relative';
          }
        }
      });
    };
    
    // Function to handle image clicks
    const handleEditorClick = (e: MouseEvent) => {
      const images = editor.querySelectorAll('img');
      
      // If click is not on an image, deselect all images
      if ((e.target as Element).tagName !== 'IMG') {
        images.forEach(img => {
          img.classList.remove('selected-for-resize');
          img.classList.remove('dragging');
          
          // Remove any existing mode controls
          const controls = document.querySelectorAll('.image-mode-controls');
          controls.forEach(control => control.remove());
        });
        setSelectedImage(null);
        setActiveMode(null);
        setShowResizeHelp(false);
        return;
      }
      
      const img = e.target as HTMLImageElement;
      
      // First remove classes from all images and controls
      images.forEach(i => {
        i.classList.remove('selected-for-resize');
        i.classList.remove('dragging');
      });
      
      // Remove any existing mode controls
      const existingControls = document.querySelectorAll('.image-mode-controls');
      existingControls.forEach(control => control.remove());
      
      // Add selected class to current image
      img.classList.add('selected-for-resize');
      setSelectedImage(img);
      
      // Create and add mode selection controls
      const controls = document.createElement('div');
      controls.className = 'image-mode-controls';
      controls.innerHTML = `
        <div class="controls-wrapper">
          <button class="mode-button move-mode" title="Move mode">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="5 9 2 12 5 15"></polyline>
              <polyline points="9 5 12 2 15 5"></polyline>
              <polyline points="15 19 12 22 9 19"></polyline>
              <polyline points="19 9 22 12 19 15"></polyline>
              <line x1="2" y1="12" x2="22" y2="12"></line>
              <line x1="12" y1="2" x2="12" y2="22"></line>
            </svg>
          </button>
          <button class="mode-button resize-mode" title="Resize mode">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h6v6"></path>
              <path d="M9 21H3v-6"></path>
              <path d="M21 3l-7 7"></path>
              <path d="M3 21l7-7"></path>
            </svg>
          </button>
        </div>
      `;
      
      // Position the controls near the image
      const imgRect = img.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      controls.style.position = 'absolute';
      controls.style.top = `${imgRect.top - editorRect.top - 50}px`;
      controls.style.left = `${imgRect.left + imgRect.width / 2 - 50}px`;
      
      // Add to editor
      editor.appendChild(controls);
      
      // Add event listeners to the mode buttons
      const moveBtn = controls.querySelector('.move-mode') as HTMLButtonElement;
      const resizeBtn = controls.querySelector('.resize-mode') as HTMLButtonElement;
      
      if (moveBtn && resizeBtn) {
        moveBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveMode('move');
          updateModeUI(img, 'move');
          if (!hasSeenHelp) {
            setShowResizeHelp(true);
          }
        });
        
        resizeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          setActiveMode('resize');
          updateModeUI(img, 'resize');
          if (!hasSeenHelp) {
            setShowResizeHelp(true);
          }
        });
      }
    };
    
    // Mouse-based resizing and repositioning handlers
    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).tagName === 'IMG' && (e.target as HTMLElement).classList.contains('selected-for-resize')) {
        e.preventDefault();
        currentImage = e.target as HTMLImageElement;
        startX = e.clientX;
        startY = e.clientY;
        
        // Get current position
        const computedStyle = window.getComputedStyle(currentImage);
        initialLeft = parseInt(computedStyle.left) || 0;
        initialTop = parseInt(computedStyle.top) || 0;
        
        // Clear existing temporary interaction classes
        currentImage.classList.remove('resizing');
        
        // Check which mode is active based on state
        if (activeMode === 'move') {
          // Start dragging
          dragging = true;
          document.body.style.cursor = 'move';
          currentImage.classList.add('dragging');
        } else if (activeMode === 'resize') {
          // Start resizing
          resizing = true;
          startWidth = currentImage.clientWidth;
          startHeight = currentImage.clientHeight;
          currentImage.classList.add('resizing');
        }
        
        // Prevent text selection during interaction
        document.body.classList.add('resize-in-progress');
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!currentImage) return;
      
      if (resizing) {
        // Calculate new dimensions
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        // Maintain aspect ratio if shift is pressed
        if (e.shiftKey) {
          const aspectRatio = startWidth / startHeight;
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = newWidth / aspectRatio;
          
          currentImage.style.width = `${newWidth}px`;
          currentImage.style.height = `${newHeight}px`;
        } else {
          // Resize freely
          currentImage.style.width = `${Math.max(50, startWidth + deltaX)}px`;
          currentImage.style.height = `${Math.max(50, startHeight + deltaY)}px`;
        }
      } else if (dragging) {
        // Move the image
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        currentImage.style.left = `${initialLeft + deltaX}px`;
        currentImage.style.top = `${initialTop + deltaY}px`;
      }
    };
    
    const handleMouseUp = () => {
      if (currentImage) {
        // Only remove the 'resizing' class but maintain the 'dragging' class state
        // so we don't switch modes on mouse release
        currentImage.classList.remove('resizing');
        
        // Reset cursor
        document.body.style.cursor = '';
        
        // Enable text selection again
        document.body.classList.remove('resize-in-progress');
        
        // Reset state
        resizing = false;
        dragging = false;
        currentImage = null;
      }
    };
    
    // Helper function to update UI based on active mode
    const updateModeUI = (img: HTMLImageElement, mode: 'move' | 'resize' | null) => {
      if (!img) return;
      
      // Update classes based on mode
      if (mode === 'move') {
        img.classList.add('dragging');
        img.classList.remove('resizing');
      } else if (mode === 'resize') {
        img.classList.remove('dragging');
        img.classList.add('selected-for-resize');
      } else {
        // No mode selected
        img.classList.remove('dragging');
        img.classList.remove('resizing');
      }
      
      // Update controls if they exist
      const controls = editor.querySelector('.image-mode-controls');
      if (controls) {
        const moveBtn = controls.querySelector('.move-mode') as HTMLButtonElement;
        const resizeBtn = controls.querySelector('.resize-mode') as HTMLButtonElement;
        
        if (moveBtn && resizeBtn) {
          moveBtn.classList.toggle('active', mode === 'move');
          resizeBtn.classList.toggle('active', mode === 'resize');
        }
      }
    };
    
    // Keyboard-based interaction handler
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedImg = editor.querySelector('img.selected-for-resize') as HTMLImageElement;
      if (!selectedImg) return;
      
      const STEP = 10; // Resize/move step in pixels
      const SMALL_STEP = 2; // For fine-tuning when Shift is held
      const moveStep = e.shiftKey ? SMALL_STEP : STEP;
      
      if (activeMode === 'move') {
        // Movement mode with arrow keys
        if (e.altKey) {
          const computedStyle = window.getComputedStyle(selectedImg);
          const currentLeft = parseInt(computedStyle.left) || 0;
          const currentTop = parseInt(computedStyle.top) || 0;
          
          switch (e.key) {
            case 'ArrowUp': // Move up
              e.preventDefault();
              selectedImg.style.top = `${currentTop - moveStep}px`;
              break;
            case 'ArrowDown': // Move down
              e.preventDefault();
              selectedImg.style.top = `${currentTop + moveStep}px`;
              break;
            case 'ArrowLeft': // Move left
              e.preventDefault();
              selectedImg.style.left = `${currentLeft - moveStep}px`;
              break;
            case 'ArrowRight': // Move right
              e.preventDefault();
              selectedImg.style.left = `${currentLeft + moveStep}px`;
              break;
            case 'r': // Reset position
              e.preventDefault();
              selectedImg.style.left = '0';
              selectedImg.style.top = '0';
              break;
          }
        }
      } else if (activeMode === 'resize') {
        // Resize mode with arrow keys
        if (e.altKey) {
          const currentWidth = selectedImg.width;
          const currentHeight = selectedImg.height;
          const resizeStep = e.shiftKey ? SMALL_STEP : STEP;
          
          switch (e.key) {
            case 'ArrowUp': // Increase height
              e.preventDefault();
              selectedImg.style.height = `${currentHeight + resizeStep}px`;
              break;
            case 'ArrowDown': // Decrease height
              e.preventDefault();
              selectedImg.style.height = `${Math.max(50, currentHeight - resizeStep)}px`;
              break;
            case 'ArrowRight': // Increase width
              e.preventDefault();
              selectedImg.style.width = `${currentWidth + resizeStep}px`;
              break;
            case 'ArrowLeft': // Decrease width
              e.preventDefault();
              selectedImg.style.width = `${Math.max(50, currentWidth - resizeStep)}px`;
              break;
            case 'r': // Reset to original size
              e.preventDefault();
              selectedImg.style.width = '';
              selectedImg.style.height = '';
              break;
          }
        }
      }
    };
    
    // Initialize the functionality
    makeImagesInteractive();
    
    // Create a MutationObserver to watch for new images
    const observer = new MutationObserver(() => {
      makeImagesInteractive();
    });
    
    // Start observing the editor for added nodes
    observer.observe(editor, { childList: true, subtree: true });
    
    // Add event listeners
    editor.addEventListener('click', handleEditorClick);
    editor.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    // Cleanup
    return () => {
      observer.disconnect();
      editor.removeEventListener('click', handleEditorClick);
      editor.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMode, hasSeenHelp]);

  // Update UI when active mode changes
  useEffect(() => {
    if (selectedImage && activeMode) {
      // Find the editor ref
      const editor = editorRef.current;
      if (!editor) return;
      
      // Update classes on the selected image
      if (activeMode === 'move') {
        selectedImage.classList.add('dragging');
        selectedImage.classList.remove('resizing');
      } else if (activeMode === 'resize') {
        selectedImage.classList.remove('dragging');
        selectedImage.classList.add('selected-for-resize');
      }
    }
  }, [activeMode, selectedImage]);

  // Check if the help tooltip should be shown
  useEffect(() => {
    // Load the hasSeenHelp state from localStorage when component mounts
    const helpSeen = localStorage.getItem('ghostnote-help-seen') === 'true';
    if (helpSeen) {
      setHasSeenHelp(true);
    }
  }, []);

  // Save the hasSeenHelp state to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('ghostnote-help-seen', hasSeenHelp ? 'true' : 'false');
  }, [hasSeenHelp]);

  return (
    <div className="min-h-screen bg-ghost-black text-white">
      {/* Header */}
      <div className="border-b border-ghost-gray/50 bg-ghost-dark/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="flex items-center justify-between p-3 max-w-7xl mx-auto">
          <div className="w-20">
            <button 
              onClick={() => router.push('/')}
              className="p-1.5 rounded-md text-gray-300 hover:bg-ghost-purple/20 hover:text-ghost-neon flex items-center focus:outline-none"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
          
          <div className="flex-1 flex justify-center">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Untitled Note"
              className="text-lg font-medium bg-transparent border-none shadow-none focus:ring-0 focus:outline-none p-0 h-auto text-white placeholder-gray-400 text-center"
            />
          </div>
          
          <div className="flex items-center gap-2 justify-end">
            {lastSaved && (
              <div className="text-xs text-gray-400 flex items-center gap-1">
                <div className="h-1.5 w-1.5 bg-ghost-neon rounded-full animate-pulse" />
                <span className="hidden sm:inline">Saved</span> {lastSaved.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </div>
            )}
            <button className="px-3 py-1.5 text-sm font-semibold text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors flex items-center gap-1.5 focus:outline-none">
              <Save className="h-4 w-4" />
              Sell
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-t border-ghost-gray/50 px-4 py-1">
          <div className="flex items-center justify-between text-gray-400 max-w-7xl mx-auto">
            <div className="flex items-center gap-3 overflow-x-auto hide-scrollbar">
              {/* Text Formatting */}
              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => executeCommand("bold")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.bold ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.bold}
                >
                  <Bold className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => executeCommand("italic")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.italic ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.italic}
                >
                  <Italic className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => executeCommand("underline")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.underline ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.underline}
                >
                  <Underline className="h-4 w-4" />
                </button>
              </div>
              <div className="h-5 w-px bg-ghost-gray/50" />
              {/* Alignment */}
              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => executeCommand("justifyLeft")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyLeft ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.justifyLeft}
                >
                  <AlignLeft className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => executeCommand("justifyCenter")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyCenter ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.justifyCenter}
                >
                  <AlignCenter className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => executeCommand("justifyRight")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.justifyRight ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.justifyRight}
                >
                  <AlignRight className="h-4 w-4" />
                </button>
              </div>
              <div className="h-5 w-px bg-ghost-gray/50" />
              {/* Lists */}
              <div className="flex items-center gap-0.5">
                <button 
                  onClick={() => executeCommand("insertUnorderedList")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.insertUnorderedList ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.insertUnorderedList}
                >
                  <List className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => executeCommand("insertOrderedList")} 
                  className={`p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeFormats.insertOrderedList ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
                  aria-pressed={activeFormats.insertOrderedList}
                >
                  <ListOrdered className="h-4 w-4" />
                </button>
              </div>
              <div className="h-5 w-px bg-ghost-gray/50" />
              {/* Media & Actions */}
              <div className="flex items-center gap-0.5 relative group">
                <button onClick={insertImage} className="p-1.5 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon focus:outline-none text-gray-300 relative">
                  <ImageIcon className="h-4 w-4" />
                  <span className="absolute -top-20 left-1/2 transform -translate-x-1/2 bg-ghost-dark border border-ghost-purple/30 rounded-md px-2 py-1 text-xs text-ghost-neon opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                    Upload an image
                  </span>
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden"
                />
                <button onClick={() => executeCommand("undo")} className="p-1.5 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon focus:outline-none text-gray-300">
                  <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={() => executeCommand("redo")} className="p-1.5 rounded-md hover:bg-ghost-purple/20 hover:text-ghost-neon focus:outline-none text-gray-300">
                  <RotateCw className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => {
                    setShowResizeHelp(true);
                    setManualHelp(true);
                  }} 
                  className="p-1.5 rounded-md hover:bg-ghost-purple/20 focus:outline-none text-gray-300"
                  aria-label="Toggle resize help"
                >
                  <HelpCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {/* Word & Character Count */}
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5" />
                <span>{wordCount} words</span>
              </div>
              <div className="h-3 w-px bg-ghost-gray/50" />
              <div className="flex items-center gap-1.5">
                <Eye className="h-3.5 w-3.5" />
                <span>{charCount} characters</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editor - Optimized to use more screen space */}
      <div className="max-w-5xl mx-auto px-4 py-5 relative">
        <div 
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={handleContentChange}
          className="min-h-[80vh] p-6 md:p-8 bg-ghost-dark/80 rounded-lg border border-ghost-gray/50 focus:outline-none focus:ring-1 focus:ring-ghost-purple/50 focus:border-ghost-purple/30 transition-all duration-200 text-white prose-editor"
          data-placeholder="Start writing your masterpiece..."
          style={{ caretColor: 'var(--ghost-neon)' }}
        />
           {/* Image resize/move help */}
      {showResizeHelp && (!hasSeenHelp || manualHelp) && (
          <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-ghost-dark/95 border border-ghost-purple rounded-lg px-6 py-5 max-w-md z-50 shadow-[0_0_25px_rgba(107,70,193,0.3)] backdrop-blur-sm">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="relative">
                <HelpCircle className="h-5 w-5 text-ghost-neon" />
                <div className="absolute -top-1 -right-1 h-2 w-2 bg-ghost-cyan rounded-full animate-ping"></div>
              </div>
              <h4 className="text-base font-medium bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent">
                Image Interaction Controls
              </h4>
            </div>
            
            <div className="grid grid-cols-2 gap-5 text-sm text-gray-300 mb-5">
              <div className="bg-ghost-black/70 p-4 rounded-lg border border-ghost-cyan/30 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-cyan/10 rounded-full blur-xl"></div>
                <h5 className="text-ghost-cyan font-medium mb-3 text-sm flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-ghost-cyan rounded-full"></span>
                  Move Mode
                </h5>
                <div className="space-y-2.5 text-xs">
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-cyan">•</span>
                    <span><span className="text-ghost-cyan font-medium">Click</span> an image to select it</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-cyan">•</span>
                    <span><span className="text-ghost-cyan font-medium">Choose Move</span> from the controls</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-cyan">•</span>
                    <span><span className="text-ghost-cyan font-medium">Drag</span> to reposition</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-cyan">•</span>
                    <span><span className="text-ghost-cyan font-medium">Alt+Arrows</span> for precision</span>
                  </p>
                </div>
              </div>
              
              <div className="bg-ghost-black/70 p-4 rounded-lg border border-ghost-neon/30 relative overflow-hidden">
                <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-neon/10 rounded-full blur-xl"></div>
                <h5 className="text-ghost-neon font-medium mb-3 text-sm flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-ghost-neon rounded-full"></span>
                  Resize Mode
                </h5>
                <div className="space-y-2.5 text-xs">
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-neon">•</span>
                    <span><span className="text-ghost-neon font-medium">Click</span> an image to select it</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-neon">•</span>
                    <span><span className="text-ghost-neon font-medium">Choose Resize</span> from the controls</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-neon">•</span>
                    <span><span className="text-ghost-neon font-medium">Drag corners</span> to resize</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-ghost-neon">•</span>
                    <span><span className="text-ghost-neon font-medium">Shift+Drag</span> for aspect ratio</span>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-3 bg-ghost-black/30 rounded-lg py-2 border border-ghost-purple/20">
              <p className="text-xs text-ghost-purple/90">
                <span className="text-ghost-purple font-medium">Alt+R</span> to reset size or position
              </p>
            </div>
            
            <button 
              onClick={() => {
                setShowResizeHelp(false);
                setManualHelp(false);
                setHasSeenHelp(true);
                // Save to localStorage directly for extra assurance
                localStorage.setItem('ghostnote-help-seen', 'true');
              }}
              className="w-full px-4 py-1.5 text-sm font-medium text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)]"
            >
              Got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNoteForm;
