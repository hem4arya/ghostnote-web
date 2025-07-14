import { NoteFormData } from '../types';

export async function createNote(noteData: NoteFormData) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: Date.now().toString(),
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }, 1000);
  });
}

export async function updateNote(id: string, noteData: Partial<NoteFormData>) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        ...noteData,
        updatedAt: new Date()
      });
    }, 1000);
  });
}

export async function deleteNote(id: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ success: true });
    }, 500);
  });
}

export async function getNoteById(id: string) {
  // Simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        title: 'Sample Note',
        content: 'This is a sample note content.',
        category: 'General',
        tags: ['sample'],
        isPublic: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }, 500);
  });
}
