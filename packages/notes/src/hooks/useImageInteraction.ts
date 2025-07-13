import { useState, useEffect } from 'react';

interface ImageInteractionProps {
  editorRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  activeMode: 'view' | 'edit';
  setActiveMode: (mode: 'view' | 'edit') => void;
  imageTextWrap: 'left' | 'right' | 'center';
  setImageTextWrap: (wrap: 'left' | 'right' | 'center') => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  isMobile?: boolean;
  showResizeHelp?: boolean;
  setShowResizeHelp?: (show: boolean) => void;
  hasSeenHelp?: boolean;
}

export function useImageInteraction(props?: ImageInteractionProps) {
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (props?.selectedImage && props?.activeMode === 'edit') {
      setIsEditing(true);
    } else {
      setIsEditing(false);
    }
  }, [props?.selectedImage, props?.activeMode]);

  const selectImage = (imageUrl: string) => {
    props?.setSelectedImage(imageUrl);
  };

  const startEditing = () => {
    setIsEditing(true);
    props?.setActiveMode('edit');
  };

  const stopEditing = () => {
    setIsEditing(false);
    props?.setActiveMode('view');
    props?.setSelectedImage(null);
  };

  const deleteSelected = () => {
    if (props?.selectedImage) {
      // Delete logic would go here
      props?.setSelectedImage(null);
    }
  };

  return {
    selectedImage: props?.selectedImage,
    isEditing,
    selectImage,
    startEditing,
    stopEditing,
    deleteSelected
  };
}
