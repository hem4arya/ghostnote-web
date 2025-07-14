import { useEffect } from 'react';
import type { UseImageInteractionParams } from '../../types';

export function useImageInteraction({
  editorRef,
  selectedImage,
  setSelectedImage,
  activeMode,
  setActiveMode,
  imageTextWrap,
  imageOpacity,
  isMobile,
  setShowResizeHelp,
  hasSeenHelp
}: UseImageInteractionParams) {

  useEffect(() => {
    if (!editorRef.current) return;

    const editor = editorRef.current;
    
    const handleImageClick = (event: Event) => {
      const target = event.target as HTMLImageElement;
      if (target.tagName === 'IMG') {
        setSelectedImage(target);
        setActiveMode('move');
      }
    };

    const handleClickOutside = (event: Event) => {
      const target = event.target as HTMLElement;
      if (target.tagName !== 'IMG' && selectedImage) {
        setSelectedImage(null);
        setActiveMode(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImage) {
        switch (event.key) {
          case 'Delete':
          case 'Backspace':
            if (selectedImage.parentNode) {
              selectedImage.parentNode.removeChild(selectedImage);
              setSelectedImage(null);
              setActiveMode(null);
            }
            break;
          case 'Escape':
            setSelectedImage(null);
            setActiveMode(null);
            break;
        }
      }
    };

    editor.addEventListener('click', handleImageClick);
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      editor.removeEventListener('click', handleImageClick);
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [editorRef, selectedImage, setSelectedImage, setActiveMode]);

  // Apply image styles when properties change
  useEffect(() => {
    if (selectedImage) {
      selectedImage.style.opacity = imageOpacity.toString();
      
      // Apply text wrap styling
      selectedImage.style.float = imageTextWrap === 'none' ? 'none' : 
                                  imageTextWrap === 'center' ? 'none' : imageTextWrap;
      
      if (imageTextWrap === 'center') {
        selectedImage.style.display = 'block';
        selectedImage.style.margin = '0 auto';
      } else {
        selectedImage.style.display = 'inline';
        selectedImage.style.margin = imageTextWrap === 'left' ? '0 10px 10px 0' : '0 0 10px 10px';
      }
    }
  }, [selectedImage, imageTextWrap, imageOpacity]);

  const selectImage = (image: HTMLImageElement) => {
    setSelectedImage(image);
    setActiveMode('move');
  };

  const deselectImage = () => {
    setSelectedImage(null);
    setActiveMode(null);
  };

  const toggleMode = () => {
    if (activeMode === 'move') {
      setActiveMode('resize');
      if (!hasSeenHelp && !isMobile) {
        setShowResizeHelp(true);
      }
    } else {
      setActiveMode('move');
    }
  };

  return {
    selectImage,
    deselectImage,
    toggleMode
  };
}
