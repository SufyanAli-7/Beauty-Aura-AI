"use client";

import Image from "next/image";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  dark?: boolean;
}

export function Logo({ className = "", size = "md", dark = false }: LogoProps) {
  const iconSize = size === "sm" ? "h-9 w-9" : size === "lg" ? "h-12 w-12" : "h-11 w-11";
  const titleSize = size === "sm" ? "text-lg" : size === "lg" ? "text-2xl" : "text-xl";
  const subSize = size === "sm" ? "text-[9px]" : "text-[10px]";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Generated Nano-Banana Luxury Aura Logo Emblem */}
      <div
        className={`relative ${iconSize} shrink-0 overflow-hidden rounded-2xl shadow-md shadow-orange-500/20 transition-transform duration-300 group-hover:scale-105 border-0 border-none outline-none ring-0 ${
          dark ? "bg-white/10 ring-1 ring-white/10" : "bg-white"
        }`}
      >
        <Image
          src="/beauty-aura-logo.png"
          alt="BeautyAura.ai Logo"
          fill
          priority
          sizes="48px"
          className="object-cover scale-110"
        />
      </div>

      {/* Typography: BeautyAura.ai */}
      <div className="flex flex-col text-left">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`${titleSize} font-extrabold tracking-tight transition-colors ${
              dark
                ? "text-white group-hover:text-orange-400"
                : "text-zinc-900 group-hover:text-[#FF5500]"
            }`}
          >
            BeautyAura
          </span>
          <span className="rounded-md bg-gradient-to-r from-[#FF5500] to-[#FF7A1A] px-1.5 py-0.5 text-[10px] font-black tracking-wider text-white uppercase shadow-xs">
            AI
          </span>
        </div>
        <span
          className={`mt-1 font-semibold tracking-widest uppercase ${subSize} ${
            dark ? "text-stone-400" : "text-zinc-400"
          }`}
        >
          Fashion &amp; Beauty Lab
        </span>
      </div>
    </div>
  );
}
