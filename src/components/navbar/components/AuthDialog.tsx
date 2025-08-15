/**
 * AuthDialog Component
 * Enhanced dialog with navbar hiding and backdrop styling for authentication forms
 */

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/shared/ui/components/dialog";
import { useNavbarVisibility } from "../hooks/useNavbarVisibility";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  className = "",
}: AuthDialogProps) {
  const [isMounted, setIsMounted] = useState(false);

  // Handle navbar visibility
  useNavbarVisibility(open);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Add custom styles for backdrop when dialog opens
  useEffect(() => {
    if (open) {
      // Add blur to main content behind dialog
      const mainContent = document.querySelector('main, #__next, [data-main-content]');
      if (mainContent) {
        (mainContent as HTMLElement).style.filter = 'blur(8px)';
        (mainContent as HTMLElement).style.transition = 'filter 0.3s ease-in-out';
      }
      // Blur navbar if it exists
      const navbar = document.querySelector('nav, header, [data-navbar]');
      if (navbar) {
        (navbar as HTMLElement).style.filter = 'blur(8px)';
        (navbar as HTMLElement).style.transition = 'filter 0.3s ease-in-out';
      }
      // Add custom backdrop styles
      const style = document.createElement("style");
      style.id = "auth-dialog-styles";
      style.textContent = `
        [data-radix-dialog-overlay] {
          background: rgba(0, 0, 0, 0.75) !important;
          backdrop-filter: blur(12px) !important;
          -webkit-backdrop-filter: blur(12px) !important;
          transition: all 0.3s ease-in-out !important;
        }
        [data-radix-dialog-content] {
          max-height: 90vh !important;
          overflow-y: auto !important;
          margin: 2rem !important;
          transition: all 0.3s ease-in-out !important;
        }
        
        /* Modern Compact Scrollbar Styling */
        [data-radix-dialog-content]::-webkit-scrollbar,
        .auth-scrollbar::-webkit-scrollbar {
          width: 4px !important;
          height: 4px !important;
        }
        
        [data-radix-dialog-content]::-webkit-scrollbar-track,
        .auth-scrollbar::-webkit-scrollbar-track {
          background: transparent !important;
          margin: 8px 0 !important;
        }
        
        [data-radix-dialog-content]::-webkit-scrollbar-thumb,
        .auth-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15) !important;
          border-radius: 2px !important;
          transition: all 0.2s ease !important;
          min-height: 20px !important;
        }
        
        [data-radix-dialog-content]::-webkit-scrollbar-thumb:hover,
        .auth-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #00ff41 !important;
          box-shadow: 0 0 6px rgba(0, 255, 65, 0.4) !important;
        }
        
        [data-radix-dialog-content]::-webkit-scrollbar-corner,
        .auth-scrollbar::-webkit-scrollbar-corner {
          background: transparent !important;
        }
        
        /* Autofill Override Styles */
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px var(--muted) inset !important;
          -webkit-text-fill-color: var(--foreground) !important;
          background-color: var(--muted) !important;
          transition: background-color 5000s ease-in-out 0s !important;
        }
        
        input[data-auth-input]:-webkit-autofill,
        input[data-auth-input]:-webkit-autofill:hover,
        input[data-auth-input]:-webkit-autofill:focus,
        input[data-auth-input]:-webkit-autofill:active {
          -webkit-box-shadow: 0 0 0 30px hsl(var(--muted) / 0.3) inset !important;
          -webkit-text-fill-color: hsl(var(--foreground)) !important;
          background-color: hsl(var(--muted) / 0.3) !important;
        }
        
        /* Custom Input Focus Styling */
        input[data-auth-input]:focus {
          outline: none !important;
          ring: none !important;
          border-width: 2px !important;
          border-color: rgba(255, 255, 255, 0.4) !important;
          box-shadow: none !important;
        }
        
        input[data-auth-input]:focus:hover {
          box-shadow: 0 0 8px rgba(0, 255, 65, 0.2) !important;
        }
      `;
      document.head.appendChild(style);
    } else {
      // Remove blur from main content
      const mainContent = document.querySelector('main, #__next, [data-main-content]');
      if (mainContent) {
        (mainContent as HTMLElement).style.filter = '';
        (mainContent as HTMLElement).style.transition = '';
      }
      // Remove blur from navbar
      const navbar = document.querySelector('nav, header, [data-navbar]');
      if (navbar) {
        (navbar as HTMLElement).style.filter = '';
        (navbar as HTMLElement).style.transition = '';
      }
      // Remove custom styles
      const existingStyle = document.getElementById("auth-dialog-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    }

    return () => {
      // Cleanup: remove blur effects
      const mainContent = document.querySelector('main, #__next, [data-main-content]');
      if (mainContent) {
        (mainContent as HTMLElement).style.filter = '';
        (mainContent as HTMLElement).style.transition = '';
      }
      const navbar = document.querySelector('nav, header, [data-navbar]');
      if (navbar) {
        (navbar as HTMLElement).style.filter = '';
        (navbar as HTMLElement).style.transition = '';
      }
      const existingStyle = document.getElementById("auth-dialog-styles");
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, [open]);

  if (!isMounted) {
    return null; // Don't render during SSR
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={`
          w-full max-w-sm
          max-h-[90vh] overflow-y-auto auth-scrollbar
          bg-gradient-to-br from-card to-card/95 
          border border-primary/30 
          shadow-2xl
          transition-all duration-300 ease-in-out
          ${className}
        `}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold text-center">
            {title}
          </DialogTitle>
          {description && (
            <DialogDescription className="text-center text-muted-foreground">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Scrollable content area */}
        <div className="max-h-[60vh] overflow-y-auto px-1 auth-scrollbar">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  );
}
