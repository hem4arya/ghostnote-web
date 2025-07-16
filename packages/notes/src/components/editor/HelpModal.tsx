import React from 'react';
import { X } from 'lucide-react';

// React 19 compatibility wrappers
const XIcon = X as React.ElementType;

// React 19 compatibility wrapper

interface HelpModalProps {
  showResizeHelp: boolean;
  hasSeenHelp: boolean;
  manualHelp: boolean;
  isMobile: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  showResizeHelp,
  hasSeenHelp,
  manualHelp,
  isMobile,
  onClose
}) => {
  if (!showResizeHelp || (!hasSeenHelp && !manualHelp)) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Help Modal Scroll Container */}
      <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md my-2 sm:my-4 md:my-8 mx-auto">
        <div className="relative flex flex-col bg-gradient-to-br from-ghost-dark via-ghost-gray to-ghost-dark border border-ghost-purple/30 rounded-xl sm:rounded-2xl shadow-2xl shadow-ghost-purple/20 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 max-h-[85vh] sm:max-h-[90vh] overflow-y-auto">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 sm:top-3 right-2 sm:right-4 p-1 sm:p-1.5 rounded-full hover:bg-ghost-purple/20 transition-colors duration-200 z-10 focus:outline-none focus:ring-0"
          >
            <XIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 hover:text-white" />
          </button>

          {/* Tabs for mobile viewing */}
          {isMobile && (
            <div className="px-3 pt-3 pb-1 flex justify-between border-b border-ghost-gray/30">
              <button 
                className="px-2 py-1 text-xs rounded text-ghost-neon border-b-2 border-ghost-neon"
                onClick={(e) => {
                  e.preventDefault();
                  const moveSection = document.querySelector('.move-section');
                  if (moveSection) moveSection.scrollIntoView({behavior: 'smooth'});
                }}
              >
                Move
              </button>
              <button 
                className="px-2 py-1 text-xs rounded text-ghost-cyan"
                onClick={(e) => {
                  e.preventDefault();
                  const resizeSection = document.querySelector('.resize-section');
                  if (resizeSection) resizeSection.scrollIntoView({behavior: 'smooth'});
                }}
              >
                Resize
              </button>
              <button 
                className="px-2 py-1 text-xs rounded text-ghost-purple"
                onClick={(e) => {
                  e.preventDefault();
                  const shortcutsSection = document.querySelector('.shortcuts-section');
                  if (shortcutsSection) shortcutsSection.scrollIntoView({behavior: 'smooth'});
                }}
              >
                Shortcuts
              </button>
            </div>
          )}

          {/* Header */}
          <div className="p-4 sm:p-6 md:p-8 pb-2 sm:pb-4 md:pb-6">
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold text-center bg-gradient-to-r from-ghost-purple via-ghost-neon to-ghost-cyan bg-clip-text text-transparent mb-1 sm:mb-2">
              Image Interaction Controls
            </h2>
            <p className="text-center text-gray-400 text-xs sm:text-sm">
              Learn how to manage images in your GhostNote
            </p>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 space-y-3 sm:space-y-5">
            <div className="bg-ghost-black/70 p-3 sm:p-4 md:p-5 rounded-lg border border-ghost-cyan/30 relative overflow-hidden mb-2 sm:mb-3 md:mb-4 move-section">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-cyan/10 rounded-full blur-xl"></div>
              <h5 className="text-ghost-cyan font-medium mb-2 sm:mb-3 text-xs sm:text-sm md:text-base flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-ghost-cyan rounded-full"></span>
                Move Mode
              </h5>
              <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs md:text-sm">
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Click</span> an image to select it</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Choose Move</span> from the controls</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Drag</span> to reposition</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Alt+Arrows</span> for precision</span>
                </p>
              </div>
            </div>
            
            <div className="bg-ghost-black/70 p-3 sm:p-4 md:p-5 rounded-lg border border-ghost-neon/30 relative overflow-hidden mb-2 sm:mb-3 md:mb-4 resize-section">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-neon/10 rounded-full blur-xl"></div>
              <h5 className="text-ghost-neon font-medium mb-2 sm:mb-3 text-xs sm:text-sm md:text-base flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-ghost-neon rounded-full"></span>
                Resize Mode
              </h5>
              <div className="space-y-1.5 sm:space-y-2.5 text-[11px] sm:text-xs md:text-sm">
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-neon">•</span>
                  <span><span className="text-ghost-neon font-medium">Click</span> an image to select it</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-neon">•</span>
                  <span><span className="text-ghost-neon font-medium">Choose Resize</span> from the controls</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-neon">•</span>
                  <span><span className="text-ghost-neon font-medium">Drag corners</span> to resize</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-neon">•</span>
                  <span><span className="text-ghost-neon font-medium">Alt+Arrows</span> for precision resize</span>
                </p>
              </div>
            </div>

            <div className="bg-ghost-black/70 p-3 sm:p-4 md:p-5 rounded-lg border border-ghost-purple/30 relative overflow-hidden mb-2 sm:mb-3 md:mb-4 shortcuts-section">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-purple/10 rounded-full blur-xl"></div>
              <h5 className="text-ghost-purple font-medium mb-2 sm:mb-3 text-xs sm:text-sm md:text-base flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-ghost-purple rounded-full"></span>
                Keyboard Shortcuts
              </h5>
              <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-purple">•</span>
                  <span><span className="text-ghost-purple font-medium">Ctrl+M</span> Move mode</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-purple">•</span>
                  <span><span className="text-ghost-purple font-medium">Ctrl+R</span> Resize mode</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-purple">•</span>
                  <span><span className="text-ghost-purple font-medium">Ctrl+W</span> Toggle text wrap</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-purple">•</span>
                  <span><span className="text-ghost-purple font-medium">Alt+Arrows</span> Move/resize</span>
                </p>
              </div>
            </div>
            
            <div className="bg-ghost-black/70 p-3 sm:p-4 md:p-5 rounded-lg border border-ghost-cyan/30 relative overflow-hidden mb-2 sm:mb-3 md:mb-4">
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-ghost-cyan/10 rounded-full blur-xl"></div>
              <h5 className="text-ghost-cyan font-medium mb-2 sm:mb-3 text-xs sm:text-sm md:text-base flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 bg-ghost-cyan rounded-full"></span>
                Image Controls
              </h5>
              <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[11px] sm:text-xs md:text-sm">
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Text Wrap</span> Toggle text flow</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Opacity</span> Adjust transparency</span>
                </p>
                <p className="flex items-start gap-1.5">
                  <span className="text-ghost-cyan">•</span>
                  <span><span className="text-ghost-cyan font-medium">Delete</span> Remove image</span>
                </p>
              </div>
            </div>
            
            <div className="text-center mt-2 sm:mt-3 md:mt-4 mb-3 sm:mb-4 md:mb-5 bg-ghost-black/30 rounded-lg py-2 sm:py-3 border border-ghost-purple/20">
              <p className="text-[11px] sm:text-xs md:text-sm text-ghost-purple/90">
                <span className="text-ghost-purple font-medium">Delete</span> key to remove an image
              </p>
            </div>
          </div>

          <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
            <button 
              onClick={onClose}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium text-black bg-gradient-to-r from-ghost-cyan to-ghost-neon rounded-md hover:from-ghost-neon hover:to-ghost-cyan transition-colors shadow-[0_0_15px_rgba(0,255,65,0.3)]"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
