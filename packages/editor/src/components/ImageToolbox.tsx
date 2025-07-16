"use client";

import {
  Image as ImageIcon,
  Move,
  RotateCw,
  Square,
  Trash2,
  Upload,
} from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";
import { ImageToolboxProps } from "../types";

// React 19 compatibility wrappers
const MoveIcon = Move as React.ElementType;
const RotateCwIcon = RotateCw as React.ElementType;
const SquareIcon = Square as React.ElementType;
const Trash2Icon = Trash2 as React.ElementType;
const UploadIcon = Upload as React.ElementType;

const ImageToolbox: React.FC<ImageToolboxProps> = ({
  selectedImage,
  imageTextWrap = "none",
  setImageTextWrap,
  imageOpacity = 100,
  setImageOpacity,
  activeMode,
  setActiveMode,
  onHelpClick,
}) => {
  const wrapOptions = [
    { value: "none", label: "None" },
    { value: "left", label: "Left" },
    { value: "right", label: "Right" },
    { value: "center", label: "Center" },
  ];

  const modeButtons = [
    { mode: "move", icon: MoveIcon, label: "Move" },
    { mode: "resize", icon: SquareIcon, label: "Resize" },
    { mode: "rotate", icon: RotateCwIcon, label: "Rotate" },
  ];

  if (!selectedImage) {
    return null;
  }

  return (
    <div className="p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-sm font-medium mb-3">Image Tools</h3>

      <div className="space-y-4">
        {/* Text Wrap */}
        <div>
          <label className="text-xs text-gray-600 mb-2 block">Text Wrap</label>
          <div className="flex space-x-1">
            {wrapOptions.map(({ value, label }) => (
              <Button
                key={value}
                variant={imageTextWrap === value ? "default" : "outline"}
                size="sm"
                onClick={() => setImageTextWrap?.(value as any)}
                className="text-xs"
              >
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Opacity */}
        <div>
          <label className="text-xs text-gray-600 mb-2 block">
            Opacity: {imageOpacity}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={imageOpacity}
            onChange={(e) => setImageOpacity?.(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Mode Buttons */}
        <div>
          <label className="text-xs text-gray-600 mb-2 block">Mode</label>
          <div className="flex space-x-1">
            {modeButtons.map(({ mode, icon: Icon, label }) => (
              <Button
                key={mode}
                variant={activeMode === mode ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveMode?.(mode as any)}
                className="flex items-center space-x-1"
              >
                <Icon className="h-3 w-3" />
                <span className="text-xs">{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Help */}
        {onHelpClick && (
          <Button
            variant="outline"
            size="sm"
            onClick={onHelpClick}
            className="w-full text-xs"
          >
            Help
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageToolbox;
