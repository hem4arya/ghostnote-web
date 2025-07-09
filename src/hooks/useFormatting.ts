import { useState, useEffect, useCallback } from 'react';

interface ActiveFormats {
  bold: boolean;
  italic: boolean;
  underline: boolean;
  justifyLeft: boolean;
  justifyCenter: boolean;
  justifyRight: boolean;
  insertUnorderedList: boolean;
  insertOrderedList: boolean;
}

export const useFormatting = () => {
  const [activeFormats, setActiveFormats] = useState<ActiveFormats>({
    bold: false,
    italic: false,
    underline: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
    insertUnorderedList: false,
    insertOrderedList: false
  });

  const checkFormatting = useCallback(() => {
    if (typeof document !== 'undefined') {
      const selection = window.getSelection();
      let isInUnorderedList = false;
      let isInOrderedList = false;

      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        let node: Node | null = range.startContainer;
        
        // Traverse up the DOM to find if we're inside a list
        while (node && node !== document.body) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            if (element.tagName === 'UL') {
              isInUnorderedList = true;
              break;
            } else if (element.tagName === 'OL') {
              isInOrderedList = true;
              break;
            }
          }
          node = node.parentNode;
        }
      }

      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        insertUnorderedList: isInUnorderedList,
        insertOrderedList: isInOrderedList
      });
    }
  }, []);

  const removeListFormatting = useCallback((selection: Selection) => {
    if (selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    let node: Node | null = range.startContainer;
    let listElement: Element | null = null;
    let listItem: Element | null = null;

    // Find the list element and list item
    while (node && node !== document.body) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        if (element.tagName === 'LI' && !listItem) {
          listItem = element;
        }
        if ((element.tagName === 'UL' || element.tagName === 'OL') && !listElement) {
          listElement = element;
          break;
        }
      }
      node = node.parentNode;
    }

    if (listElement && listItem) {
      // Get the text content of the list item
      const textContent = listItem.textContent || '';
      // Create a text node with the content
      const textNode = document.createTextNode(textContent);
      // Insert the text node after the list
      listElement.parentNode?.insertBefore(textNode, listElement.nextSibling);
      // Remove the list item
      listItem.remove();
      // If the list is now empty, remove it
      if (listElement.children.length === 0) {
        listElement.remove();
      }
      // Place the cursor after the unwrapped text
      const newRange = document.createRange();
      newRange.setStartAfter(textNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
      // Force formatting state update
      setTimeout(() => checkFormatting(), 0);
    } else {
      // Fallback: try to use document.execCommand to remove list formatting
      try {
        document.execCommand('insertUnorderedList', false);
        document.execCommand('insertOrderedList', false);
      } catch {
        // If that fails, just insert the selected text as plain text
        const selectedText = selection.toString();
        if (selectedText) {
          document.execCommand('insertHTML', false, selectedText);
        }
      }
      setTimeout(() => checkFormatting(), 0);
    }
  }, [checkFormatting]);

  const executeCommand = useCallback((command: string, value?: string, editorRef?: React.RefObject<HTMLDivElement | null>) => {
    if (command === 'insertUnorderedList' || command === 'insertOrderedList') {
      const selection = window.getSelection();
      if (!selection || !editorRef?.current) return;

      const isUnorderedList = command === 'insertUnorderedList';
      const listType = isUnorderedList ? 'ul' : 'ol';
      
      // Check if we're already in a list
      const currentlyInList = isUnorderedList ? activeFormats.insertUnorderedList : activeFormats.insertOrderedList;
      
      if (currentlyInList) {
        // If we're in a list, remove the list formatting
        removeListFormatting(selection);
        checkFormatting();
        editorRef?.current?.focus();
        return;
      }

      if (selection.rangeCount === 0) {
        // No selection, insert a new list at cursor
        const range = selection.getRangeAt(0);
        const listElement = document.createElement(listType);
        const listItem = document.createElement('li');
        listItem.innerHTML = '&nbsp;';
        listElement.appendChild(listItem);
        
        range.insertNode(listElement);
        
        // Position cursor in the list item
        const newRange = document.createRange();
        newRange.setStart(listItem, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
        checkFormatting();
        editorRef?.current?.focus();
        return;
      }

      const range = selection.getRangeAt(0);
      const selectedText = range.toString().trim();

      if (selectedText) {
        // Convert selected text to list
        const lines = selectedText.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 1) {
          // Single line - create a simple list item
          const listElement = document.createElement(listType);
          const listItem = document.createElement('li');
          listItem.textContent = lines[0].trim();
          listElement.appendChild(listItem);
          
          range.deleteContents();
          range.insertNode(listElement);
        } else {
          // Multiple lines - create multiple list items
          const listElement = document.createElement(listType);
          
          lines.forEach((line) => {
            const listItem = document.createElement('li');
            listItem.textContent = line.trim();
            listElement.appendChild(listItem);
          });

          range.deleteContents();
          range.insertNode(listElement);
        }
        
        // Clear selection
        selection.removeAllRanges();
      } else {
        // No text selected, create empty list item
        const listElement = document.createElement(listType);
        const listItem = document.createElement('li');
        listItem.innerHTML = '&nbsp;';
        listElement.appendChild(listItem);
        
        range.insertNode(listElement);
        
        // Position cursor in the list item
        const newRange = document.createRange();
        newRange.setStart(listItem, 0);
        newRange.collapse(true);
        selection.removeAllRanges();
        selection.addRange(newRange);
      }
    } else {
      document.execCommand(command, false, value);
    }
    checkFormatting();
    editorRef?.current?.focus();
  }, [activeFormats, removeListFormatting, checkFormatting]);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const handleSelectionChange = () => {
      // Debounce the formatting check to avoid too many updates
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        checkFormatting();
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Add keyboard shortcuts for lists
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'L') {
          e.preventDefault();
          executeCommand('insertUnorderedList');
        } else if (e.key === 'O') {
          e.preventDefault();
          executeCommand('insertOrderedList');
        }
      }
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('selectionchange', handleSelectionChange);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [executeCommand, checkFormatting]);

  return {
    activeFormats,
    checkFormatting,
    executeCommand
  };
};
