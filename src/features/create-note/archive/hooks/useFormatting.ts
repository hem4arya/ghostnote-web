import { useState } from 'react';
import type { UseFormattingReturn, FormattingState } from '../types';

export function useFormatting(): UseFormattingReturn {
  const [, setIsFormatting] = useState(false);
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [formattingState, setFormattingState] = useState<FormattingState>({
    activeFormats: [],
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    alignment: 'left',
    fontSize: 16,
    textColor: '#ffffff',
    backgroundColor: 'transparent'
  });

  const executeCommand = (command: string, value?: string) => {
    setIsFormatting(true);
    
    // Execute document command if possible
    try {
      if (document.queryCommandSupported && document.queryCommandSupported(command)) {
        document.execCommand(command, false, value);
      }
    } catch {
      console.warn('Document command not supported:', command);
    }
    
    // Update active formats
    if (activeFormats.includes(command)) {
      setActiveFormats(prev => prev.filter(f => f !== command));
    } else {
      setActiveFormats(prev => [...prev, command]);
    }
    
    // Update formatting state
    setFormattingState(prev => ({
      ...prev,
      activeFormats: activeFormats.includes(command) 
        ? activeFormats.filter(f => f !== command)
        : [...activeFormats, command],
      isBold: command === 'bold' ? !prev.isBold : prev.isBold,
      isItalic: command === 'italic' ? !prev.isItalic : prev.isItalic,
      isUnderline: command === 'underline' ? !prev.isUnderline : prev.isUnderline,
      isStrikethrough: command === 'strikethrough' ? !prev.isStrikethrough : prev.isStrikethrough,
    }));
    
    setTimeout(() => setIsFormatting(false), 100);
  };

  const checkFormatting = () => {
    // Check current text formatting at cursor position
    try {
      const formats: string[] = [];
      if (document.queryCommandState('bold')) formats.push('bold');
      if (document.queryCommandState('italic')) formats.push('italic');
      if (document.queryCommandState('underline')) formats.push('underline');
      if (document.queryCommandState('strikeThrough')) formats.push('strikethrough');
      
      setActiveFormats(formats);
      setFormattingState(prev => ({
        ...prev,
        activeFormats: formats,
        isBold: formats.includes('bold'),
        isItalic: formats.includes('italic'),
        isUnderline: formats.includes('underline'),
        isStrikethrough: formats.includes('strikethrough'),
      }));
    } catch {
      console.warn('Could not check formatting state');
    }
    
    return activeFormats;
  };

  return {
    activeFormats,
    executeCommand,
    checkFormatting,
    formattingState
  };
}
