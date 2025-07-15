"use client";

import { Lock, Save, Shield, X } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Textarea } from "./ui/textarea";

// React 19 compatibility wrappers
const XIcon = X as React.ElementType;
const SaveIcon = Save as React.ElementType;
const LockIcon = Lock as React.ElementType;
const ShieldIcon = Shield as React.ElementType;

interface Note {
  title?: string;
  tags?: string[];
  content?: string;
  price?: string | number;
  isLocked?: boolean;
  isEncrypted?: boolean;
}

interface NoteEditorProps {
  note?: Note;
  onClose: () => void;
}

const NoteEditor = ({ note, onClose }: NoteEditorProps) => {
  const [formData, setFormData] = useState({
    title: note?.title || "",
    tags: note?.tags?.join(", ") || "",
    content: note?.content || "",
    price: note?.price || "",
    isLocked: note?.isLocked || false,
    isEncrypted: note?.isEncrypted || false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle publish logic here
    console.log("Publishing note:", formData);
    onClose();
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden bg-ghost-dark border-ghost-purple/30 text-gray-200">
        <CardHeader className="flex flex-row items-center justify-between border-b border-ghost-purple/30 p-4">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-ghost-purple to-ghost-neon bg-clip-text text-transparent">
            {note ? "Edit Note" : "Create New Note"}
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XIcon className="h-5 w-5" />
          </Button>
        </CardHeader>

        <CardContent className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-400 font-medium">
                Title
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                placeholder="Enter note title..."
                className="bg-ghost-gray/50 border-ghost-purple/30 focus:bg-ghost-gray/80 text-lg"
                required
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-gray-400 font-medium">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="development, react, javascript (comma separated)"
                className="bg-ghost-gray/50 border-ghost-purple/30 focus:bg-ghost-gray/80"
              />
            </div>

            {/* Content Field */}
            <div className="space-y-2">
              <Label htmlFor="content" className="text-gray-400 font-medium">
                Content
              </Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder="Write your note content here..."
                className="bg-ghost-gray/50 border-ghost-purple/30 focus:bg-ghost-gray/80 min-h-[300px] resize-none"
                required
              />
            </div>

            {/* Price and Settings Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-gray-400 font-medium">
                  Price ($)
                </Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange("price", e.target.value)}
                  placeholder="29.99"
                  className="bg-ghost-gray/50 border-ghost-purple/30 focus:bg-ghost-gray/80"
                  required
                />
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <Label className="text-gray-400 font-medium">Settings</Label>

                {/* Lock Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-ghost-gray/20 border border-ghost-purple/30">
                  <div className="flex items-center gap-3">
                    <LockIcon className="h-4 w-4 text-ghost-purple" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        Lock Note
                      </p>
                      <p className="text-xs text-gray-400">
                        Require purchase to view
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isLocked}
                    onCheckedChange={(checked) =>
                      handleInputChange("isLocked", checked)
                    }
                  />
                </div>

                {/* Encrypt Toggle */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-ghost-gray/20 border border-ghost-purple/30">
                  <div className="flex items-center gap-3">
                    <ShieldIcon className="h-4 w-4 text-ghost-cyan" />
                    <div>
                      <p className="text-sm font-medium text-gray-200">
                        Encrypt Content
                      </p>
                      <p className="text-xs text-gray-400">
                        Extra security layer
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.isEncrypted}
                    onCheckedChange={(checked) =>
                      handleInputChange("isEncrypted", checked)
                    }
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-ghost-purple/30">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="lg"
                className="flex-1 bg-gradient-to-r from-ghost-purple to-ghost-neon hover:from-ghost-purple/80 hover:to-ghost-neon/80"
              >
                <SaveIcon className="mr-2 h-4 w-4" />
                {note ? "Update Note" : "Publish Note"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default NoteEditor;
