import { useEffect } from 'react';
import { constrainImageToBounds, showModeNotification } from '@/utils/imageUtils';
import { injectImageStyles } from '@/styles/imageStyles';

interface UseImageInteractionProps {
  editorRef: React.RefObject<HTMLDivElement | null>;
  selectedImage: HTMLImageElement | null;
  setSelectedImage: (image: HTMLImageElement | null) => void;
  activeMode: 'move' | 'resize' | null;
  setActiveMode: (mode: 'move' | 'resize' | null) => void;
  imageTextWrap: boolean;
  setImageTextWrap: (wrap: boolean) => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  isMobile: boolean;
  showResizeHelp: boolean;
  setShowResizeHelp: (show: boolean) => void;
  hasSeenHelp: boolean;
}

export const useImageInteraction = ({
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
  setShowResizeHelp,
  hasSeenHelp
}: UseImageInteractionProps) => {
  
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
          img.draggable = false;
          
          // Add touch-friendly class for mobile devices
          if (isMobile) {
            img.classList.add('touch-friendly');
          }
          
          // Give the image a relative position if it doesn't have a position already
          if (window.getComputedStyle(img).position === 'static') {
            img.style.position = 'relative';
          }
          
          // Set initial constraints and text wrap
          img.style.boxSizing = 'border-box';
          img.style.minWidth = '50px';
          img.style.minHeight = '50px';
          img.style.border = 'none';
          
          // Apply strict dimensions to ensure images never overflow
          const editorPadding = 20;
          const maxWidth = editor.clientWidth - (editorPadding * 2);
          
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
            const constraints = constrainImageToBounds(img, editor, isMobile);
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
          } else {
            const shouldWrap = img.getAttribute('data-text-wrap') === 'true';
            if (shouldWrap) {
              img.style.float = 'left';
              img.style.margin = '0 1rem 1rem 0';
              img.style.position = 'relative';
              img.style.zIndex = '1';
              img.style.maxWidth = '50%';
            } else {
              img.style.float = 'none';
              img.style.margin = '0';
              img.style.position = 'absolute';
              img.style.zIndex = '10';
              img.style.maxWidth = '80%';
              
              if (!img.style.left && !img.style.top) {
                img.style.left = '0px';
                img.style.top = '0px';
              }
            }
          }
        }
      });
    };
    
    // Function to handle image clicks
    const handleEditorClick = (e: MouseEvent) => {
      const images = editor.querySelectorAll('img');
      
      if ((e.target as Element).tagName !== 'IMG') {
        images.forEach(img => {
          img.classList.remove('selected-for-resize');
          img.classList.remove('dragging');
        });
        setSelectedImage(null);
        setActiveMode(null);
        setShowResizeHelp(false);
        return;
      }
      
      const img = e.target as HTMLImageElement;
      
      images.forEach(i => {
        i.classList.remove('selected-for-resize');
        i.classList.remove('dragging');
      });
      
      img.classList.add('selected-for-resize');
      setSelectedImage(img);
    };
    
    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      if ((e.target as Element).tagName === 'IMG' && (e.target as HTMLElement).classList.contains('selected-for-resize')) {
        e.preventDefault();
        currentImage = e.target as HTMLImageElement;
        startX = e.clientX;
        startY = e.clientY;
        
        const computedStyle = window.getComputedStyle(currentImage);
        initialLeft = parseInt(computedStyle.left) || 0;
        initialTop = parseInt(computedStyle.top) || 0;
        
        currentImage.classList.remove('resizing');
        
        if (activeMode === 'move') {
          dragging = true;
          document.body.style.cursor = 'move';
          currentImage.classList.add('dragging');
        } else if (activeMode === 'resize') {
          resizing = true;
          startWidth = currentImage.clientWidth;
          startHeight = currentImage.clientHeight;
          currentImage.classList.add('resizing');
        }
        
        document.body.classList.add('resize-in-progress');
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!currentImage) return;
      
      if (resizing) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        if (e.shiftKey) {
          const aspectRatio = startWidth / startHeight;
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = newWidth / aspectRatio;
          
          const constraints = constrainImageToBounds(currentImage, editor, isMobile, undefined, undefined, newWidth, newHeight);
          currentImage.style.width = `${constraints.width}px`;
          currentImage.style.height = `${constraints.height}px`;
        } else {
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = Math.max(50, startHeight + deltaY);
          
          const constraints = constrainImageToBounds(currentImage, editor, isMobile, undefined, undefined, newWidth, newHeight);
          currentImage.style.width = `${constraints.width}px`;
          currentImage.style.height = `${constraints.height}px`;
        }
      } else if (dragging) {
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        const newLeft = initialLeft + deltaX;
        const newTop = initialTop + deltaY;
        
        const constraints = constrainImageToBounds(currentImage, editor, isMobile, newLeft, newTop);
        currentImage.style.left = `${constraints.left}px`;
        currentImage.style.top = `${constraints.top}px`;
      }
    };
    
    const handleMouseUp = () => {
      if (currentImage) {
        currentImage.classList.remove('resizing');
        document.body.style.cursor = '';
        document.body.classList.remove('resize-in-progress');
        
        resizing = false;
        dragging = false;
        currentImage = null;
      }
    };
    
    // Touch event handlers
    let touchStartX = 0;
    let touchStartY = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      if ((e.target as Element).tagName === 'IMG' && (e.target as HTMLElement).classList.contains('selected-for-resize')) {
        e.preventDefault();
        
        const touch = e.touches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
        currentImage = e.target as HTMLImageElement;
        
        const computedStyle = window.getComputedStyle(currentImage);
        initialLeft = parseInt(computedStyle.left) || 0;
        initialTop = parseInt(computedStyle.top) || 0;
        
        currentImage.classList.remove('resizing');
        
        if (activeMode === 'move') {
          dragging = true;
          currentImage.classList.add('dragging');
        } else if (activeMode === 'resize') {
          resizing = true;
          startWidth = currentImage.clientWidth;
          startHeight = currentImage.clientHeight;
          currentImage.classList.add('resizing');
        }
        
        document.body.classList.add('resize-in-progress');
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!currentImage) return;
      
      if (dragging || resizing) {
        e.preventDefault();
        
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        if (resizing) {
          const deltaX = touchX - touchStartX;
          const aspectRatio = startWidth / startHeight;
          const newWidth = Math.max(50, startWidth + deltaX);
          const newHeight = newWidth / aspectRatio;
          
          const constraints = constrainImageToBounds(currentImage, editor, isMobile, undefined, undefined, newWidth, newHeight);
          currentImage.style.width = `${constraints.width}px`;
          currentImage.style.height = `${constraints.height}px`;
        } else if (dragging) {
          const deltaX = touchX - touchStartX;
          const deltaY = touchY - touchStartY;
          
          const newLeft = initialLeft + deltaX;
          const newTop = initialTop + deltaY;
          
          const constraints = constrainImageToBounds(currentImage, editor, isMobile, newLeft, newTop);
          currentImage.style.left = `${constraints.left}px`;
          currentImage.style.top = `${constraints.top}px`;
        }
      }
    };
    
    const handleTouchEnd = () => {
      if (currentImage) {
        currentImage.classList.remove('resizing');
        document.body.classList.remove('resize-in-progress');
        
        resizing = false;
        dragging = false;
        currentImage = null;
      }
    };
    
    // Keyboard event handler
    const handleKeyDown = (e: KeyboardEvent) => {
      const selectedImg = editor.querySelector('img.selected-for-resize') as HTMLImageElement;
      if (!selectedImg) return;
      
      const STEP = 10;
      const SMALL_STEP = 2;
      const moveStep = e.shiftKey ? SMALL_STEP : STEP;
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        if (confirm('Are you sure you want to delete this image?')) {
          selectedImg.remove();
          setSelectedImage(null);
          setActiveMode(null);
        }
        return;
      }
      
      if (e.ctrlKey) {
        switch (e.key) {
          case 'm':
            e.preventDefault();
            setActiveMode('move');
            selectedImg.classList.add('dragging');
            selectedImg.classList.remove('resizing');
            return;
          case 'r':
            e.preventDefault();
            setActiveMode('resize');
            selectedImg.classList.remove('dragging');
            selectedImg.classList.add('selected-for-resize');
            return;
          case 'w':
            e.preventDefault();
            const newWrapValue = !imageTextWrap;
            setImageTextWrap(newWrapValue);
            
            const currentLeft = parseInt(selectedImg.style.left) || 0;
            const currentTop = parseInt(selectedImg.style.top) || 0;
            
            selectedImg.setAttribute('data-text-wrap', newWrapValue.toString());
            
            if (newWrapValue) {
              selectedImg.style.float = 'left';
              selectedImg.style.margin = '0 1rem 1rem 0';
              selectedImg.style.position = 'relative';
              selectedImg.style.zIndex = '1';
              selectedImg.style.maxWidth = '50%';
              
              if (currentLeft !== 0 || currentTop !== 0) {
                selectedImg.style.left = `${currentLeft}px`;
                selectedImg.style.top = `${currentTop}px`;
              }
            } else {
              selectedImg.style.float = 'none';
              selectedImg.style.margin = '0';
              selectedImg.style.position = 'absolute';
              selectedImg.style.zIndex = '10';
              selectedImg.style.maxWidth = '80%';
              
              if (currentLeft !== 0 || currentTop !== 0) {
                selectedImg.style.left = `${currentLeft}px`;
                selectedImg.style.top = `${currentTop}px`;
              } else {
                selectedImg.style.left = '0px';
                selectedImg.style.top = '0px';
              }
            }
            return;
        }
      }
      
      if (activeMode === 'move') {
        if (e.altKey) {
          const computedStyle = window.getComputedStyle(selectedImg);
          const currentLeft = parseInt(computedStyle.left) || 0;
          const currentTop = parseInt(computedStyle.top) || 0;
          
          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              const newTopUp = currentTop - moveStep;
              const constraintsUp = constrainImageToBounds(selectedImg, editor, isMobile, currentLeft, newTopUp);
              selectedImg.style.top = `${constraintsUp.top}px`;
              break;
            case 'ArrowDown':
              e.preventDefault();
              const newTopDown = currentTop + moveStep;
              const constraintsDown = constrainImageToBounds(selectedImg, editor, isMobile, currentLeft, newTopDown);
              selectedImg.style.top = `${constraintsDown.top}px`;
              break;
            case 'ArrowLeft':
              e.preventDefault();
              const newLeftLeft = currentLeft - moveStep;
              const constraintsLeft = constrainImageToBounds(selectedImg, editor, isMobile, newLeftLeft, currentTop);
              selectedImg.style.left = `${constraintsLeft.left}px`;
              break;
            case 'ArrowRight':
              e.preventDefault();
              const newLeftRight = currentLeft + moveStep;
              const constraintsRight = constrainImageToBounds(selectedImg, editor, isMobile, newLeftRight, currentTop);
              selectedImg.style.left = `${constraintsRight.left}px`;
              break;
            case 'r':
              e.preventDefault();
              selectedImg.style.left = '0';
              selectedImg.style.top = '0';
              break;
          }
        }
      } else if (activeMode === 'resize') {
        if (e.altKey) {
          const currentWidth = selectedImg.width;
          const currentHeight = selectedImg.height;
          const resizeStep = e.shiftKey ? SMALL_STEP : STEP;
          
          switch (e.key) {
            case 'ArrowUp':
              e.preventDefault();
              const newHeightUp = currentHeight + resizeStep;
              const constraintsHeightUp = constrainImageToBounds(selectedImg, editor, isMobile, undefined, undefined, currentWidth, newHeightUp);
              selectedImg.style.height = `${constraintsHeightUp.height}px`;
              break;
            case 'ArrowDown':
              e.preventDefault();
              const newHeightDown = Math.max(50, currentHeight - resizeStep);
              const constraintsHeightDown = constrainImageToBounds(selectedImg, editor, isMobile, undefined, undefined, currentWidth, newHeightDown);
              selectedImg.style.height = `${constraintsHeightDown.height}px`;
              break;
            case 'ArrowRight':
              e.preventDefault();
              const newWidthRight = currentWidth + resizeStep;
              const constraintsWidthRight = constrainImageToBounds(selectedImg, editor, isMobile, undefined, undefined, newWidthRight, currentHeight);
              selectedImg.style.width = `${constraintsWidthRight.width}px`;
              break;
            case 'ArrowLeft':
              e.preventDefault();
              const newWidthLeft = Math.max(50, currentWidth - resizeStep);
              const constraintsWidthLeft = constrainImageToBounds(selectedImg, editor, isMobile, undefined, undefined, newWidthLeft, currentHeight);
              selectedImg.style.width = `${constraintsWidthLeft.width}px`;
              break;
            case 'r':
              e.preventDefault();
              selectedImg.style.width = '';
              selectedImg.style.height = '';
              break;
          }
        }
      }
    };
    
    // Inject styles
    const styleElement = injectImageStyles();
    
    // Initialize functionality
    makeImagesInteractive();
    
    // Create observer for new images
    const observer = new MutationObserver(() => {
      makeImagesInteractive();
    });
    
    observer.observe(editor, { childList: true, subtree: true });
    
    // Add event listeners
    editor.addEventListener('click', handleEditorClick);
    editor.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('keydown', handleKeyDown);
    
    editor.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    // Handle window resize
    const handleWindowResize = () => {
      setTimeout(() => {
        const images = editor.querySelectorAll('img.resizable');
        images.forEach((img) => {
          const imgElement = img as HTMLImageElement;
          
          const currentLeft = parseInt(imgElement.style.left) || 0;
          const currentTop = parseInt(imgElement.style.top) || 0;
          const currentWidth = imgElement.offsetWidth;
          const currentHeight = imgElement.offsetHeight;
          
          const editorPadding = 20;
          const maxWidth = editor.clientWidth - (editorPadding * 2);
          
          imgElement.style.maxWidth = `${maxWidth}px`;
          
          const constraints = constrainImageToBounds(
            imgElement,
            editor,
            isMobile,
            currentLeft,
            currentTop,
            currentWidth,
            currentHeight
          );
          
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
      
      editor.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      
      window.removeEventListener('resize', handleWindowResize);
      
      if (styleElement.parentNode) {
        styleElement.parentNode.removeChild(styleElement);
      }
    };
  }, [
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
    setShowResizeHelp,
    hasSeenHelp
  ]);
  
  // Update UI when active mode changes
  useEffect(() => {
    if (selectedImage && activeMode) {
      if (activeMode === 'move') {
        selectedImage.classList.add('dragging');
        selectedImage.classList.remove('resizing');
        
        selectedImage.classList.add('mode-transition');
        setTimeout(() => selectedImage.classList.remove('mode-transition'), 600);
        
        if (isMobile) {
          showModeNotification('Move mode');
        }
      } else if (activeMode === 'resize') {
        selectedImage.classList.remove('dragging');
        selectedImage.classList.add('selected-for-resize');
        
        selectedImage.classList.add('mode-transition');
        setTimeout(() => selectedImage.classList.remove('mode-transition'), 600);
        
        if (isMobile) {
          showModeNotification('Resize mode');
        }
      }
    }
  }, [activeMode, selectedImage, isMobile]);
};
