import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableHeader } from '@tiptap/extension-table-header';
import { TableCell } from '@tiptap/extension-table-cell';

export const TableExtensions = [
  Table.configure({
    resizable: true,
    allowTableNodeSelection: true,
    HTMLAttributes: {
      class: 'min-w-full divide-y divide-gray-300 border border-gray-300 my-4',
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: 'border-t border-gray-300',
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class: 'bg-gray-100 dark:bg-gray-800 font-semibold px-6 py-3 text-left',
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: 'px-6 py-4 whitespace-nowrap',
    },
  }),
];