import { useState, useEffect } from 'react';

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

  const checkFormatting = () => {
    if (typeof document !== 'undefined') {
      setActiveFormats({
        bold: document.queryCommandState('bold'),
        italic: document.queryCommandState('italic'),
        underline: document.queryCommandState('underline'),
        justifyLeft: document.queryCommandState('justifyLeft'),
        justifyCenter: document.queryCommandState('justifyCenter'),
        justifyRight: document.queryCommandState('justifyRight'),
        insertUnorderedList: document.queryCommandState('insertUnorderedList'),
        insertOrderedList: document.queryCommandState('insertOrderedList')
      });
    }
  };

  const executeCommand = (command: string, value?: string, editorRef?: React.RefObject<HTMLDivElement | null>) => {
    document.execCommand(command, false, value);
    checkFormatting();
    editorRef?.current?.focus();
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      checkFormatting();
    };
    
    document.addEventListener('selectionchange', handleSelectionChange);
    
    return () => {
      document.removeEventListener('selectionchange', handleSelectionChange);
    };
  }, []);

  return {
    activeFormats,
    checkFormatting,
    executeCommand
  };
};
