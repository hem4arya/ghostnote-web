import { useEffect } from 'react';
import { UseImageInteractionParams } from '../types';

export function useImageInteraction(params: UseImageInteractionParams) {
  const { imageElement, containerElement, onUpdate } = params;

  useEffect(() => {
    if (!imageElement || !containerElement) return;

    const handleImageClick = () => {
      if (onUpdate) {
        onUpdate(imageElement);
      }
    };

    imageElement.addEventListener('click', handleImageClick);

    return () => {
      imageElement.removeEventListener('click', handleImageClick);
    };
  }, [imageElement, containerElement, onUpdate]);

  return {
    // Return interaction utilities if needed
  };
}
