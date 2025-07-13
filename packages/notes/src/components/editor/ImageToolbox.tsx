import React from 'react';
import { Button } from 'packages/ui-components/src/components/button';
import { Upload, ImageIcon, Trash2 } from 'lucide-react';

interface ImageToolboxProps {
  images?: string[];
  onUpload?: (file: File) => void;
  onDelete?: (index: number) => void;
  isUploading?: boolean;
  selectedImage?: string | null;
  imageTextWrap?: 'left' | 'right' | 'center';
  setImageTextWrap?: (wrap: 'left' | 'right' | 'center') => void;
  imageOpacity?: number;
  setImageOpacity?: (opacity: number) => void;
  activeMode?: 'view' | 'edit';
  setActiveMode?: (mode: 'view' | 'edit') => void;
  onHelpClick?: () => void;
}

export default function ImageToolbox({ 
  images = [], 
  onUpload, 
  onDelete, 
  isUploading = false,
  selectedImage,
  imageTextWrap = 'left',
  setImageTextWrap,
  imageOpacity = 1,
  setImageOpacity,
  activeMode = 'view',
  setActiveMode,
  onHelpClick
}: ImageToolboxProps) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && onUpload) {
      onUpload(file);
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Images
        </h3>
        <div className="flex gap-2">
          {onHelpClick && (
            <Button variant="ghost" size="sm" onClick={onHelpClick}>
              ?
            </Button>
          )}
          <label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isUploading}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={isUploading}
              asChild
            >
              <span>
                <Upload className="h-4 w-4 mr-1" />
                {isUploading ? 'Uploading...' : 'Upload'}
              </span>
            </Button>
          </label>
        </div>
      </div>
      
      {/* Image Controls */}
      {selectedImage && (
        <div className="mb-4 p-3 border rounded bg-muted/20">
          <h4 className="text-sm font-medium mb-2">Image Settings</h4>
          <div className="flex gap-4 items-center text-sm">
            <div className="flex items-center gap-2">
              <span>Wrap:</span>
              <select 
                value={imageTextWrap} 
                onChange={(e) => setImageTextWrap?.(e.target.value as 'left' | 'right' | 'center')}
                className="border rounded px-2 py-1"
              >
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="center">Center</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span>Opacity:</span>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.1"
                value={imageOpacity}
                onChange={(e) => setImageOpacity?.(parseFloat(e.target.value))}
                className="w-20"
              />
              <span>{Math.round(imageOpacity * 100)}%</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setActiveMode?.(activeMode === 'view' ? 'edit' : 'view')}
            >
              {activeMode === 'view' ? 'Edit' : 'View'}
            </Button>
          </div>
        </div>
      )}
      
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-2">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-20 object-cover rounded"
              />
              <Button
                variant="destructive"
                size="sm"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => onDelete?.(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
