import { useState } from 'react';
import type { UseImageStateReturn } from '../types';

export function useImageState(): UseImageStateReturn {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [activeMode, setActiveMode] = useState<'move' | 'resize' | null>(null);
  const [imageTextWrap, setImageTextWrap] = useState<'none' | 'left' | 'right' | 'center'>('none');
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [showResizeHelp, setShowResizeHelp] = useState<boolean>(false);
  const [hasSeenHelp, setHasSeenHelp] = useState<boolean>(false);

  return {
    selectedImage,
    setSelectedImage,
    activeMode,
    setActiveMode,
    imageTextWrap,
    setImageTextWrap,
    imageOpacity,
    setImageOpacity,
    showResizeHelp,
    setShowResizeHelp,
    hasSeenHelp,
    setHasSeenHelp
  };
}
