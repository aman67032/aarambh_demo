"use client";

import React from "react";

export interface FloatingDockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
}

export function FloatingDock({
  items,
  className = "",
  mobileClassName = "",
}: {
  items: FloatingDockItem[];
  className?: string;
  mobileClassName?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 px-3 py-4 shadow-2xl ${className} ${mobileClassName}`}
    >
      {items?.map((item) => (
        <a
          key={item.title}
          href={item.href}
          className="group relative flex items-center justify-center w-12 h-12 rounded-full bg-white/15 hover:bg-white/25 border border-white/30 text-white transition-colors"
          aria-label={item.title}
        >
          <span className="flex items-center justify-center w-6 h-6">
            {item.icon}
          </span>
          <span className="pointer-events-none absolute left-14 whitespace-nowrap rounded-md bg-black/70 px-2 py-1 text-xs opacity-0 shadow-lg transition-opacity group-hover:opacity-100">
            {item.title}
          </span>
        </a>
      ))}
    </div>
  );
}

export default FloatingDock;


