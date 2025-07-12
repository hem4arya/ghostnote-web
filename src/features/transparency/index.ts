// Main transparency feature exports
export { CloneTransparencyBadge } from './components/CloneTransparencyBadge';
export { CloneTransparencyWrapper } from './components/CloneTransparencyWrapper';
export { CloneTransparencyWrapperDev } from './components/CloneTransparencyWrapperDev';
export { CloneWarningModal } from './components/CloneWarningModal';
export { CloneAlerts } from './components/CloneAlerts';

// Hooks
export { useTransparencyData } from './hooks/useTransparencyData';

// Utils
export { 
  fetchNoteTransparency, 
  fetchNoteTransparencyWithCache, 
  clearTransparencyCache 
} from './utils/transparencyApi';
export { 
  shouldShowProminentTransparency,
  getOriginalityDescription,
  getPurchaseWarning,
  formatTransparencyForCard
} from './utils/helpers';
export { 
  getMockTransparencyData, 
  mockApiDelay,
  sampleTransparencyData 
} from './utils/mockData';

// Types
export type { 
  TransparencyData,
  TransparencyBadgeData,
  OriginalNote,
  BuyerMessage,
  CloneTransparencyBadgeProps,
  CloneTransparencyWrapperProps
} from './types';
