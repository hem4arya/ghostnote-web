export const imageInteractionStyles = `
  img.selected-for-resize, img.dragging, img.resizing {
    outline: 2px solid var(--ghost-neon) !important;
    outline-offset: 2px !important;
    border: none !important;
  }
  
  /* Mode transition effect */
  img.mode-transition {
    animation: pulse-outline 0.6s ease-in-out;
  }
  
  @keyframes pulse-outline {
    0%, 100% { outline-color: var(--ghost-neon); outline-width: 2px; }
    50% { outline-color: var(--ghost-cyan); outline-width: 3px; }
  }
  
  /* Mode notification toast */
  .mode-notification {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(20, 20, 30, 0.9);
    border: 1px solid var(--ghost-purple);
    border-radius: 6px;
    padding: 8px 16px;
    color: var(--ghost-neon);
    font-size: 14px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    opacity: 1;
    transition: opacity 0.3s ease;
  }
  
  .notification-hide {
    opacity: 0;
  }
  
  /* Ensure all images in the editor are contained */
  .prose-editor img {
    max-width: 100% !important;
    height: auto !important;
    object-fit: contain !important;
    box-sizing: border-box !important;
    display: block !important;
  }
  
  /* Ensure absolutely positioned images stay within bounds */
  .prose-editor img[style*="position: absolute"] {
    max-width: calc(100% - 40px) !important;
    max-height: calc(100% - 40px) !important;
  }
  
  /* Additional containment for the editor */
  .prose-editor {
    overflow: hidden !important;
    word-wrap: break-word !important;
  }
  
  /* Animation for flashing effect */
  @keyframes flash {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  /* Class to apply the flashing animation */
  .animate-flash {
    animation: flash 0.6s ease-in-out;
  }
  
  /* Touch-friendly styles for mobile devices */
  img.touch-friendly {
    min-width: 80px !important;
    min-height: 80px !important;
  }
  
  img.touch-friendly.selected-for-resize,
  img.touch-friendly.dragging {
    outline: 3px solid var(--ghost-neon) !important;
    outline-offset: 3px !important;
  }
  
  /* Add subtle hint for touch users */
  @media (max-width: 768px) {
    .prose-editor img:not(.selected-for-resize):not(.dragging):active {
      outline: 2px dotted var(--ghost-cyan) !important;
      outline-offset: 2px !important;
      animation: pulse-light 0.5s ease-in-out;
    }
    
    @keyframes pulse-light {
      0%, 100% { outline-color: var(--ghost-cyan); }
      50% { outline-color: var(--ghost-neon); }
    }
  }
`;

export const injectImageStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.textContent = imageInteractionStyles;
  document.head.appendChild(styleElement);
  return styleElement;
};
