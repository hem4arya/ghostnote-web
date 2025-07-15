import { Bold, Italic, List, ListOrdered, Underline } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

// React 19 compatibility wrappers
const BoldIcon = Bold as React.ElementType;
const ItalicIcon = Italic as React.ElementType;
const UnderlineIcon = Underline as React.ElementType;
const ListIcon = List as React.ElementType;
const ListOrderedIcon = ListOrdered as React.ElementType;

interface FormattingToolbarProps {
  onFormat?: (format: string) => void;
  activeFormats?: string[];
  executeCommand?: (command: string, value?: string) => void;
}

export default function FormattingToolbar({
  onFormat,
  activeFormats = [],
  executeCommand,
}: FormattingToolbarProps) {
  const handleFormat = (format: string) => {
    onFormat?.(format);
    executeCommand?.(format);
  };

  return (
    <div className="flex gap-1 p-2 border-b">
      <Button
        variant={activeFormats.includes("bold") ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFormat("bold")}
      >
        <BoldIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={activeFormats.includes("italic") ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFormat("italic")}
      >
        <ItalicIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={activeFormats.includes("underline") ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFormat("underline")}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>
      <div className="w-px bg-border mx-1" />
      <Button
        variant={activeFormats.includes("ul") ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFormat("ul")}
      >
        <ListIcon className="h-4 w-4" />
      </Button>
      <Button
        variant={activeFormats.includes("ol") ? "default" : "ghost"}
        size="sm"
        onClick={() => handleFormat("ol")}
      >
        <ListOrderedIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
