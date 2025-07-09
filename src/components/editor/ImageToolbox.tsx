import React from 'react';
import { HelpCircle } from 'lucide-react';

interface ImageToolboxProps {
  selectedImage: HTMLImageElement | null;
  imageTextWrap: boolean;
  setImageTextWrap: (wrap: boolean) => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  activeMode: 'move' | 'resize' | null;
  setActiveMode: (mode: 'move' | 'resize' | null) => void;
  onHelpClick: () => void;
}

export const ImageToolbox: React.FC<ImageToolboxProps> = ({
  selectedImage,
  imageTextWrap,
  setImageTextWrap,
  imageOpacity,
  setImageOpacity,
  activeMode,
  setActiveMode,
  onHelpClick
}) => {
  if (!selectedImage) return null;

  return (
    <>
      <div className="h-4 sm:h-5 w-px bg-ghost-gray/50" />
      <div className="flex flex-wrap items-center gap-0.5 border border-white/10 rounded-md px-1 sm:px-1.5 py-0.5 bg-ghost-dark/80 shadow-sm image-toolbox">
        <span className="text-[10px] sm:text-xs text-ghost-neon/70 mr-0.5 sm:mr-1 font-medium">Image</span>
        
        {/* Image Text Wrap Toggle */}
        <button 
          onClick={() => {
            const newWrapValue = !imageTextWrap;
            setImageTextWrap(newWrapValue);
            
            if (selectedImage) {
              if (newWrapValue) {
                selectedImage.style.float = 'left';
                selectedImage.style.margin = '0 1rem 1rem 0';
                selectedImage.style.position = 'relative';
                selectedImage.style.zIndex = '1';
                selectedImage.style.maxWidth = '50%';
              } else {
                selectedImage.style.float = 'none';
                selectedImage.style.margin = '0';
                selectedImage.style.position = 'absolute';
                selectedImage.style.zIndex = '10';
                selectedImage.style.maxWidth = '80%';
                
                if (!selectedImage.style.left && !selectedImage.style.top) {
                  selectedImage.style.left = '0px';
                  selectedImage.style.top = '0px';
                }
              }
            }
          }} 
          className={`p-0.5 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${imageTextWrap ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
          title={imageTextWrap ? "Image with text wrap" : "Image without text wrap"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
            <path d={imageTextWrap ? "M3 6h18M3 12h18M3 18h12" : "M3 6h18M9 12h12M3 12h3M3 18h18"}></path>
          </svg>
        </button>
        
        {/* Opacity Control */}
        <div className="flex items-center gap-0.5 sm:gap-1 px-1 sm:px-2">
          <span className="text-[10px] sm:text-xs text-gray-300">Opacity</span>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={imageOpacity} 
            onChange={(e) => {
              const newOpacity = parseInt(e.target.value);
              setImageOpacity(newOpacity);
              if (selectedImage) {
                selectedImage.style.opacity = (newOpacity / 100).toString();
              }
            }}
            className="w-12 sm:w-16 h-1.5 appearance-none bg-ghost-gray/50 rounded-full outline-none" 
          />
        </div>
        
        {/* Image Mode Selection */}
        <div className="flex items-center gap-0.5">
          <button 
            onClick={() => {
              setActiveMode('move');
              if (selectedImage) {
                selectedImage.classList.add('dragging');
                selectedImage.classList.remove('resizing');
              }
            }}
            className={`p-0.5 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeMode === 'move' ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
            title="Move image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
              <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l3-3 3 3M19 9l3 3-3 3M2 12h20M12 2v20"></path>
            </svg>
          </button>
          <button 
            onClick={() => {
              setActiveMode('resize');
              if (selectedImage) {
                selectedImage.classList.remove('dragging');
                selectedImage.classList.add('selected-for-resize');
              }
            }}
            className={`p-0.5 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 flex items-center focus:outline-none ${activeMode === 'resize' ? 'text-ghost-neon bg-ghost-purple/20' : 'text-gray-300'}`}
            title="Resize image"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5 sm:h-4 sm:w-4">
              <path d="M15 3h6v6M14 10l6.1-6.1M9 21H3v-6M10 14l-6.1 6.1"></path>
            </svg>
          </button>
          
          {/* Help Icon inside the image toolbox */}
          <button 
            onClick={onHelpClick}
            className="p-0.5 sm:p-1.5 rounded-md hover:bg-ghost-purple/20 focus:outline-none text-gray-300"
            aria-label="Toggle resize help"
          >
            <HelpCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </>
  );
};
