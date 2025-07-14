import { useState, useCallback } from 'react';
import { FormattingState, UseFormattingReturn } from '../types';

export function useFormatting(): UseFormattingReturn {
  const [activeFormats, setActiveFormats] = useState<string[]>([]);
  const [formattingState, setFormattingState] = useState<FormattingState>({
    isBold: false,
    isItalic: false,
    isUnderline: false,
    isStrikethrough: false,
    fontSize: '16',
    textAlign: 'left',
    fontFamily: 'Arial'
  });

  const executeCommand = useCallback((command: string, value?: string) => {
    // Execute formatting command
    try {
      if (document.queryCommandSupported && document.queryCommandSupported(command)) {
        document.execCommand(command, false, value);
      }
    } catch {
      console.warn('Document command not supported:', command);
    }
  }, []);

  const checkFormatting = useCallback(() => {
    // Check current formatting state and return active formats
    const formats: string[] = [];
    try {
      if (document.queryCommandState && document.queryCommandState('bold')) {
        formats.push('bold');
      }
      if (document.queryCommandState && document.queryCommandState('italic')) {
        formats.push('italic');
      }
    } catch {
      console.warn('Could not check formatting state');
    }
    setActiveFormats(formats);
    return formats;
  }, []);

  const updateFormatting = useCallback((format: keyof FormattingState, value: any) => {
    setFormattingState(prev => ({
      ...prev,
      [format]: value
    }));
  }, []);

  const toggleFormat = useCallback((format: keyof FormattingState) => {
    setFormattingState(prev => ({
      ...prev,
      [format]: !prev[format]
    }));
  }, []);

  const resetFormatting = useCallback(() => {
    setFormattingState({
      isBold: false,
      isItalic: false,
      isUnderline: false,
      isStrikethrough: false,
      fontSize: '16',
      textAlign: 'left',
      fontFamily: 'Arial'
    });
    setActiveFormats([]);
  }, []);

  return {
    activeFormats,
    executeCommand,
    checkFormatting,
    formattingState,
    updateFormatting,
    toggleFormat,
    resetFormatting
  };
}
