import { useState } from 'react';

export function useImageState() {
  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeMode, setActiveMode] = useState<'view' | 'edit'>('view');
  const [imageTextWrap, setImageTextWrap] = useState<'left' | 'right' | 'center'>('left');
  const [imageOpacity, setImageOpacity] = useState<number>(1);

  const addImage = (imageUrl: string) => {
    setImages(prev => [...prev, imageUrl]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    try {
      // Mock upload - replace with actual upload logic
      const mockUrl = URL.createObjectURL(file);
      addImage(mockUrl);
      return mockUrl;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    images,
    isUploading,
    selectedImage,
    setSelectedImage,
    activeMode,
    setActiveMode,
    imageTextWrap,
    setImageTextWrap,
    imageOpacity,
    setImageOpacity,
    addImage,
    removeImage,
    uploadImage
  };
}
