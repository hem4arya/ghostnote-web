/**
 * Lexical editor configuration for GhostNote
 * Centralized configuration for all editor instances
 * TEMPORARILY SIMPLIFIED DUE TO VERSION CONFLICTS
 */

import type { InitialConfigType } from '@lexical/react/LexicalComposer';
import GhostNoteTheme from '../themes/GhostNoteTheme';

// Simplified configuration without conflicting nodes
const editorConfig: InitialConfigType = {
  namespace: 'GhostNote Editor',
  theme: GhostNoteTheme,
  onError: (error: Error) => {
    console.error('Lexical Editor Error:', error);
  },
  nodes: [
    // Temporarily removed all nodes due to version conflicts
    // Will be restored once Lexical dependencies are aligned
  ],
  editorState: null,
};

export default editorConfig; 