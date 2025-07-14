import { useState, useCallback } from 'react';
import { UseImageStateReturn } from '../types';

export function useImageState(): UseImageStateReturn {
  const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
  const [activeMode, setActiveMode] = useState<'move' | 'resize' | 'rotate' | null>(null);
  const [imageTextWrap, setImageTextWrap] = useState<'none' | 'left' | 'right' | 'center'>('none');
  const [imageOpacity, setImageOpacity] = useState<number>(1);
  const [showResizeHelp, setShowResizeHelp] = useState<boolean>(false);
  const [hasSeenHelp, setHasSeenHelp] = useState<boolean>(false);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 200, height: 150 });

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
    setHasSeenHelp,
    imagePosition,
    setImagePosition,
    imageSize,
    setImageSize
  };
}
