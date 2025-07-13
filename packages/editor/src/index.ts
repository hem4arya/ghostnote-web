// Export main editor components and related utilities/hooks
export * from './components/editor'; // Main editor component
export * from './components/editor-toolbar'; // Toolbar
export * from './components/LexicalEditor'; // Lexical specific
export * from './components/SimpleEditor'; // Simple editor
export * from './components/EditorHeader';
export * from './components/FormattingToolbar';
export * from './components/HelpModal';
export * from './components/ImageToolbox';
export * from './components/WordCountWidget';

export * from './hooks/useFormatting';
export * from './hooks/useImageInteraction';
export * from './hooks/useImageState';
export * from './hooks/useResponsive';
export * from './hooks/useSaveNote';

export * from './logic/noteApi'; // If noteApi is editor-specific