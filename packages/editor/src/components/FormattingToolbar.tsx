"use client";

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
import React from "react";
import { Button } from "../../../ui-components/src/components/button";
import { FormattingToolbarProps } from "../types";

// React 19 compatibility wrappers
const AlignCenterIcon = AlignCenter as React.ElementType;
const AlignLeftIcon = AlignLeft as React.ElementType;
const AlignRightIcon = AlignRight as React.ElementType;
const BoldIcon = Bold as React.ElementType;
const ItalicIcon = Italic as React.ElementType;
const ListIcon = List as React.ElementType;
const ListOrderedIcon = ListOrdered as React.ElementType;
const UnderlineIcon = Underline as React.ElementType;

const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  activeFormats = [],
  executeCommand,
}) => {
  const formatButtons = [
    { command: "bold", icon: BoldIcon, label: "Bold" },
    { command: "italic", icon: ItalicIcon, label: "Italic" },
    { command: "underline", icon: UnderlineIcon, label: "Underline" },
    { command: "unordered-list", icon: ListIcon, label: "Bullet List" },
    { command: "ordered-list", icon: ListOrderedIcon, label: "Numbered List" },
    { command: "align-left", icon: AlignLeftIcon, label: "Align Left" },
    { command: "align-center", icon: AlignCenterIcon, label: "Align Center" },
    { command: "align-right", icon: AlignRightIcon, label: "Align Right" },
  ];

  const handleFormat = (command: string) => {
    if (executeCommand) {
      executeCommand(command);
    }
  };

  return (
    <div className="flex items-center space-x-2 p-2 border-b border-gray-200 bg-white">
      {formatButtons.map(({ command, icon: Icon, label }) => (
        <Button
          key={command}
          variant={activeFormats.includes(command) ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFormat(command)}
          className="p-2"
          title={label}
        >
          <Icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
};

export default FormattingToolbar;
