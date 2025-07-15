import { HelpCircle, ImageIcon, Move, RotateCcw, Upload } from "lucide-react";
import * as React from "react";
import { Button } from "../../components/ui/button";
import type { ImageToolboxProps } from "../../types";

// React 19 compatibility wrappers
const UploadIcon = Upload as React.ElementType;
const ImageIconWrapper = ImageIcon as React.ElementType;
const MoveIcon = Move as React.ElementType;
const RotateCcwIcon = RotateCcw as React.ElementType;
const HelpCircleIcon = HelpCircle as React.ElementType;

export default function ImageToolbox({
  selectedImage,
  imageTextWrap = "none",
  setImageTextWrap,
  imageOpacity = 1,
  setImageOpacity,
  activeMode = null,
  setActiveMode,
  onHelpClick,
}: ImageToolboxProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Create image element and insert into editor
      const img = document.createElement("img");
      img.src = URL.createObjectURL(file);
      img.style.maxWidth = "100%";
      img.style.height = "auto";

      // Insert into editor (this would need proper editor reference)
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.insertNode(img);
        range.collapse(false);
      }
    }
  };

  return (
    <div className="p-4 border border-ghost-purple/20 rounded-lg bg-ghost-dark/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2 text-gray-200">
          <ImageIconWrapper className="h-4 w-4" />
          Image Tools
        </h3>
        <div className="flex gap-2">
          {onHelpClick && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onHelpClick}
              className="text-gray-400 hover:text-white"
            >
              <HelpCircleIcon className="h-4 w-4" />
            </Button>
          )}
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              className="border-ghost-purple/30 text-gray-300 hover:bg-ghost-purple/20"
              asChild
            >
              <span>
                <UploadIcon className="h-4 w-4 mr-1" />
                Upload
              </span>
            </Button>
          </label>
        </div>
      </div>

      {/* Image Controls - only show when image is selected */}
      {selectedImage && (
        <div className="mb-4 p-3 border border-ghost-purple/10 rounded bg-ghost-dark/50">
          <h4 className="text-sm font-medium mb-3 text-gray-200">
            Image Settings
          </h4>

          {/* Text Wrap Controls */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 mb-1 block">
              Text Wrap
            </label>
            <div className="flex gap-1">
              {[
                { value: "none", label: "None" },
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
                { value: "center", label: "Center" },
              ].map(({ value, label }) => (
                <Button
                  key={value}
                  variant={imageTextWrap === value ? "default" : "ghost"}
                  size="sm"
                  onClick={() =>
                    setImageTextWrap?.(
                      value as "none" | "left" | "right" | "center"
                    )
                  }
                  className={
                    imageTextWrap === value
                      ? "bg-ghost-purple/30 text-white"
                      : "text-gray-400 hover:text-white hover:bg-ghost-purple/20"
                  }
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Opacity Control */}
          <div className="mb-3">
            <label className="text-xs text-gray-400 mb-1 block">
              Opacity: {Math.round(imageOpacity * 100)}%
            </label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={imageOpacity}
              onChange={(e) => setImageOpacity?.(parseFloat(e.target.value))}
              className="w-full accent-ghost-purple"
            />
          </div>

          {/* Mode Controls */}
          <div className="flex gap-2">
            <Button
              variant={activeMode === "move" ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                setActiveMode?.(activeMode === "move" ? null : "move")
              }
              className={
                activeMode === "move"
                  ? "bg-ghost-purple/30 text-white"
                  : "text-gray-400 hover:text-white hover:bg-ghost-purple/20"
              }
            >
              <MoveIcon className="h-4 w-4 mr-1" />
              Move
            </Button>
            <Button
              variant={activeMode === "resize" ? "default" : "ghost"}
              size="sm"
              onClick={() =>
                setActiveMode?.(activeMode === "resize" ? null : "resize")
              }
              className={
                activeMode === "resize"
                  ? "bg-ghost-purple/30 text-white"
                  : "text-gray-400 hover:text-white hover:bg-ghost-purple/20"
              }
            >
              <RotateCcwIcon className="h-4 w-4 mr-1" />
              Resize
            </Button>
          </div>
        </div>
      )}

      {!selectedImage && (
        <div className="text-center py-6 text-gray-500">
          <ImageIconWrapper className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select an image to edit its properties</p>
        </div>
      )}
    </div>
  );
}
