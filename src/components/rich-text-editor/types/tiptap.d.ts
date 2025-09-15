declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    math: {
      insertMath: () => ReturnType;
    };
    citation: {
      insertCitation: () => ReturnType;
    };
  }
}