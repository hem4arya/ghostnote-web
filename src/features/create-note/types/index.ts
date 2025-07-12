export interface NoteFormData {
  title: string;
  content: string;
  tags: string[];
  isPrivate: boolean;
  isPremium: boolean;
  price?: number;
}

export interface EditorState {
  wordCount: number;
  characterCount: number;
  lastSaved: Date | null;
  focusMode: boolean;
  selectedImage: HTMLImageElement | null;
  isDirty: boolean;
}

export interface FormattingState {
  activeFormats: string[];
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  alignment: 'left' | 'center' | 'right' | 'justify';
  fontSize: number;
  textColor: string;
  backgroundColor: string;
}

export interface ImageState {
  selectedImage: HTMLImageElement | null;
  activeMode: 'move' | 'resize' | null;
  imageTextWrap: 'none' | 'left' | 'right' | 'center';
  imageOpacity: number;
  showResizeHelp: boolean;
  hasSeenHelp: boolean;
}

export interface UseFormattingReturn {
  activeFormats: string[];
  executeCommand: (command: string, value?: string) => void;
  checkFormatting: () => void;
  formattingState: FormattingState;
}

export interface UseImageStateReturn {
  selectedImage: HTMLImageElement | null;
  setSelectedImage: (image: HTMLImageElement | null) => void;
  activeMode: 'move' | 'resize' | null;
  setActiveMode: (mode: 'move' | 'resize' | null) => void;
  imageTextWrap: 'none' | 'left' | 'right' | 'center';
  setImageTextWrap: (wrap: 'none' | 'left' | 'right' | 'center') => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  showResizeHelp: boolean;
  setShowResizeHelp: (show: boolean) => void;
  hasSeenHelp: boolean;
  setHasSeenHelp: (seen: boolean) => void;
}

export interface UseResponsiveReturn {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  screenWidth: number;
}

export interface EditorHeaderProps {
  title: string;
  setTitle: (title: string) => void;
  lastSaved: Date | null;
  onBackClick?: () => void;
  isSaving?: boolean;
  isDirty?: boolean;
  onSave?: () => Promise<void>;
  onPublish?: () => Promise<void>;
  children?: React.ReactNode;
}

export interface FormattingToolbarProps {
  activeFormats: string[];
  executeCommand: (command: string, value?: string) => void;
}

export interface ImageToolboxProps {
  selectedImage: HTMLImageElement | null;
  imageTextWrap: 'none' | 'left' | 'right' | 'center';
  setImageTextWrap: (wrap: 'none' | 'left' | 'right' | 'center') => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  activeMode: 'move' | 'resize' | null;
  setActiveMode: (mode: 'move' | 'resize' | null) => void;
  onHelpClick: () => void;
}

export interface WordCountWidgetProps {
  wordCount: number;
  characterCount: number;
}

export interface UseImageInteractionParams {
  editorRef: React.RefObject<HTMLDivElement | null>;
  selectedImage: HTMLImageElement | null;
  setSelectedImage: (image: HTMLImageElement | null) => void;
  activeMode: 'move' | 'resize' | null;
  setActiveMode: (mode: 'move' | 'resize' | null) => void;
  imageTextWrap: 'none' | 'left' | 'right' | 'center';
  setImageTextWrap: (wrap: 'none' | 'left' | 'right' | 'center') => void;
  imageOpacity: number;
  setImageOpacity: (opacity: number) => void;
  isMobile: boolean;
  showResizeHelp: boolean;
  setShowResizeHelp: (show: boolean) => void;
  hasSeenHelp: boolean;
}
