"use client";

import {
  ArrowLeft,
  Bookmark,
  MoreVertical,
  Settings,
  Share2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "packages/ui-components/src/components/button";
import { useState } from "react";
import "../styles/reader.css";
import type { ReaderHeaderProps } from "../types";

// React 19 compatibility wrappers
const ArrowLeftIcon = ArrowLeft as React.ElementType;
const SettingsIcon = Settings as React.ElementType;
const Share2Icon = Share2 as React.ElementType;
const BookmarkIcon = Bookmark as React.ElementType;
const MoreVerticalIcon = MoreVertical as React.ElementType;

export function ReaderHeader({
  note,
  onToggleSidebar,
  colorScheme,
  onColorSchemeChange,
}: ReaderHeaderProps) {
  const router = useRouter();
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note.title || "Untitled Note",
        text: note.content?.slice(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 reader-header transition-colors duration-300 ${
        colorScheme === "dark"
          ? "bg-ghost-black border-gray-800"
          : colorScheme === "sepia"
          ? "bg-amber-50 border-amber-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Side */}
        <div className="flex items-center space-x-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="hover:bg-opacity-20"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Button>

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold truncate max-w-[300px]">
              {note.title || "Untitled Note"}
            </h1>
            {note.author && (
              <p className="text-sm opacity-70">by {note.author}</p>
            )}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Color Scheme Toggle */}
          <div className="hidden sm:flex items-center space-x-1">
            <Button
              variant={colorScheme === "light" ? "default" : "ghost"}
              size="sm"
              onClick={() => onColorSchemeChange("light")}
              className="px-2"
            >
              ☀️
            </Button>
            <Button
              variant={colorScheme === "sepia" ? "default" : "ghost"}
              size="sm"
              onClick={() => onColorSchemeChange("sepia")}
              className="px-2"
            >
              📖
            </Button>
            <Button
              variant={colorScheme === "dark" ? "default" : "ghost"}
              size="sm"
              onClick={() => onColorSchemeChange("dark")}
              className="px-2"
            >
              🌙
            </Button>
          </div>

          {/* Action Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="hidden sm:flex"
          >
            <Share2 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="hidden sm:flex">
            <Bookmark className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={onToggleSidebar}>
            <Settings className="h-4 w-4" />
          </Button>

          {/* Mobile Menu */}
          <div className="relative sm:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowOptionsMenu(!showOptionsMenu)}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showOptionsMenu && (
              <div
                className={`absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg z-50 ${
                  colorScheme === "dark"
                    ? "bg-gray-800 border-gray-700"
                    : colorScheme === "sepia"
                    ? "bg-amber-50 border-amber-200"
                    : "bg-white border-gray-200"
                } border`}
              >
                <div className="py-1">
                  <button
                    onClick={handleShare}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-500"
                  >
                    Share
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-opacity-10 hover:bg-gray-500">
                    Bookmark
                  </button>
                  <div className="border-t my-1"></div>
                  <div className="px-4 py-2">
                    <p className="text-xs font-medium mb-2">Theme</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onColorSchemeChange("light")}
                        className={`px-2 py-1 text-xs rounded ${
                          colorScheme === "light"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Light
                      </button>
                      <button
                        onClick={() => onColorSchemeChange("sepia")}
                        className={`px-2 py-1 text-xs rounded ${
                          colorScheme === "sepia"
                            ? "bg-amber-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Sepia
                      </button>
                      <button
                        onClick={() => onColorSchemeChange("dark")}
                        className={`px-2 py-1 text-xs rounded ${
                          colorScheme === "dark"
                            ? "bg-gray-700 text-white"
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        Dark
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
