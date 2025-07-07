export function createExactLengthText(text: string, length: number): string {
  if (text.length === length) {
    return text;
  }
  
  if (text.length > length) {
    return text.substring(0, length);
  }
  
  // If the text is too short, we need to pad it
  const padding = ' '.repeat(length - text.length);
  return text + padding;
}
