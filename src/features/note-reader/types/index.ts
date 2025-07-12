export interface Note {
  id: number;
  title?: string;
  tags?: string[];
  content?: string;
  price?: string | number;
  isLocked?: boolean;
  isEncrypted?: boolean;
  author?: string;
  created_at?: string;
  word_count?: number;
  read_time?: number;
}

export type AccessType = 'free' | 'premium' | 'encrypted' | 'private';

export type ColorScheme = 'light' | 'dark' | 'sepia';

export interface ReaderSettings {
  fontSize: number;
  lineHeight: number;
  colorScheme: ColorScheme;
  showSidebar: boolean;
}

export interface UseNoteAccessReturn {
  note: Note | null;
  loading: boolean;
  error: string | null;
  hasAccess: boolean;
  accessType: AccessType;
  checkAccess: () => Promise<void>;
}

export interface UseReaderSettingsReturn {
  fontSize: number;
  lineHeight: number;
  colorScheme: ColorScheme;
  showSidebar: boolean;
  setFontSize: (size: number) => void;
  setLineHeight: (height: number) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  toggleSidebar: () => void;
}

export interface ReaderHeaderProps {
  note: Note;
  onToggleSidebar: () => void;
  colorScheme: ColorScheme;
  onColorSchemeChange: (scheme: ColorScheme) => void;
}

export interface ReaderContentProps {
  note: Note;
  fontSize: number;
  lineHeight: number;
  colorScheme: ColorScheme;
}

export interface ReaderSidebarProps {
  note: Note;
  fontSize: number;
  lineHeight: number;
  onFontSizeChange: (size: number) => void;
  onLineHeightChange: (height: number) => void;
}

export interface LoadingStateProps {
  message?: string;
}

export interface ErrorStateProps {
  error?: string | null;
  onRetry?: () => void;
}
