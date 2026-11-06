"use client";

import React from "react";
import Image from "next/image";

interface CoolLoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function CoolLoader({ className = "", size = "md" }: CoolLoaderProps) {
  const containerSize =
    size === "sm" ? "w-16 h-16" : size === "lg" ? "w-28 h-28" : "w-20 h-20";
  const innerSize =
    size === "sm" ? "w-8 h-8" : size === "lg" ? "w-12 h-12" : "w-10 h-10";

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Ambient background aura glow */}
      <div className="absolute w-36 h-36 rounded-full bg-gradient-to-tr from-[#FF5500]/25 via-amber-400/20 to-transparent blur-2xl animate-pulse pointer-events-none" />

      {/* Outer orbital spinning gradient ring */}
      <div
        className={`${containerSize} rounded-full border-2 border-orange-500/10 border-t-[#FF5500] border-r-amber-400 animate-spin [animation-duration:1.2s] shadow-sm`}
      />

      {/* Counter-rotating inner orbital ring */}
      <div
        className={`absolute inset-2 rounded-full border-2 border-amber-500/10 border-b-[#FF5500] border-l-orange-300 animate-spin [animation-duration:1.8s] [animation-direction:reverse]`}
      />

      {/* Center luxury emblem tile */}
      <div
        className={`absolute ${innerSize} rounded-2xl bg-white/95 backdrop-blur-md shadow-md shadow-orange-500/20 border border-orange-100/90 flex items-center justify-center p-1.5 overflow-hidden transition-transform animate-pulse [animation-duration:2s]`}
      >
        <div className="relative w-full h-full">
          <Image
            src="/beauty-aura-logo.png"
            alt="Loading"
            fill
            sizes="48px"
            className="object-cover scale-110"
            priority
          />
        </div>
      </div>
    </div>
  );
}

