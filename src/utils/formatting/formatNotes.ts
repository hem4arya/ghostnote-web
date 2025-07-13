import { sampleNotes } from '../../../packages/notes/src/data/sampleNotes';
import { createExactLengthText } from './textUtils';

// For each note, ensure the preview text is exactly 200 characters
export function formatSampleNotes() {
  const formattedNotes = sampleNotes.map(note => {
    const exactText = createExactLengthText(note.previewText, 200);
    return {
      ...note,
      previewText: exactText
    };
  });

  // Log the formatted notes for debugging
  console.log(JSON.stringify(formattedNotes, null, 2));
  
  return formattedNotes;
}
