"use client";

import { HelpCircle, X } from "lucide-react";
import * as React from "react";
import { Button } from "./ui/button";

// React 19 compatibility wrappers
const HelpCircleIcon = HelpCircle as React.ElementType;
const XIcon = X as React.ElementType;

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { key: "Ctrl + B", action: "Bold text" },
    { key: "Ctrl + I", action: "Italic text" },
    { key: "Ctrl + U", action: "Underline text" },
    { key: "Ctrl + S", action: "Save note" },
    { key: "Ctrl + Enter", action: "Publish note" },
    { key: "Esc", action: "Close modal" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold flex items-center">
            <HelpCircleIcon className="h-5 w-5 mr-2" />
            Editor Help
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4">
          <h3 className="font-medium mb-3">Keyboard Shortcuts</h3>
          <div className="space-y-2">
            {shortcuts.map(({ key, action }) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {key}
                </span>
                <span className="text-gray-600">{action}</span>
              </div>
            ))}
          </div>

          <h3 className="font-medium mt-6 mb-3">Tips</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Use markdown syntax for quick formatting</li>
            <li>• Drag and drop images to insert them</li>
            <li>• Click on images to edit their properties</li>
            <li>• Auto-save happens every 30 seconds</li>
          </ul>
        </div>

        <div className="p-4 border-t">
          <Button onClick={onClose} className="w-full">
            Got it!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
