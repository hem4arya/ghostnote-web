import { Link } from '@tiptap/extension-link';

export const LinkExtension = Link.configure({
  protocols: ['http', 'https', 'mailto', 'tel'],
  autolink: true,
  openOnClick: false,
  linkOnPaste: true,
  HTMLAttributes: {
    rel: 'noopener noreferrer',
    class: 'text-blue-500 hover:text-blue-600 hover:underline',
  },
  validate: (url: string) => {
    // Basic URL validation
    try {
      const parsedUrl = new URL(url);
      // Only allow http, https, mailto, tel protocols
      return ['http:', 'https:', 'mailto:', 'tel:'].includes(parsedUrl.protocol);
    } catch {
      return false;
    }
  },
});