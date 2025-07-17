"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { UserDropdownProps } from "../types";
import { Avatar } from "./Avatar";
import styles from "./Navbar.module.css";

// For React 19 compatibility
const LogOutIcon = LogOut as React.ElementType;
const SettingsIcon = Settings as React.ElementType;
const UserIcon = User as React.ElementType;
const SafeLink = Link as React.ElementType;

export const UserDropdown: React.FC<UserDropdownProps> = ({
  user,
  menuItems = [],
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Default menu items
  const defaultMenuItems = [
    {
      label: "Profile",
      href: "/profile",
      icon: <UserIcon className={styles.menuItemIcon} />,
    },
    {
      label: "Settings",
      href: "/settings",
      icon: <SettingsIcon className={styles.menuItemIcon} />,
    },
    {
      label: "Log out",
      onClick: () => {
        // Handle logout
        console.log("Logging out");
      },
      icon: <LogOutIcon className={styles.menuItemIcon} />,
    },
  ];

  // Combine default and custom menu items
  const allMenuItems = [...menuItems, ...defaultMenuItems];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.userMenuContainer} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Avatar user={user} />
      </button>

      {isOpen && (
        <div className={styles.userMenu}>
          <div className={styles.userInfo}>
            <div className={styles.userName}>{user.name}</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>

          {allMenuItems.map((item, index) =>
            item.href ? (
              <SafeLink
                href={item.href}
                key={index}
                className={styles.menuItem}
                onClick={() => setIsOpen(false)}
              >
                {item.icon}
                {item.label}
              </SafeLink>
            ) : (
              <button
                key={index}
                className={styles.menuItem}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
};
