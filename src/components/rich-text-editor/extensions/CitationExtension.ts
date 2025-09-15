import Extension from '@tiptap/extension-text-align';

export const CitationExtension = Extension.configure({
  types: ['paragraph', 'heading'],
  alignments: ['left', 'center', 'right', 'justify'],
  defaultAlignment: 'left',
});