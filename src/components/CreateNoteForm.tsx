"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, List, ListOrdered, Image as ImageIcon, RotateCcw, RotateCw, Save, FileText, Eye, ArrowLeft, HelpCircle, X } from "lucide-react";

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
  const [imageTextWrap, setImageTextWrap] = useState<boolean>(true); // true = text wraps around, false = image overlaps text
  const [imageOpacity, setImageOpacity] = useState<number>(100); // opacity percentage

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
    
    // Create a temporary image to get dimensions before inserting
    const tempImg = new Image();
    tempImg.onload = () => {
      // Get editor dimensions with safety margins
      const editorWidth = editorRef.current?.clientWidth || 800;
      const editorPadding = 40; // Increased padding for safety
      const maxWidth = editorWidth - editorPadding; // Account for padding on both sides
      
      // Calculate image dimensions to preserve aspect ratio but fit within editor
      let newWidth = tempImg.width;
      let newHeight = tempImg.height;
      
      // If image is too large, we'll pre-scale it
      if (tempImg.width > maxWidth) {
        const aspectRatio = tempImg.width / tempImg.height;
        newWidth = maxWidth;
        newHeight = newWidth / aspectRatio;
      }
      
      // Ensure height doesn't exceed a reasonable limit
      const maxHeight = (editorRef.current?.clientHeight || 600) - editorPadding;
      if (newHeight > maxHeight) {
        const aspectRatio = newWidth / newHeight;
        newHeight = maxHeight;
        newWidth = newHeight * aspectRatio;
      }
      
      // Insert the image at the cursor position with adjusted size and proper constraints
      executeCommand('insertHTML', `<img src="${imageUrl}" style="width:${newWidth}px;height:${newHeight}px;max-width:${maxWidth}px;max-height:${maxHeight}px;object-fit:contain;display:block;">`);
      
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
    tempImg.src = imageUrl;
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
          
          // Set initial constraints and text wrap
          img.style.boxSizing = 'border-box';
          img.style.minWidth = '50px';
          img.style.minHeight = '50px';
          img.style.border = 'none'; // Remove borders from images
          
          // Apply strict dimensions to ensure images never overflow
          const editorPadding = 20; // Padding from edges
          const maxWidth = editor.clientWidth - (editorPadding * 2); // Use clientWidth instead of getBoundingClientRect
          
          // Set max-width to ensure image fits within editor
          img.style.maxWidth = `${maxWidth}px`;
          img.style.height = 'auto';
          
          // If image is larger than editor, scale it down
          if (img.naturalWidth > maxWidth) {
            const aspectRatio = img.naturalWidth / img.naturalHeight;
            const newWidth = maxWidth;
            const newHeight = newWidth / aspectRatio;
            
            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
          }
          
          // Ensure the image has proper overflow handling
          img.style.objectFit = 'contain';
          img.style.maxHeight = '100%';
          
          // Force containment for all images regardless of position
          const currentWidth = img.offsetWidth;
          const currentHeight = img.offsetHeight;
          
          if (currentWidth > maxWidth) {
            const aspectRatio = currentWidth / currentHeight;
            img.style.width = `${maxWidth}px`;
            img.style.height = `${maxWidth / aspectRatio}px`;
          }
          
          // Apply additional constraints for absolutely positioned images
          if (img.style.position === 'absolute') {
            const constraints = constrainImageToBounds(img);
            img.style.left = `${constraints.left}px`;
            img.style.top = `${constraints.top}px`;
            img.style.width = `${constraints.width}px`;
            img.style.height = `${constraints.height}px`;
          }
          
          // Initialize text wrap state using data attribute
          if (!img.hasAttribute('data-text-wrap')) {
            img.setAttribute('data-text-wrap', 'true');
            img.style.float = 'left';
            img.style.margin = '0 1rem 1rem 0';
            img.style.maxWidth = '50%';
            img.style.position = 'relative';
            img.style.zIndex = '1';
          }
        }
      });
    };

    // Helper function to constrain image within editor bounds
    const constrainImageToBounds = (img: HTMLImageElement, newLeft?: number, newTop?: number, newWidth?: number, newHeight?: number) => {
      const editorPadding = 20; // Padding from edges
      
      // Use editor's actual dimensions instead of getBoundingClientRect
      const editorWidth = editor.clientWidth;
      const editorHeight = editor.clientHeight;
      
      // Get current values or use provided ones
      const currentLeft = newLeft !== undefined ? newLeft : parseInt(img.style.left) || 0;
      const currentTop = newTop !== undefined ? newTop : parseInt(img.style.top) || 0;
      const currentWidth = newWidth !== undefined ? newWidth : img.offsetWidth;
      const currentHeight = newHeight !== undefined ? newHeight : img.offsetHeight;
      
      // Get actual content area dimensions (accounting for padding)
      const contentWidth = editorWidth - (editorPadding * 2);
      const contentHeight = editorHeight - (editorPadding * 2);
      
      // For absolutely positioned images, ensure they stay within bounds
      const maxLeft = Math.max(0, contentWidth - currentWidth);
      const maxTop = Math.max(0, contentHeight - currentHeight);
      
      // Strictly constrain within the editor bounds
      const constrainedLeft = Math.max(0, Math.min(currentLeft, maxLeft));
      const constrainedTop = Math.max(0, Math.min(currentTop, maxTop));
      
      // Calculate maximum allowed dimensions based on position
      const spaceToRightEdge = contentWidth - constrainedLeft;
      const spaceToBottomEdge = contentHeight - constrainedTop;
      
      // Strictly constrain width and height to fit within editor
      const constrainedWidth = Math.min(currentWidth, spaceToRightEdge);
      const constrainedHeight = Math.min(currentHeight, spaceToBottomEdge);
      
      // Ensure minimum size but respect bounds
      const finalWidth = Math.max(50, Math.min(constrainedWidth, contentWidth));
      const finalHeight = Math.max(50, Math.min(constrainedHeight, contentHeight));
      
      return {
        left: constrainedLeft,
        top: constrainedTop,
        width: finalWidth,
        height: finalHeight
      };
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
          <div class="mode-buttons">
            <button class="mode-button move-mode" title="Move mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="5 9 2 12 5 15"></polyline>
                <polyline points="9 5 12 2 15 5"></polyline>
                <polyline points="15 19 12 22 9 19"></polyline>
                <polyline points="19 9 22 12 19 15"></polyline>
                <line x1="2" y1="12" x2="22" y2="12"></line>
                <line x1="12" y1="2" x2="12" y2="22"></line>
              </svg>
            </button>
            <button class="mode-button resize-mode" title="Resize mode">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M15 3h6v6"></path>
                <path d="M9 21H3v-6"></path>
                <path d="M21 3l-7 7"></path>
                <path d="M3 21l7-7"></path>
              </svg>
            </button>
            <button class="mode-button wrap-mode ${imageTextWrap ? 'active' : ''}" title="${imageTextWrap ? 'Text wraps around image' : 'Image overlaps text'}">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M3 12h18"></path>
                <path d="M3 18h18"></path>
                <rect x="15" y="10" width="6" height="4" rx="1"></rect>
              </svg>
            </button>
            <button class="mode-button opacity-mode" title="Adjust opacity">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 2a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 10 10 0 0 1 0-20z"></path>
              </svg>
            </button>
            <button class="mode-button delete-mode" title="Delete image">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
                <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
            </button>
          </div>
          <div class="control-divider"></div>
          <div class="image-settings opacity-settings" style="display: none;">
            <div class="setting-item">
              <label class="setting-label">Opacity</label>
              <div class="opacity-control">
                <input type="range" class="opacity-slider" min="10" max="100" value="${imageOpacity}" title="Image opacity">
                <span class="opacity-value">${imageOpacity}%</span>
              </div>
            </div>
          </div>
        </div>
      `;
      
      // Position the controls near the image
      const imgRect = img.getBoundingClientRect();
      const editorRect = editor.getBoundingClientRect();
      const scrollLeft = editor.scrollLeft || 0;
      const scrollTop = editor.scrollTop || 0;
      
      controls.style.position = 'absolute';
      
      // Calculate position relative to editor with scroll offset
      // Position at the top of the selected image (not the editor)
      const editorPadding = 10;
      let topPos = imgRect.top - editorRect.top + scrollTop - 50; // 50px above the image
      
      // Ensure it doesn't go above the editor's top boundary
      topPos = Math.max(editorPadding, topPos);
      
      // Center horizontally relative to the image
      let leftPos = imgRect.left - editorRect.left + scrollLeft + (imgRect.width / 2) - 90;
      
      // Ensure controls don't go outside editor bounds with better constraints
      const controlsWidth = 210; // Width for all buttons including delete
      
      // Constrain horizontal position
      if (leftPos < editorPadding) {
        leftPos = editorPadding;
      } else if (leftPos + controlsWidth > editorRect.width - editorPadding) {
        leftPos = editorRect.width - controlsWidth - editorPadding;
      }
      
      controls.style.top = `${topPos}px`;
      controls.style.left = `${leftPos}px`;
      controls.style.zIndex = '100';
      controls.style.maxWidth = '100%';
      controls.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.25)';
      
      // Add to editor
      editor.appendChild(controls);
      
      // Add event listeners to the mode buttons
      const moveBtn = controls.querySelector('.move-mode') as HTMLButtonElement;
      const resizeBtn = controls.querySelector('.resize-mode') as HTMLButtonElement;
      const wrapBtn = controls.querySelector('.wrap-mode') as HTMLButtonElement;
      const opacityBtn = controls.querySelector('.opacity-mode') as HTMLButtonElement;
      const deleteBtn = controls.querySelector('.delete-mode') as HTMLButtonElement;
      const opacitySettings = controls.querySelector('.opacity-settings') as HTMLDivElement;
      const opacitySlider = controls.querySelector('.opacity-slider') as HTMLInputElement;
      
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
      
      // Handle text wrap button
      if (wrapBtn) {
        wrapBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const newWrapValue = !imageTextWrap;
          setImageTextWrap(newWrapValue);
          
          // Store current position values before changing wrap mode
          const currentLeft = parseInt(img.style.left) || 0;
          const currentTop = parseInt(img.style.top) || 0;
          
          // Update image CSS and data attribute based on text wrap setting
          img.setAttribute('data-text-wrap', newWrapValue.toString());
          
          if (newWrapValue) {
            // Text wraps around image - use float layout
            img.style.float = 'left';
            img.style.margin = '0 1rem 1rem 0';
            img.style.position = 'relative';
            img.style.zIndex = '1';
            img.style.maxWidth = '50%';
            
            // Keep the current position if it was set
            if (currentLeft !== 0 || currentTop !== 0) {
              img.style.left = `${currentLeft}px`;
              img.style.top = `${currentTop}px`;
            }
          } else {
            // Image overlaps text - use absolute positioning
            img.style.float = 'none';
            img.style.margin = '0';
            img.style.position = 'absolute';
            img.style.zIndex = '10';
            img.style.maxWidth = '80%';
            
            // Keep the current position if it was set
            if (currentLeft !== 0 || currentTop !== 0) {
              img.style.left = `${currentLeft}px`;
              img.style.top = `${currentTop}px`;
            } else {
              img.style.left = '0px';
              img.style.top = '0px';
            }
          }
          
          // Update button appearance
          wrapBtn.classList.toggle('active', newWrapValue);
          wrapBtn.title = newWrapValue ? 'Text wraps around image' : 'Image overlaps text';
        });
      }
      
      // Handle opacity button
      if (opacityBtn && opacitySettings) {
        opacityBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          // Toggle opacity settings visibility
          const isVisible = opacitySettings.style.display === 'block';
          opacitySettings.style.display = isVisible ? 'none' : 'block';
          opacityBtn.classList.toggle('active', !isVisible);
        });
      }
      
      // Handle delete button
      if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (confirm('Are you sure you want to delete this image?')) {
            img.remove();
            setSelectedImage(null);
            setActiveMode(null);
            
            // Remove the controls
            const controls = document.querySelectorAll('.image-mode-controls');
            controls.forEach(control => control.remove());
          }
        });
      }
      
      // Handle opacity slider
      if (opacitySlider) {
        opacitySlider.addEventListener('input', (e) => {
          e.stopPropagation();
          const opacityValue = parseInt((e.target as HTMLInputElement).value);
          setImageOpacity(opacityValue);
          
          // Update image opacity
          img.style.opacity = (opacityValue / 100).toString();
          
          // Update opacity display
          const opacityDisplay = controls.querySelector('.opacity-value');
          if (opacityDisplay) {
            opacityDisplay.textContent = `${opacityValue}%`;
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
          
          // Apply constraints
          const constraints = constrainImageToBounds(currentImage, undefined, undefined, newWidth, newHeight);
          currentImage.style.width = `${constraints.width}px`;
          currentImage.style.height = `${constraints.height}px`;
        } else {
          // Resize freely with constraints
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = Math.max(50, startHeight + deltaY);
          
          const constraints = constrainImageToBounds(currentImage, undefined, undefined, newWidth, newHeight);
          currentImage.style.width = `${constraints.width}px`;
          currentImage.style.height = `${constraints.height}px`;
        }
      } else if (dragging) {
        // Move the image with bounds checking
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newLeft = initialLeft + deltaX;
        const newTop = initialTop + deltaY;
        
        // Apply constraints
        const constraints = constrainImageToBounds(currentImage, newLeft, newTop);
        currentImage.style.left = `${constraints.left}px`;
        currentImage.style.top = `${constraints.top}px`;
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
        const opacitySettings = controls.querySelector('.opacity-settings') as HTMLDivElement;
        
        if (moveBtn && resizeBtn) {
          moveBtn.classList.toggle('active', mode === 'move');
          resizeBtn.classList.toggle('active', mode === 'resize');
          
          // Hide opacity settings when changing modes
          if (opacitySettings) {
            opacitySettings.style.display = 'none';
            const opacityBtn = controls.querySelector('.opacity-mode') as HTMLButtonElement;
            if (opacityBtn) {
              opacityBtn.classList.remove('active');
            }
          }
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
      
      // Global keyboard shortcuts for selected images regardless of mode
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this image?')) {
          selectedImg.remove();
          setSelectedImage(null);
          setActiveMode(null);
          
          // Remove the controls
          const controls = document.querySelectorAll('.image-mode-controls');
          controls.forEach(control => control.remove());
        }
        return;
      }
      
      // Handle mode switching with keyboard
      if (e.ctrlKey) {
        switch (e.key) {
          case 'm': // Ctrl+M for move mode
            e.preventDefault();
            setActiveMode('move');
            updateModeUI(selectedImg, 'move');
            return;
          case 'r': // Ctrl+R for resize mode
            e.preventDefault();
            setActiveMode('resize');
            updateModeUI(selectedImg, 'resize');
            return;
          case 'w': // Ctrl+W for toggling text wrap
            e.preventDefault();
            const newWrapValue = !imageTextWrap;
            setImageTextWrap(newWrapValue);
            
            // Store current position values before changing wrap mode
            const currentLeft = parseInt(selectedImg.style.left) || 0;
            const currentTop = parseInt(selectedImg.style.top) || 0;
            
            // Update image CSS and data attribute based on text wrap setting
            selectedImg.setAttribute('data-text-wrap', newWrapValue.toString());
            
            if (newWrapValue) {
              // Text wraps around image - use float layout
              selectedImg.style.float = 'left';
              selectedImg.style.margin = '0 1rem 1rem 0';
              selectedImg.style.position = 'relative';
              selectedImg.style.zIndex = '1';
              selectedImg.style.maxWidth = '50%';
              
              // Keep the current position if it was set
              if (currentLeft !== 0 || currentTop !== 0) {
                selectedImg.style.left = `${currentLeft}px`;
                selectedImg.style.top = `${currentTop}px`;
              }
            } else {
              // Image overlaps text - use absolute positioning
              selectedImg.style.float = 'none';
              selectedImg.style.margin = '0';
              selectedImg.style.position = 'absolute';
              selectedImg.style.zIndex = '10';
              selectedImg.style.maxWidth = '80%';
              
              // Keep the current position if it was set
              if (currentLeft !== 0 || currentTop !== 0) {
                selectedImg.style.left = `${currentLeft}px`;
                selectedImg.style.top = `${currentTop}px`;
              } else {
                selectedImg.style.left = '0px';
                selectedImg.style.top = '0px';
              }
            }
            
            // Update button appearance in the UI
            const wrapBtn = editor.querySelector('.wrap-mode') as HTMLButtonElement;
            if (wrapBtn) {
              wrapBtn.classList.toggle('active', newWrapValue);
              wrapBtn.title = newWrapValue ? 'Text wraps around image' : 'Image overlaps text';
            }
            return;
        }
      }
      
      if (activeMode === 'move') {
        // Movement mode with arrow keys
        if (e.altKey) {
          const computedStyle = window.getComputedStyle(selectedImg);
          const currentLeft = parseInt(computedStyle.left) || 0;
          const currentTop = parseInt(computedStyle.top) || 0;
          
          switch (e.key) {
            case 'ArrowUp': // Move up
              e.preventDefault();
              const newTopUp = currentTop - moveStep;
              const constraintsUp = constrainImageToBounds(selectedImg, currentLeft, newTopUp);
              selectedImg.style.top = `${constraintsUp.top}px`;
              break;
            case 'ArrowDown': // Move down
              e.preventDefault();
              const newTopDown = currentTop + moveStep;
              const constraintsDown = constrainImageToBounds(selectedImg, currentLeft, newTopDown);
              selectedImg.style.top = `${constraintsDown.top}px`;
              break;
            case 'ArrowLeft': // Move left
              e.preventDefault();
              const newLeftLeft = currentLeft - moveStep;
              const constraintsLeft = constrainImageToBounds(selectedImg, newLeftLeft, currentTop);
              selectedImg.style.left = `${constraintsLeft.left}px`;
              break;
            case 'ArrowRight': // Move right
              e.preventDefault();
              const newLeftRight = currentLeft + moveStep;
              const constraintsRight = constrainImageToBounds(selectedImg, newLeftRight, currentTop);
              selectedImg.style.left = `${constraintsRight.left}px`;
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
              const newHeightUp = currentHeight + resizeStep;
              const constraintsHeightUp = constrainImageToBounds(selectedImg, undefined, undefined, currentWidth, newHeightUp);
              selectedImg.style.height = `${constraintsHeightUp.height}px`;
              break;
            case 'ArrowDown': // Decrease height
              e.preventDefault();
              const newHeightDown = Math.max(50, currentHeight - resizeStep);
              const constraintsHeightDown = constrainImageToBounds(selectedImg, undefined, undefined, currentWidth, newHeightDown);
              selectedImg.style.height = `${constraintsHeightDown.height}px`;
              break;
            case 'ArrowRight': // Increase width
              e.preventDefault();
              const newWidthRight = currentWidth + resizeStep;
              const constraintsWidthRight = constrainImageToBounds(selectedImg, undefined, undefined, newWidthRight, currentHeight);
              selectedImg.style.width = `${constraintsWidthRight.width}px`;
              break;
            case 'ArrowLeft': // Decrease width
              e.preventDefault();
              const newWidthLeft = Math.max(50, currentWidth - resizeStep);
              const constraintsWidthLeft = constrainImageToBounds(selectedImg, undefined, undefined, newWidthLeft, currentHeight);
              selectedImg.style.width = `${constraintsWidthLeft.width}px`;
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
    
    // Set global styles for selected images and containment
    const styleElement = document.createElement('style');
    styleElement.textContent = `
      img.selected-for-resize, img.dragging, img.resizing {
        outline: 2px solid var(--ghost-neon) !important;
        outline-offset: 2px !important;
        border: none !important;
      }
      
      /* Ensure all images in the editor are contained */
      .prose-editor img {
        max-width: 100% !important;
        height: auto !important;
        object-fit: contain !important;
        box-sizing: border-box !important;
        display: block !important;
      }
      
      /* Ensure absolutely positioned images stay within bounds */
      .prose-editor img[style*="position: absolute"] {
        max-width: calc(100% - 40px) !important;
        max-height: calc(100% - 40px) !important;
      }
      
      /* Additional containment for the editor */
      .prose-editor {
        overflow: hidden !important;
        word-wrap: break-word !important;
      }
    `;
    document.head.appendChild(styleElement);

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
    
    // Handle window resize to ensure images stay within bounds
    const handleWindowResize = () => {
      // Add a small delay to ensure the editor size has fully updated
      setTimeout(() => {
        const images = editor.querySelectorAll('img.resizable');
        images.forEach((img) => {
          const imgElement = img as HTMLImageElement;
          
          // Get current dimensions and position
          const currentLeft = parseInt(imgElement.style.left) || 0;
          const currentTop = parseInt(imgElement.style.top) || 0;
          const currentWidth = imgElement.offsetWidth;
          const currentHeight = imgElement.offsetHeight;
          
          // Update the max-width for all images based on new editor dimensions
          const editorPadding = 20;
          const maxWidth = editor.clientWidth - (editorPadding * 2);
          
          // Update max-width for all images
          imgElement.style.maxWidth = `${maxWidth}px`;
          
          // Recalculate constraints based on new editor dimensions
          const constraints = constrainImageToBounds(
            imgElement, 
            currentLeft, 
            currentTop, 
            currentWidth, 
            currentHeight
          );
          
          // Apply the updated constraints
          imgElement.style.left = `${constraints.left}px`;
          imgElement.style.top = `${constraints.top}px`;
          imgElement.style.width = `${constraints.width}px`;
          imgElement.style.height = `${constraints.height}px`;
        });
      }, 100);
    };
    
    window.addEventListener('resize', handleWindowResize);
    
    // Cleanup
    return () => {
      observer.disconnect();
      editor.removeEventListener('click', handleEditorClick);
      editor.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowResize);
    };
  }, [activeMode, hasSeenHelp, imageTextWrap, imageOpacity]);

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
          className="min-h-[80vh] p-6 md:p-8 bg-ghost-dark/80 rounded-lg border border-ghost-gray/50 focus:outline-none focus:ring-1 focus:ring-ghost-purple/50 focus:border-ghost-purple/30 transition-all duration-200 text-white prose-editor overflow-hidden"
          data-placeholder="Start writing your masterpiece..."
          style={{ caretColor: 'var(--ghost-neon)', position: 'relative' }}
        />

        {/* Image resize/move help */}
        {showResizeHelp && (!hasSeenHelp || manualHelp) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
              onClick={() => {
                setShowResizeHelp(false);
                setManualHelp(false);
                setHasSeenHelp(true);
                localStorage.setItem('ghostnote-help-seen', 'true');
              }}
            />
            
            {/* Help Modal Scroll Container */}
            <div className="relative w-full max-w-sm sm:max-w-md my-4 sm:my-8 mx-auto">
              <div className="relative flex flex-col bg-gradient-to-br from-ghost-dark via-ghost-gray to-ghost-dark border border-ghost-purple/30 rounded-xl sm:rounded-2xl shadow-2xl shadow-ghost-purple/20 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 max-h-[90vh] overflow-y-auto">
                {/* Close Button */}
                <button
                  onClick={() => {
                    setShowResizeHelp(false);
                    setManualHelp(false);
                    setHasSeenHelp(true);
                    localStorage.setItem('ghostnote-help-seen', 'true');
                  }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1.5 sm:p-2 rounded-full hover:bg-ghost-purple/20 transition-colors duration-200 z-10 focus:outline-none focus:ring-0"
                >
                  <X className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400 hover:text-white" />
                </button>

                {/* Header */}
                <div className="p-6 sm:p-8 pb-4 sm:pb-6">
                  <h2 className="text-3xl sm:text-4xl font-bold text-center bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent mb-1 sm:mb-2">
                    Image Interaction Controls
                  </h2>
                  <p className="text-center text-gray-400 text-sm sm:text-base">
                    Learn how to manage images in your GhostNote
                  </p>
                </div>

                {/* Content */}
                <div className="px-6 sm:px-8 pb-6 space-y-5">
                  <div className="bg-ghost-black/70 p-4 sm:p-5 rounded-lg border border-ghost-cyan/30 relative overflow-hidden mb-4 sm:mb-5">
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-cyan/10 rounded-full blur-xl"></div>
                    <h5 className="text-ghost-cyan font-medium mb-3 text-sm sm:text-base flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-ghost-cyan rounded-full"></span>
                      Move Mode
                    </h5>
                    <div className="space-y-2.5 text-xs sm:text-sm">
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
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-cyan">•</span>
                        <span><span className="text-ghost-cyan font-medium">Ctrl+M</span> shortcut for move mode</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-cyan">•</span>
                        <span><span className="text-ghost-cyan font-medium">Delete</span> to remove image</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-ghost-black/70 p-4 sm:p-5 rounded-lg border border-ghost-neon/30 relative overflow-hidden mb-4 sm:mb-5">
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-neon/10 rounded-full blur-xl"></div>
                    <h5 className="text-ghost-neon font-medium mb-3 text-sm sm:text-base flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-ghost-neon rounded-full"></span>
                      Resize Mode
                    </h5>
                    <div className="space-y-2.5 text-xs sm:text-sm">
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
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-neon">•</span>
                        <span><span className="text-ghost-neon font-medium">Ctrl+R</span> shortcut for resize mode</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-neon">•</span>
                        <span><span className="text-ghost-neon font-medium">Alt+R</span> to reset size</span>
                      </p>
                    </div>
                  </div>

                  <div className="bg-ghost-black/70 p-4 sm:p-5 rounded-lg border border-ghost-purple/30 relative overflow-hidden mb-4 sm:mb-5">
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-purple/10 rounded-full blur-xl"></div>
                    <h5 className="text-ghost-purple font-medium mb-3 text-sm sm:text-base flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-ghost-purple rounded-full"></span>
                      Keyboard Shortcuts
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-purple">•</span>
                        <span><span className="text-ghost-purple font-medium">Ctrl+M</span> Move mode</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-purple">•</span>
                        <span><span className="text-ghost-purple font-medium">Ctrl+R</span> Resize mode</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-purple">•</span>
                        <span><span className="text-ghost-purple font-medium">Ctrl+W</span> Toggle text wrap</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-purple">•</span>
                        <span><span className="text-ghost-purple font-medium">Alt+Arrows</span> Move/resize</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-purple">•</span>
                        <span><span className="text-ghost-purple font-medium">Alt+R</span> Reset size/position</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-purple">•</span>
                        <span><span className="text-ghost-purple font-medium">Delete</span> Remove image</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-ghost-black/70 p-4 sm:p-5 rounded-lg border border-ghost-cyan/30 relative overflow-hidden mb-4 sm:mb-5">
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-cyan/10 rounded-full blur-xl"></div>
                    <h5 className="text-ghost-cyan font-medium mb-3 text-sm sm:text-base flex items-center gap-1.5">
                      <span className="inline-block w-1.5 h-1.5 bg-ghost-cyan rounded-full"></span>
                      Image Controls
                    </h5>
                    <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm">
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-cyan">•</span>
                        <span><span className="text-ghost-cyan font-medium">Text Wrap Icon</span> Toggle text flow</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-cyan">•</span>
                        <span><span className="text-ghost-cyan font-medium">Opacity Icon</span> Adjust transparency</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <span className="text-ghost-cyan">•</span>
                        <span><span className="text-ghost-cyan font-medium">Delete Icon</span> Remove image</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-center mt-4 mb-5 bg-ghost-black/30 rounded-lg py-3 border border-ghost-purple/20">
                    <p className="text-sm text-ghost-purple/90">
                      <span className="text-ghost-purple font-medium">Alt+R</span> to reset size or position
                    </p>
                  </div>
                </div>

                <div className="px-6 sm:px-8 pb-6 sm:pb-8">
                  <button 
                    onClick={() => {
                      setShowResizeHelp(false);
                      setManualHelp(false);
                      setHasSeenHelp(true);
                      // Save to localStorage directly for extra assurance
                      localStorage.setItem('ghostnote-help-seen', 'true');
                    }}
                    className="w-full px-4 py-3 text-sm font-medium text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)]"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateNoteForm;
