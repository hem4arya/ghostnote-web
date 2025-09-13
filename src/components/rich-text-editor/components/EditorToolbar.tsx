"use client";

import React from "react";
import { createPortal } from "react-dom";
import { Editor } from "@tiptap/react";
import { EditorFeatures } from "../types";

interface EditorToolbarProps {
  editor: Editor | null;
  features: Partial<EditorFeatures>;
  className?: string;
  onLinkClick?: () => void;
}

/**
 * ColorPicker Component
 */
const ColorPicker: React.FC<{
  title: string;
  currentColor?: string;
  onColorChange: (color: string) => void;
  onClear: () => void;
  isHighlight?: boolean;
}> = ({ title, currentColor, onColorChange, onClear, isHighlight = false }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  const colors = [
    { value: "#000000", label: "Black" },
    { value: "#FFFFFF", label: "White" },
    { value: "#FF0000", label: "Red" },
    { value: "#00FF00", label: "Green" },
    { value: "#0000FF", label: "Blue" },
    { value: "#FFFF00", label: "Yellow" },
    { value: "#FF00FF", label: "Magenta" },
    { value: "#00FFFF", label: "Cyan" },
    { value: "#FFA500", label: "Orange" },
    { value: "#A52A2A", label: "Brown" },
    { value: "#808080", label: "Gray" },
    { value: "#4B0082", label: "Indigo" },
  ];

  // State for dropdown position
  const [dropdownPosition, setDropdownPosition] = React.useState({ top: 0, left: 0 });

  // Calculate dropdown position with scroll handling
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 300;
      const dropdownWidth = 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.left;

      let top = rect.bottom + 8; // Default: position below button
      let left = rect.left; // Default: align with button left edge

      // If not enough space below, position above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top - dropdownHeight - 8;
      }

      // If not enough space on the right, align to the right edge of button
      if (spaceRight < dropdownWidth) {
        left = rect.right - dropdownWidth;
      }

      // Ensure dropdown stays within viewport bounds with padding
      const padding = 10;
      const finalPosition = {
        top: Math.max(padding, Math.min(top, window.innerHeight - dropdownHeight - padding)),
        left: Math.max(padding, Math.min(left, window.innerWidth - dropdownWidth - padding)),
      };

      setDropdownPosition(finalPosition);
    }
  }, [isOpen]);

  // Handle scroll and resize events to reposition dropdown
  React.useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 300;
        const dropdownWidth = 200;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top = rect.bottom + 8;
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          top = rect.top - dropdownHeight - 8;
        }

        const padding = 10;
        setDropdownPosition({
          top: Math.max(padding, Math.min(top, window.innerHeight - dropdownHeight - padding)),
          left: Math.max(padding, Math.min(rect.left, window.innerWidth - dropdownWidth - padding)),
        });
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
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
        className={`
          px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-w-[32px] h-8 flex items-center justify-center
          border border-transparent
          ${
            currentColor
              ? "bg-ghost-purple/20 text-ghost-purple border-ghost-purple/30"
              : "text-gray-400 hover:text-white hover:bg-ghost-dark/50 hover:border-ghost-gray/30"
          }
          focus:outline-none focus:ring-2 focus:ring-ghost-purple/50 focus:ring-offset-1 focus:ring-offset-ghost-black
        `}
      >
        {isHighlight ? "A📌" : "A🖌"}
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="toolbar-dropdown-menu min-w-[140px] bg-ghost-dark/95 backdrop-blur-md border border-ghost-gray/40 rounded-xl shadow-2xl p-2"
            style={{ 
              position: "fixed", 
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 999999 
            }}
          >
            <div className="grid grid-cols-3 gap-1">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    onColorChange(color.value);
                    setIsOpen(false);
                  }}
                  className={`w-8 h-8 rounded border ${
                    color.value === currentColor
                      ? "border-ghost-purple"
                      : "border-ghost-gray/30"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                onClear();
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-ghost-dark/50 hover:text-white"
            >
              Remove Color
            </button>
          </div>,
          document.body
        )}
    </div>
  );
};

/**
 * ToolbarButton Component
 */
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
        e.preventDefault();
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

/**
 * ToolbarDropdown Component
 */
const ToolbarDropdown: React.FC<{
  title: string;
  children: React.ReactNode;
  icon?: string;
  onOpen?: () => void;
}> = ({ title, children, icon = "⚙", onOpen }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [dropdownPosition, setDropdownPosition] = React.useState({
    top: 0,
    left: 0,
  });
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  // Calculate dropdown position with enhanced logic
  React.useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const dropdownHeight = 300;
      const dropdownWidth = 200;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const spaceRight = window.innerWidth - rect.left;

      let top = rect.bottom + 8; // Default: position below button
      let left = rect.left; // Default: align with button left edge

      // If not enough space below, position above
      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        top = rect.top - dropdownHeight - 8;
      }

      // If not enough space on the right, align to the right edge of button
      if (spaceRight < dropdownWidth) {
        left = rect.right - dropdownWidth;
      }

      // Ensure dropdown stays within viewport bounds with padding
      const padding = 10;
      setDropdownPosition({
        top: Math.max(padding, Math.min(top, window.innerHeight - dropdownHeight - padding)),
        left: Math.max(padding, Math.min(left, window.innerWidth - dropdownWidth - padding)),
      });
    }
  }, [isOpen]);

  // Handle scroll and resize events to reposition dropdown
  React.useEffect(() => {
    if (!isOpen) return;

    const handleScrollOrResize = () => {
      if (buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect();
        const dropdownHeight = 300;
        const dropdownWidth = 200;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        let top = rect.bottom + 8;
        if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
          top = rect.top - dropdownHeight - 8;
        }

        const padding = 10;
        setDropdownPosition({
          top: Math.max(padding, Math.min(top, window.innerHeight - dropdownHeight - padding)),
          left: Math.max(padding, Math.min(rect.left, window.innerWidth - dropdownWidth - padding)),
        });
      }
    };

    window.addEventListener('scroll', handleScrollOrResize, true);
    window.addEventListener('resize', handleScrollOrResize);

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
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

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isOpen && onOpen) {
      onOpen();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onMouseDown={handleToggle}
        title={title}
        className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 min-w-[32px] h-8 flex items-center justify-center
                   text-gray-400 hover:text-white hover:bg-ghost-dark/50 hover:border-ghost-gray/30
                   border border-transparent focus:outline-none focus:ring-2 focus:ring-ghost-purple/50 relative z-10"
      >
        {icon}
      </button>
      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="toolbar-dropdown-menu min-w-[140px] bg-ghost-dark/95 backdrop-blur-md border border-ghost-gray/40 rounded-xl shadow-2xl p-2"
            style={{
              position: "fixed",
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 999999,
            }}
          >
            {React.Children.map(children, (child) =>
              React.isValidElement(child)
                ? React.cloneElement(
                    child as React.ReactElement<{ closeMenu: () => void }>,
                    {
                      closeMenu: () => setIsOpen(false),
                    }
                  )
                : child
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

/**
 * DropdownItem Component
 */
const DropdownItem: React.FC<{
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  closeMenu: () => void;
}> = ({
  onClick,
  isActive = false,
  children,
  onMouseEnter,
  onMouseLeave,
  closeMenu,
}) => (
  <button
    onMouseDown={(e) => {
      e.preventDefault();
      onClick();
      closeMenu();
    }}
    onMouseEnter={onMouseEnter}
    onMouseLeave={onMouseLeave}
    className={`
      w-full text-left px-3 py-2 rounded-md text-sm transition-all duration-200
      ${
        isActive
          ? "bg-ghost-purple/20 text-ghost-purple"
          : "text-gray-300 hover:bg-ghost-dark/50 hover:text-white"
      }
    `}
  >
    {children}
  </button>
);

/**
 * EditorToolbar Component
 */
const EditorToolbar: React.FC<EditorToolbarProps> = ({
  editor,
  features,
  className,
  onLinkClick,
}) => {
  // Font preview logic - moved to top level to avoid conditional hook calls
  const [originalFont, setOriginalFont] = React.useState<string | undefined>(
    ""
  );

  if (!editor) {
    return null;
  }

  const handleFontDropdownOpen = () => {
    setOriginalFont(editor.getAttributes("textStyle").fontFamily);
  };

  const previewFont = (font: string) => {
    editor.chain().focus().setFontFamily(font).run();
  };

  const revertFont = () => {
    if (originalFont !== undefined) {
      if (originalFont) {
        editor.chain().focus().setFontFamily(originalFont).run();
      } else {
        editor.chain().focus().unsetFontFamily().run();
      }
    }
  };

  // List styles
  const bulletStyles = [
    { value: "disc", label: "Solid Dot", icon: "•" },
    { value: "circle", label: "Hollow Circle", icon: "○" },
    { value: "square", label: "Square", icon: "■" },
    { value: "none", label: "Dash", icon: "-" },
  ];

  const orderedStyles = [
    { value: "decimal", label: "Decimal (1, 2, 3)", icon: "1." },
    { value: "lower-alpha", label: "Lower Alpha (a, b, c)", icon: "a." },
    { value: "lower-roman", label: "Lower Roman (i, ii, iii)", icon: "i." },
  ];

  const taskMarkers = [
    { value: "checkbox", label: "Checkbox", icon: "☑" },
    { value: "radio", label: "Radio Button", icon: "◯" },
    { value: "check", label: "Check Mark", icon: "✔️" },
    { value: "cross", label: "Cross Mark", icon: "✖️" },
  ];

  const currentBulletStyle =
    editor.getAttributes("bulletList")?.styleType || "disc";
  const currentOrderedStyle =
    editor.getAttributes("orderedList")?.styleType || "decimal";
  const currentTaskMarker =
    editor.getAttributes("taskItem")?.markerType || "checkbox";

  return (
    <div
      className={`editor-toolbar flex items-center gap-1 p-2 border-b border-ghost-gray/30 overflow-x-auto ${
        className || ""
      }`}
    >
      <div className="flex gap-1">
        {/* Basic Formatting Group */}
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
          ^
        </ToolbarButton>

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          isActive={editor.isActive("subscript")}
          title="Subscript"
        >
          v
        </ToolbarButton>

        {/* Link Button */}
        <ToolbarButton
          onClick={onLinkClick || (() => {})}
          isActive={editor.isActive("link")}
          title="Link"
        >
          🔗
        </ToolbarButton>

        {/* Font Family Dropdown */}
        <ToolbarDropdown
          title="Font Family"
          icon="Aa"
          onOpen={handleFontDropdownOpen}
        >
          <DropdownItem
            onClick={() => editor.chain().focus().setFontFamily("Inter").run()}
            isActive={editor.isActive("textStyle", { fontFamily: "Inter" })}
            onMouseEnter={() => previewFont("Inter")}
            onMouseLeave={revertFont}
            closeMenu={() => {}}
          >
            Sans Serif
          </DropdownItem>
          <DropdownItem
            onClick={() => editor.chain().focus().setFontFamily("serif").run()}
            isActive={editor.isActive("textStyle", { fontFamily: "serif" })}
            onMouseEnter={() => previewFont("serif")}
            onMouseLeave={revertFont}
            closeMenu={() => {}}
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
            onMouseEnter={() =>
              previewFont("JetBrains Mono, Consolas, monospace")
            }
            onMouseLeave={revertFont}
            closeMenu={() => {}}
          >
            Monospace
          </DropdownItem>
          <DropdownItem
            onClick={() => editor.chain().focus().unsetFontFamily().run()}
            onMouseEnter={() => previewFont("")}
            onMouseLeave={revertFont}
            closeMenu={() => {}}
          >
            Default
          </DropdownItem>
        </ToolbarDropdown>

        {/* Text Color Picker */}
        <ColorPicker
          title="Text Color"
          currentColor={editor.getAttributes("textStyle").color}
          onColorChange={(color) =>
            editor.chain().focus().setColor(color).run()
          }
          onClear={() => editor.chain().focus().unsetColor().run()}
        />

        {/* Highlight Color Picker */}
        <ColorPicker
          title="Highlight Color"
          currentColor={editor.getAttributes("highlight").color}
          onColorChange={(color) =>
            editor.chain().focus().toggleHighlight({ color }).run()
          }
          onClear={() => editor.chain().focus().unsetHighlight().run()}
          isHighlight
        />

        {/* Text Alignment Dropdown */}
        <ToolbarDropdown title="Text Alignment" icon="⚏">
          <DropdownItem
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            closeMenu={() => {}}
          >
            ← Left
          </DropdownItem>
          <DropdownItem
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            closeMenu={() => {}}
          >
            ↔ Center
          </DropdownItem>
          <DropdownItem
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            closeMenu={() => {}}
          >
            → Right
          </DropdownItem>
          <DropdownItem
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            closeMenu={() => {}}
          >
            ⟷ Justify
          </DropdownItem>
        </ToolbarDropdown>

        {/* Headings Group */}
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

        {/* Lists Group */}
        <ToolbarDropdown title="Bullet List Styles" icon="•">
          {bulletStyles.map((style) => (
            <DropdownItem
              key={style.value}
              onClick={() =>
                (
                  editor.commands as unknown as {
                    setBulletStyle: (style: string) => void;
                  }
                ).setBulletStyle(style.value)
              }
              isActive={
                editor.isActive("bulletList") &&
                currentBulletStyle === style.value
              }
              closeMenu={() => {}}
            >
              {style.icon} {style.label}
            </DropdownItem>
          ))}
        </ToolbarDropdown>

        <ToolbarDropdown title="Numbered List Styles" icon="1.">
          {orderedStyles.map((style) => (
            <DropdownItem
              key={style.value}
              onClick={() =>
                (
                  editor.commands as unknown as {
                    setOrderedStyle: (style: string) => void;
                  }
                ).setOrderedStyle(style.value)
              }
              isActive={
                editor.isActive("orderedList") &&
                currentOrderedStyle === style.value
              }
              closeMenu={() => {}}
            >
              {style.icon} {style.label}
            </DropdownItem>
          ))}
        </ToolbarDropdown>

        <ToolbarDropdown title="Task List Markers" icon="☑">
          {taskMarkers.map((marker) => (
            <DropdownItem
              key={marker.value}
              onClick={() =>
                (
                  editor.commands as unknown as {
                    setTaskMarker: (marker: string) => void;
                  }
                ).setTaskMarker(marker.value)
              }
              isActive={
                editor.isActive("taskList") &&
                currentTaskMarker === marker.value
              }
              closeMenu={() => {}}
            >
              {marker.icon} {marker.label}
            </DropdownItem>
          ))}
        </ToolbarDropdown>

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

        {/* Code Group */}
        {features.code && (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;
