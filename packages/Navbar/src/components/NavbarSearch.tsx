"use client";

import { Search } from "lucide-react";
import React from "react";
import { NavbarSearchProps } from "../types";
import styles from "./Navbar.module.css";

// For React 19 compatibility
const SearchIcon = Search as React.ElementType;

export const NavbarSearch: React.FC<NavbarSearchProps> = ({
  placeholder = "Search notes, authors, and tags...",
  onSearch,
  className = "",
  isOpen = false,
  onOpenChange,
  inputRef,
}) => {
  const [value, setValue] = React.useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && value.trim()) {
      onSearch?.(value);
    }
  };

  return (
    <div className={`${styles.searchWrap} ${className}`}>
      <SearchIcon className={styles.searchIcon} />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={styles.searchInput}
      />
    </div>
  );
};
