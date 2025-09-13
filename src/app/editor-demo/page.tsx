"use client";

import React, { useState } from "react";
import { RichTextEditor } from "@/components/rich-text-editor";

export default function EditorDemoPage() {
  const [content, setContent] = useState("");

  return (
    <div className="min-h-screen bg-ghost-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Rich Text Editor Demo
        </h1>

        <div className="mb-8">
          <RichTextEditor
            initialContent="<h2>Welcome to the Enhanced Rich Text Editor!</h2><p>Try out these new features:</p><ul data-type='taskList'><li data-type='taskItem' data-checked='false'><label><input type='checkbox'><span></span></label><div>Try the new task list feature</div></li><li data-type='taskItem' data-checked='false'><label><input type='checkbox'><span></span></label><div>Test <span style='font-family: Georgia, serif'>different fonts</span> and <span style='color: #3B82F6'>text colors</span></div></li><li data-type='taskItem' data-checked='false'><label><input type='checkbox'><span></span></label><div>Add hyperlinks using the 🔗 button</div></li><li data-type='taskItem' data-checked='true'><label><input type='checkbox' checked='checked'><span></span></label><div>Use <u>underline</u>, <sup>superscript</sup>, and <sub>subscript</sub></div></li></ul><h3>Lists with proper bullets and numbers:</h3><ul><li>First bullet point</li><li>Second bullet point<ul><li>Nested bullet (circle)</li><li>Another nested item</li></ul></li><li>Third bullet point</li></ul><ol><li>First numbered item</li><li>Second numbered item<ol><li>Nested number (a, b, c)</li><li>Another nested number</li></ol></li><li>Third numbered item</li></ol><blockquote>This is a blockquote that can be toggled on and off. It has proper styling with a left border and background.</blockquote><hr><p style='text-align: center'>This text is <mark style='background-color: #FBBF24; color: #1F2937'>highlighted</mark> and centered!</p><p>Check out this <a href='https://example.com' class='editor-link'>example link</a> or visit <a href='https://github.com' class='editor-link'>GitHub</a>.</p><p><span style='font-family: JetBrains Mono, Consolas, monospace'>Monospace text</span> for code snippets.</p><p>Format text with the enhanced toolbar above.</p>"
            placeholder="Start typing to test the enhanced editor..."
            onChange={setContent}
            className="mb-4"
            showToolbar={true}
            features={{
              basicFormatting: true,
              advancedFormatting: true,
              media: false,
              tables: false,
              code: true,
              math: false,
              citations: false,
              collaboration: false,
            }}
          />
        </div>

        <div className="bg-ghost-dark/50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Content Output (HTML):</h2>
          <pre className="bg-ghost-black p-4 rounded text-sm overflow-auto">
            <code>{content || "No content yet..."}</code>
          </pre>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">✨ New Features Added:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-ghost-dark/30 p-4 rounded-lg">
              <h3 className="font-semibold text-ghost-purple mb-2">
                Text Styling
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>
                  • <u>Underline</u> text formatting
                </li>
                <li>
                  • <sup>Superscript</sup> and <sub>subscript</sub>
                </li>
                <li>
                  •{" "}
                  <span style={{ fontFamily: "Georgia, serif" }}>
                    Font family
                  </span>{" "}
                  selection
                </li>
                <li>
                  • <span style={{ color: "#3B82F6" }}>Text color</span> picker
                </li>
                <li>
                  •{" "}
                  <mark
                    style={{
                      backgroundColor: "#FBBF24",
                      color: "#1F2937",
                      padding: "2px 4px",
                      borderRadius: "2px",
                    }}
                  >
                    Highlight
                  </mark>{" "}
                  colors
                </li>
              </ul>
            </div>
            <div className="bg-ghost-dark/30 p-4 rounded-lg">
              <h3 className="font-semibold text-ghost-purple mb-2">
                Structure & Tools
              </h3>
              <ul className="space-y-1 text-gray-300">
                <li>
                  • 🔗{" "}
                  <a
                    href="#"
                    style={{ color: "#8b5cf6", textDecoration: "underline" }}
                  >
                    Hyperlink
                  </a>{" "}
                  management
                </li>
                <li>• ☐ Interactive task lists with proper alignment</li>
                <li>• • Bullet lists with proper bullets</li>
                <li>• 1. Numbered lists with proper numbers</li>
                <li>• ❝ Blockquotes with toggle functionality</li>
                <li>• ― Horizontal rules</li>
                <li>• ⚏ Text alignment dropdown</li>
                <li>• 🎨 Color picker interface</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              ✅ Complete Rich Text Editor with working lists, quotes,
              hyperlinks, and styling!
            </p>
            <p className="text-sm text-gray-500 mt-2">
              💡 All toolbar buttons now toggle properly - try clicking
              list/quote buttons twice to see them turn on/off!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
