import { useState, useEffect } from 'react';

export interface ImageState {
  selectedImage: HTMLImageElement | null;
  activeMode: 'move' | 'resize' | null;
  imageTextWrap: boolean;
  imageOpacity: number;
}

export const useImageState = () => {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [activeMode, setActiveMode] = useState<'move' | 'resize' | null>(null);
  const [imageTextWrap, setImageTextWrap] = useState<boolean>(true);
  const [imageOpacity, setImageOpacity] = useState<number>(100);

  // Apply text wrap and opacity to selected image when they change
  useEffect(() => {
    if (selectedImage) {
      // Apply text wrap
      if (imageTextWrap) {
        // Text wraps around image - use float layout
        selectedImage.style.float = 'left';
        selectedImage.style.margin = '0 1rem 1rem 0';
        selectedImage.style.position = 'relative';
        selectedImage.style.zIndex = '1';
        selectedImage.style.maxWidth = '50%';
      } else {
        // Image overlaps text - use absolute positioning
        selectedImage.style.float = 'none';
        selectedImage.style.margin = '0';
        selectedImage.style.position = 'absolute';
        selectedImage.style.zIndex = '10';
        selectedImage.style.maxWidth = '80%';
        
        // Ensure image has position coordinates if not already set
        if (!selectedImage.style.left && !selectedImage.style.top) {
          selectedImage.style.left = '0px';
          selectedImage.style.top = '0px';
        }
      }
      
      // Apply opacity
      selectedImage.style.opacity = (imageOpacity / 100).toString();
    }
  }, [selectedImage, imageTextWrap, imageOpacity]);

  // Flash the image toolbox when an image is selected
  useEffect(() => {
    if (selectedImage) {
      const imageToolbox = document.querySelector('.image-toolbox');
      if (imageToolbox) {
        imageToolbox.classList.add('animate-flash');
        setTimeout(() => {
          imageToolbox.classList.remove('animate-flash');
        }, 600);
      }
    }
  }, [selectedImage]);

  return {
    selectedImage,
    setSelectedImage,
    activeMode,
    setActiveMode,
    imageTextWrap,
    setImageTextWrap,
    imageOpacity,
    setImageOpacity
  };
};
