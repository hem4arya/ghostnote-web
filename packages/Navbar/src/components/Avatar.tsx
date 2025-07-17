"use client";

import Image from "next/image";
import React from "react";
import { AvatarProps } from "../types";
import styles from "./Navbar.module.css";

export const Avatar: React.FC<AvatarProps> = ({ user, size = "md" }) => {
  // Generate initials from name
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .substring(0, 2);

  const sizeClass = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  }[size];

  return (
    <div className={`${styles.userAvatar} ${sizeClass}`}>
      {user.image ? (
        <Image
          src={user.image}
          alt={user.name}
          width={40}
          height={40}
          className="w-full h-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};
