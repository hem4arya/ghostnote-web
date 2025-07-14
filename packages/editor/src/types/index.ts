// Editor component prop types and interfaces

export interface FormattingState {
  activeFormats?: string[];
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  fontSize: string | number;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  alignment?: 'left' | 'center' | 'right' | 'justify';
  fontFamily?: string;
  textColor?: string;
  backgroundColor?: string;
}

export interface EditorToolbarProps {
  onFormatText: (format: keyof FormattingState) => void;
  formattingState: FormattingState;
  onInsertList: (type: 'bullet' | 'numbered') => void;
  onInsertLink: () => void;
  onInsertImage: () => void;
  disabled?: boolean;
}

export interface FormattingToolbarProps {
  activeFormats: string[];
  executeCommand: (command: string) => void;
}

export interface ImageToolboxProps {
  selectedImage?: HTMLImageElement | null;
  imageTextWrap?: 'none' | 'left' | 'right' | 'center';
  setImageTextWrap?: (wrap: 'none' | 'left' | 'right' | 'center') => void;
  imageOpacity?: number;
  setImageOpacity?: (opacity: number) => void;
  activeMode?: 'move' | 'resize' | 'rotate' | null;
  setActiveMode?: (mode: 'move' | 'resize' | 'rotate' | null) => void;
  onHelpClick?: () => void;
}

export interface WordCountWidgetProps {
  wordCount: number;
  charCount?: number;
  characterCount?: number; // Alternative naming
  readingTime?: number;
  target?: number;
}

export interface EditorHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  setTitle?: (title: string) => void; // Alternative naming
  onSave: () => void;
  onPublish: () => void;
  onBackClick?: () => void; // Navigation callback
  isSaving?: boolean;
  isPublishing?: boolean;
  isDirty?: boolean; // Has unsaved changes
  lastSaved?: Date;
  children?: React.ReactNode; // For additional elements
}

// Editor configuration types
export interface EditorConfig {
  placeholder?: string;
  readOnly?: boolean;
  autoFocus?: boolean;
  spellCheck?: boolean;
  maxLength?: number;
}

// Content types
export interface EditorContent {
  title: string;
  body: string;
  wordCount: number;
  charCount: number;
  lastModified: Date;
}

// Hook return types
export interface UseFormattingReturn {
  activeFormats: string[];
  executeCommand: (command: string, value?: string) => void;
  checkFormatting: () => string[];
  formattingState: FormattingState;
  updateFormatting?: (format: keyof FormattingState, value: any) => void;
  toggleFormat?: (format: keyof FormattingState) => void;
  resetFormatting?: () => void;
}

export interface UseImageInteractionParams {
  editorRef: React.RefObject<HTMLElement>;
  selectedImage: HTMLImageElement | null;
  setSelectedImage: (image: HTMLImageElement | null) => void;
  activeMode: 'move' | 'resize' | 'rotate' | null;
  setActiveMode: (mode: 'move' | 'resize' | 'rotate' | null) => void;
  imageTextWrap: 'none' | 'left' | 'right' | 'center';
  imageOpacity: number;
  isMobile: boolean;
  setShowResizeHelp: (show: boolean) => void;
  hasSeenHelp: boolean;
  imageElement?: HTMLImageElement | null;
  containerElement?: HTMLElement | null;
  onUpdate?: (element: HTMLImageElement) => void;
}

export interface UseImageStateReturn {
  selectedImage: HTMLImageElement | null;
  setSelectedImage: (image: HTMLImageElement | null) => void;
  activeMode: 'move' | 'resize' | 'rotate' | null;
  setActiveMode: (mode: 'move' | 'resize' | 'rotate' | null) => void;
  imageTextWrap: 'none' | 'left' | 'right' | 'center';
  setImageTextWrap: (wrap: 'none' | 'left' | 'right' | 'center') => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  showResizeHelp: boolean;
  setShowResizeHelp: (show: boolean) => void;
  hasSeenHelp: boolean;
  setHasSeenHelp: (seen: boolean) => void;
  imagePosition?: { x: number; y: number };
  setImagePosition?: (position: { x: number; y: number }) => void;
  imageSize?: { width: number; height: number };
  setImageSize?: (size: { width: number; height: number }) => void;
}

export interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

export interface NoteFormData {
  id?: string;
  title: string;
  content: string;
  category?: string;
  tags?: string[];
  isPublic?: boolean;
  isPrivate?: boolean;
  isPremium?: boolean;
  price?: number;
  description?: string;
}

// Export all types for easy importing
export type {
  FormattingState as EditorFormattingState,
  EditorToolbarProps as ToolbarProps,
  ImageToolboxProps as ImageProps,
  WordCountWidgetProps as WordCountProps,
  EditorHeaderProps as HeaderProps
};
