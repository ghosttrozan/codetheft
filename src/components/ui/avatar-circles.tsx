"use client";

import React from "react";

import { cn } from "@/lib/utils";

interface AvatarCirclesProps {
  className?: string;
  numPeople?: number;
  avatarUrls: string[];
  maxVisible?: number; // New prop to control max visible avatars
}

const AvatarCircles = ({
  numPeople,
  className,
  avatarUrls,
  maxVisible = 3, // Default to showing 3 avatars
}: AvatarCirclesProps) => {
  // Calculate how many avatars to actually display
  const visibleAvatars = avatarUrls.slice(0, maxVisible);
  // Calculate how many avatars are remaining
  const remainingCount = Math.max(
    0,
    (numPeople || avatarUrls.length) - maxVisible
  );

  return (
    <div className={cn("z-10 flex -space-x-4 rtl:space-x-reverse", className)}>
      {visibleAvatars.map((url, index) => (
        <img
          key={index}
          className="h-10 w-10 rounded-full border-2 border-white dark:border-gray-800"
          src={url}
          width={40}
          height={40}
          alt={`Avatar ${index + 1}`}
        />
      ))}
      {remainingCount > 0 && (
        <a
          className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-black text-center text-xs font-medium text-white hover:bg-gray-600 dark:border-gray-800 dark:bg-white dark:text-black"
          href=""
        >
          +{remainingCount}
        </a>
      )}
    </div>
  );
};

export { AvatarCircles };
