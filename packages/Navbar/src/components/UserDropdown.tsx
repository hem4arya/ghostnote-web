"use client";

import { ChevronDown, LogOut, Settings, User, UserCheck } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { MenuItem, User as UserType } from "../types";
import styles from "./Navbar.module.css";

// For React 19 compatibility
const UserIcon = User as React.ElementType;
const LogOutIcon = LogOut as React.ElementType;
const SettingsIcon = Settings as React.ElementType;
const UserCheckIcon = UserCheck as React.ElementType;
const ChevronDownIcon = ChevronDown as React.ElementType;

export interface UserDropdownProps {
  user: UserType;
  menuItems?: MenuItem[];
  onLogout?: () => void;
  className?: string;
}

const defaultMenuItems: MenuItem[] = [
  {
    label: "Profile",
    href: "/profile",
    icon: <UserIcon className="h-4 w-4" />,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: <SettingsIcon className="h-4 w-4" />,
  },
  {
    label: "Account",
    href: "/account",
    icon: <UserCheckIcon className="h-4 w-4" />,
  },
];

export const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  menuItems = defaultMenuItems,
  onLogout,
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("scroll", () => setIsOpen(false), true);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", () => setIsOpen(false), true);
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    }
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    if (onLogout) {
      onLogout();
    }
    setIsOpen(false);
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`${styles.userMenuContainer} ${className}`}
      ref={dropdownRef}
    >
      {/* User Avatar Button */}
      <button
        onClick={toggleDropdown}
        className={`${styles.userAvatar} transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-ghost-neon/30 focus:outline-none focus:ring-2 focus:ring-ghost-purple focus:ring-offset-2 focus:ring-offset-ghost-dark relative overflow-hidden group`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user.image ? (
          <img
            src={user.image}
            alt={user.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <span className="font-semibold text-sm transition-transform duration-300 group-hover:scale-110">
            {getInitials(user.name)}
          </span>
        )}

        {/* Online indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-ghost-neon border-2 border-ghost-dark rounded-full animate-pulse"></div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-ghost-purple/0 via-ghost-neon/20 to-ghost-cyan/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={`${styles.userMenu} animate-in slide-in-from-top-2 fade-in duration-200`}
        >
          {/* User Info Section */}
          <div className={styles.userInfo}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-ghost-purple to-ghost-neon flex items-center justify-center font-semibold text-black text-sm">
                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  getInitials(user.name)
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className={styles.userName}>{user.name}</div>
                <div className={styles.userEmail}>{user.email}</div>
              </div>
              <div className="text-ghost-neon">
                <ChevronDownIcon
                  className={`h-4 w-4 transition-transform duration-200 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="space-y-1">
            {menuItems.map((item, index) => (
              <div key={index}>
                {item.href ? (
                  <a
                    href={item.href}
                    className={`${styles.menuItem} group relative overflow-hidden`}
                    onClick={() => handleMenuItemClick(item)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ghost-purple/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    {item.icon && (
                      <span
                        className={`${styles.menuItemIcon} group-hover:text-ghost-neon transition-colors duration-200`}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </a>
                ) : (
                  <button
                    onClick={() => handleMenuItemClick(item)}
                    className={`${styles.menuItem} w-full text-left group relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-ghost-purple/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
                    {item.icon && (
                      <span
                        className={`${styles.menuItemIcon} group-hover:text-ghost-neon transition-colors duration-200`}
                      >
                        {item.icon}
                      </span>
                    )}
                    <span className="relative z-10">{item.label}</span>
                  </button>
                )}
              </div>
            ))}

            {/* Separator */}
            <div className="my-2 h-px bg-gradient-to-r from-transparent via-ghost-purple/30 to-transparent"></div>

            {/* Logout Button */}
            <button
              onClick={handleLogoutClick}
              className={`${styles.menuItem} w-full text-left group relative overflow-hidden hover:bg-red-500/10 hover:text-red-400`}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              <LogOutIcon className="h-4 w-4 mr-3 group-hover:text-red-400 transition-colors duration-200" />
              <span className="relative z-10">Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
