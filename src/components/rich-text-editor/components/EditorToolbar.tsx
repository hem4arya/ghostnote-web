"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Editor } from "@tiptap/react";
import { EditorFeatures } from "../types";

interface EditorToolbarProps {
  editor: Editor | null;
  features: Partial<EditorFeatures>;
  className?: string;
}

/**
 * EditorToolbar Component
 *
 * Provides formatting controls and tools for the rich text editor.
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  features,
  className,
}) => {
  if (!editor) {
    return null;
  }

  type ToolbarButtonProps = {
    onClick: () => void;
    isActive?: boolean;
    disabled?: boolean;
    children: React.ReactNode;
    title: string;
  };

  const ToolbarButton = React.forwardRef<HTMLButtonElement, ToolbarButtonProps>(
    ({ onClick, isActive = false, disabled = false, children, title }, ref) => (
      <button
        ref={ref}
        onMouseDown={(e) => {
          e.preventDefault(); // Prevent editor from losing focus
          onClick();
        }}
        disabled={disabled}
        title={title}
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-w-[32px] h-8 flex items-center justify-center
          border border-transparent relative z-10
          ${
            isActive
              ? "bg-ghost-purple/20 text-ghost-purple border-ghost-purple/30 shadow-sm"
              : "text-gray-400 hover:text-white hover:bg-ghost-dark/50 hover:border-ghost-gray/30"
          }
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          focus:outline-none focus:ring-2 focus:ring-ghost-purple/50 focus:ring-offset-1 focus:ring-offset-ghost-black
        `}
      >
        {children}
      </button>
    )
  );
  ToolbarButton.displayName = "ToolbarButton";

  const ToolbarDropdown: React.FC<{
    title: string;
    children: React.ReactNode;
    icon?: string;
  }> = ({ title, children, icon = "⚙" }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
    const dropdownRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    // Calculate dropdown position when opened
    React.useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 300; // Approximate max height
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        
        let top = rect.bottom + 8; // Default position below button
        
        // If not enough space below, position above
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          top = rect.top - dropdownHeight - 8;
        }
        
        setDropdownPosition({
          top: Math.max(10, Math.min(top, window.innerHeight - dropdownHeight - 10)),
          left: Math.max(10, Math.min(rect.left, window.innerWidth - 200))
        });
      }
    }, [isOpen]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
          document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    return (
      <div className="relative">
        <button
          ref={buttonRef}
          onMouseDown={(e) => {
            e.preventDefault();
            setIsOpen(!isOpen);
          }}
          title={title}
          className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-w-[32px] h-8 flex items-center justify-center
                     text-gray-400 hover:text-white hover:bg-ghost-dark/50 hover:border-ghost-gray/30
                     border border-transparent focus:outline-none focus:ring-2 focus:ring-ghost-purple/50 relative z-10"
        >
          {icon}
        </button>
        {isOpen && createPortal(
          <div 
            ref={dropdownRef}
            className="toolbar-dropdown-menu min-w-[140px]"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 999999
            }}
          >
            <div className="p-2">{children}</div>
          </div>,
          document.body
        )}
      </div>
    );
  };

  const DropdownItem: React.FC<{
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
  }> = ({ onClick, isActive = false, children }) => (
    <button
      onMouseDown={(e) => {
        e.preventDefault();
        onClick();
      }}
      className={`
        w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200
        ${
          isActive
            ? "bg-ghost-purple/20 text-ghost-purple border-l-2 border-ghost-purple"
            : "text-gray-300 hover:text-white hover:bg-ghost-gray/20"
        }
      `}
    >
      {children}
    </button>
  );

  const ColorPicker: React.FC<{
    title: string;
    currentColor?: string;
    onColorChange: (color: string) => void;
    onClear: () => void;
    isHighlight?: boolean;
  }> = ({
    title,
    currentColor,
    onColorChange,
    onClear,
    isHighlight = false,
  }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });
    const colorPickerRef = React.useRef<HTMLDivElement>(null);
    const buttonRef = React.useRef<HTMLButtonElement>(null);

    React.useEffect(() => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 300;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top = rect.bottom + 8;

        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          top = rect.top - dropdownHeight - 8;
        }

        setDropdownPosition({
          top: Math.max(10, Math.min(top, window.innerHeight - dropdownHeight - 10)),
          left: Math.max(10, Math.min(rect.left, window.innerWidth - 300))
        });
      }
    }, [isOpen]);

    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          colorPickerRef.current &&
          !colorPickerRef.current.contains(event.target as Node) &&
          buttonRef.current &&
          !buttonRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
      }
    }, [isOpen]);

    // Completed color categories (added missing ones based on standard palettes)
    const colorCategories = {
      basic: [
        { name: "Black", color: "#000000" },
        { name: "Dark Gray", color: "#374151" },
        { name: "Gray", color: "#6B7280" },
        { name: "Light Gray", color: "#9CA3AF" },
        { name: "Very Light Gray", color: "#D1D5DB" },
        { name: "White", color: "#FFFFFF" },
      ],
      reds: [
        { name: "Dark Red", color: "#7F1D1D" },
        { name: "Red", color: "#DC2626" },
        { name: "Light Red", color: "#EF4444" },
        { name: "Pink", color: "#F87171" },
        { name: "Light Pink", color: "#FECACA" },
        { name: "Very Light Pink", color: "#FEF2F2" },
      ],
      oranges: [
        { name: "Dark Orange", color: "#9A3412" },
        { name: "Orange", color: "#EA580C" },
        { name: "Light Orange", color: "#F97316" },
        { name: "Peach", color: "#FB923C" },
        { name: "Light Peach", color: "#FDBA74" },
        { name: "Very Light Orange", color: "#FFF7ED" },
      ],
      yellows: [
        { name: "Dark Yellow", color: "#78350F" },
        { name: "Yellow", color: "#D97706" },
        { name: "Light Yellow", color: "#F59E0B" },
        { name: "Bright Yellow", color: "#FBBF24" },
        { name: "Pale Yellow", color: "#FCD34D" },
        { name: "Very Light Yellow", color: "#FEF3C7" },
      ],
      greens: [
        { name: "Dark Green", color: "#065F46" },
        { name: "Green", color: "#059669" },
        { name: "Light Green", color: "#10B981" },
        { name: "Lime", color: "#34D399" },
        { name: "Pale Green", color: "#A7F3D0" },
        { name: "Very Light Green", color: "#ECFDF5" },
      ],
      blues: [
        { name: "Dark Blue", color: "#1E40AF" },
        { name: "Blue", color: "#2563EB" },
        { name: "Light Blue", color: "#3B82F6" },
        { name: "Sky Blue", color: "#60A5FA" },
        { name: "Pale Blue", color: "#BFDBFE" },
        { name: "Very Light Blue", color: "#EFF6FF" },
      ],
      purples: [
        { name: "Dark Purple", color: "#5B21B6" },
        { name: "Purple", color: "#7C3AED" },
        { name: "Light Purple", color: "#8B5CF6" },
        { name: "Lavender", color: "#A78BFA" },
        { name: "Pale Purple", color: "#DDD6FE" },
        { name: "Very Light Purple", color: "#F5F3FF" },
      ],
      indigos: [
        { name: "Dark Indigo", color: "#3730A3" },
        { name: "Indigo", color: "#4F46E5" },
        { name: "Light Indigo", color: "#6366F1" },
        { name: "Periwinkle", color: "#818CF8" },
        { name: "Pale Indigo", color: "#C7D2FE" },
        { name: "Very Light Indigo", color: "#EEF2FF" },
      ],
    };

    return (
      <div className="relative">
        <ToolbarButton
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          title={title}
        >
          {isHighlight ? "Bg" : "A"}
        </ToolbarButton>
        {isOpen && createPortal(
          <div
            ref={colorPickerRef}
            className="color-picker-dropdown min-w-[240px]"
            style={{
              position: 'fixed',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 999999,
            }}
          >
            <div className="p-4 max-h-80 overflow-y-auto">
              {Object.entries(colorCategories).map(([category, colors]) => (
                <div key={category} className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-400 mb-2 uppercase">{category}</h4>
                  <div className="grid grid-cols-6 gap-1">
                    {colors.map(({ name, color }) => (
                      <button
                        key={color}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          onColorChange(color);
                          setIsOpen(false);
                        }}
                        title={name}
                        className={`w-6 h-6 rounded border ${color === currentColor ? 'border-ghost-purple' : 'border-transparent'} flex items-center justify-center`}
                        style={{ backgroundColor: color }}
                      >
                        {color === currentColor && <span className="text-xs text-black">✓</span>}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onMouseDown={(e) => {
                  e.preventDefault();
                  onClear();
                  setIsOpen(false);
                }}
                className="w-full py-2 px-4 bg-ghost-dark/50 hover:bg-ghost-dark/70 rounded text-sm text-gray-300"
              >
                Clear {isHighlight ? 'Highlight' : 'Color'}
              </button>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  };

  const ToolbarGroup = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center gap-1 bg-ghost-dark/30 rounded-md p-1">
      {children}
    </div>
  );

  return (
    <div className={`editor-toolbar ${className || ''}`}>
      <div className="toolbar-groups flex flex-wrap gap-2 p-2 border-b border-ghost-gray/20">
        {/* Basic Formatting Group */}
        {features.basicFormatting && (
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleBold().run()}
              isActive={editor.isActive("bold")}
              title="Bold"
            >
              B
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleItalic().run()}
              isActive={editor.isActive("italic")}
              title="Italic"
            >
              I
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              isActive={editor.isActive("underline")}
              title="Underline"
            >
              U
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleStrike().run()}
              isActive={editor.isActive("strike")}
              title="Strikethrough"
            >
              S
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSuperscript().run()}
              isActive={editor.isActive("superscript")}
              title="Superscript"
            >
              x²
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleSubscript().run()}
              isActive={editor.isActive("subscript")}
              title="Subscript"
            >
              x₂
            </ToolbarButton>
          </ToolbarGroup>
        )}

        {/* Font & Color Group */}
        <ToolbarGroup>
          <ToolbarDropdown title="Font Family" icon="Aa">
            <DropdownItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setFontFamily("Inter, system-ui, sans-serif")
                  .run()
              }
              isActive={editor.isActive("textStyle", {
                fontFamily: "Inter, system-ui, sans-serif",
              })}
            >
              Sans Serif
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                editor.chain().focus().setFontFamily("Georgia, serif").run()
              }
              isActive={editor.isActive("textStyle", {
                fontFamily: "Georgia, serif",
              })}
            >
              Serif
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .setFontFamily("JetBrains Mono, Consolas, monospace")
                  .run()
              }
              isActive={editor.isActive("textStyle", {
                fontFamily: "JetBrains Mono, Consolas, monospace",
              })}
            >
              Monospace
            </DropdownItem>
            <DropdownItem
              onClick={() => editor.chain().focus().unsetFontFamily().run()}
            >
              Default
            </DropdownItem>
          </ToolbarDropdown>

          <ColorPicker
            title="Text Color"
            currentColor={editor.getAttributes("textStyle").color}
            onColorChange={(color) =>
              editor.chain().focus().setColor(color).run()
            }
            onClear={() => editor.chain().focus().unsetColor().run()}
          />

          <ColorPicker
            title="Highlight Color"
            currentColor={editor.getAttributes("highlight").color}
            onColorChange={(color) =>
              editor.chain().focus().toggleHighlight({ color }).run()
            }
            onClear={() => editor.chain().focus().unsetHighlight().run()}
            isHighlight={true}
          />

          <ToolbarDropdown title="Text Alignment" icon="⚏">
            <DropdownItem
              onClick={() =>
                editor.chain().focus().setTextAlign("left").run()
              }
              isActive={editor.isActive({ textAlign: "left" })}
            >
              ← Left
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              isActive={editor.isActive({ textAlign: "center" })}
            >
              ↔ Center
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                editor.chain().focus().setTextAlign("right").run()
              }
              isActive={editor.isActive({ textAlign: "right" })}
            >
              → Right
            </DropdownItem>
            <DropdownItem
              onClick={() =>
                editor.chain().focus().setTextAlign("justify").run()
              }
              isActive={editor.isActive({ textAlign: "justify" })}
            >
              ⟷ Justify
            </DropdownItem>
          </ToolbarDropdown>
        </ToolbarGroup>

        {/* Headings Group */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            isActive={editor.isActive("heading", { level: 1 })}
            title="Heading 1"
          >
            H1
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            isActive={editor.isActive("heading", { level: 2 })}
            title="Heading 2"
          >
            H2
          </ToolbarButton>

          <ToolbarButton
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            isActive={editor.isActive("heading", { level: 3 })}
            title="Heading 3"
          >
            H3
          </ToolbarButton>
        </ToolbarGroup>

        {/* Lists & Structure Group */}
        <ToolbarGroup>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            title="Bullet List"
          >
            •
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            title="Numbered List"
          >
            1.
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleTaskList().run()}
            isActive={editor.isActive("taskList")}
            title="Task List"
          >
            ☑
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            title="Quote"
          >
            &ldquo;
          </ToolbarButton>

          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Rule"
          >
            —
          </ToolbarButton>
        </ToolbarGroup>

        {/* Code Group */}
        {features.code && (
          <ToolbarGroup>
            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCode().run()}
              isActive={editor.isActive("code")}
              title="Inline Code"
            >
              &lt;/&gt;
            </ToolbarButton>

            <ToolbarButton
              onClick={() => editor.chain().focus().toggleCodeBlock().run()}
              isActive={editor.isActive("codeBlock")}
              title="Code Block"
            >
              {"{ }"}
            </ToolbarButton>
          </ToolbarGroup>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;