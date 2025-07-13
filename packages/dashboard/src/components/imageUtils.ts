// Function to show a temporary notification for mode changes
export const showModeNotification = (message: string) => {
  // Check if a notification already exists
  let notification = document.querySelector('.mode-notification');
  
  // If notification exists, remove it
  if (notification) {
    notification.remove();
  }
  
  // Create new notification
  notification = document.createElement('div');
  notification.className = 'mode-notification';
  notification.innerHTML = `<div class="notification-content">${message}</div>`;
  
  // Add to document
  document.body.appendChild(notification);
  
  // Remove after a delay
  setTimeout(() => {
    if (notification) {
      notification.classList.add('notification-hide');
      setTimeout(() => notification?.remove(), 300);
    }
  }, 1500);
};

// Helper function to constrain image within editor bounds
export const constrainImageToBounds = (
  img: HTMLImageElement,
  editor: HTMLDivElement,
  isMobile: boolean,
  newLeft?: number,
  newTop?: number,
  newWidth?: number,
  newHeight?: number
) => {
  const editorPadding = isMobile ? 10 : 20; // Smaller padding for mobile
  
  // Use editor's actual dimensions
  const editorWidth = editor.clientWidth;
  const editorHeight = editor.clientHeight;
  
  // Get current values or use provided ones
  const currentLeft = newLeft !== undefined ? newLeft : parseInt(img.style.left) || 0;
  const currentTop = newTop !== undefined ? newTop : parseInt(img.style.top) || 0;
  const currentWidth = newWidth !== undefined ? newWidth : img.offsetWidth;
  const currentHeight = newHeight !== undefined ? newHeight : img.offsetHeight;
  
  // Get actual content area dimensions (accounting for padding)
  const contentWidth = editorWidth - (editorPadding * 2);
  const contentHeight = editorHeight - (editorPadding * 2);
  
  // For absolutely positioned images, ensure they stay within bounds
  const maxLeft = Math.max(0, contentWidth - currentWidth);
  const maxTop = Math.max(0, contentHeight - currentHeight);
  
  // Strictly constrain within the editor bounds
  const constrainedLeft = Math.max(0, Math.min(currentLeft, maxLeft));
  const constrainedTop = Math.max(0, Math.min(currentTop, maxTop));
  
  // Calculate maximum allowed dimensions based on position
  const spaceToRightEdge = contentWidth - constrainedLeft;
  const spaceToBottomEdge = contentHeight - constrainedTop;
  
  // Strictly constrain width and height to fit within editor
  const constrainedWidth = Math.min(currentWidth, spaceToRightEdge);
  const constrainedHeight = Math.min(currentHeight, spaceToBottomEdge);
  
  // Ensure minimum size but respect bounds
  const finalWidth = Math.max(50, Math.min(constrainedWidth, contentWidth));
  const finalHeight = Math.max(50, Math.min(constrainedHeight, contentHeight));
  
  return {
    left: constrainedLeft,
    top: constrainedTop,
    width: finalWidth,
    height: finalHeight
  };
};
