import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Italic,
  List,
  ListOrdered,
  Underline,
} from "lucide-react";
import * as React from "react";
import { Button } from "../../components/ui/button";
import type { FormattingToolbarProps } from "../../types";

// React 19 compatibility wrappers
const BoldIcon = Bold as React.ElementType;
const ItalicIcon = Italic as React.ElementType;
const UnderlineIcon = Underline as React.ElementType;
const ListIcon = List as React.ElementType;
const ListOrderedIcon = ListOrdered as React.ElementType;
const AlignLeftIcon = AlignLeft as React.ElementType;
const AlignCenterIcon = AlignCenter as React.ElementType;
const AlignRightIcon = AlignRight as React.ElementType;

export default function FormattingToolbar({
  activeFormats = [],
  executeCommand,
}: FormattingToolbarProps) {
  const handleFormat = (format: string) => {
    executeCommand(format);
  };

  const formatButtons = [
    { command: "bold", icon: BoldIcon, label: "Bold" },
    { command: "italic", icon: ItalicIcon, label: "Italic" },
    { command: "underline", icon: UnderlineIcon, label: "Underline" },
  ];

  const listButtons = [
    { command: "insertUnorderedList", icon: ListIcon, label: "Bullet List" },
    {
      command: "insertOrderedList",
      icon: ListOrderedIcon,
      label: "Numbered List",
    },
  ];

  const alignButtons = [
    { command: "justifyLeft", icon: AlignLeftIcon, label: "Align Left" },
    { command: "justifyCenter", icon: AlignCenterIcon, label: "Align Center" },
    { command: "justifyRight", icon: AlignRightIcon, label: "Align Right" },
  ];

  return (
    <div className="flex gap-1 p-3 border-b border-ghost-purple/10 bg-ghost-dark/50">
      {/* Text Formatting */}
      <div className="flex gap-1">
        {formatButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant={activeFormats.includes(command) ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFormat(command)}
            className={
              activeFormats.includes(command)
                ? "bg-ghost-purple/30 text-white border-ghost-purple/50"
                : "text-gray-300 hover:bg-ghost-purple/20 hover:text-white"
            }
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="w-px bg-ghost-purple/20 mx-2" />

      {/* Lists */}
      <div className="flex gap-1">
        {listButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant={activeFormats.includes(command) ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFormat(command)}
            className={
              activeFormats.includes(command)
                ? "bg-ghost-purple/30 text-white border-ghost-purple/50"
                : "text-gray-300 hover:bg-ghost-purple/20 hover:text-white"
            }
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>

      <div className="w-px bg-ghost-purple/20 mx-2" />

      {/* Alignment */}
      <div className="flex gap-1">
        {alignButtons.map(({ command, icon: Icon, label }) => (
          <Button
            key={command}
            variant={activeFormats.includes(command) ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFormat(command)}
            className={
              activeFormats.includes(command)
                ? "bg-ghost-purple/30 text-white border-ghost-purple/50"
                : "text-gray-300 hover:bg-ghost-purple/20 hover:text-white"
            }
            title={label}
          >
            <Icon className="h-4 w-4" />
          </Button>
        ))}
      </div>
    </div>
  );
}
