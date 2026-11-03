"use client";

import { Users, Star, Image as ImageIcon } from "lucide-react";

export function StatsBanner() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#FF5500] via-[#FF6600] to-[#FF771C] py-7 text-white shadow-xl shadow-orange-600/10">
      {/* Decorative background lines */}
      <div className="pointer-events-none absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        {/* Left tagline */}
        <div className="max-w-md text-center sm:text-left">
          <p className="text-base sm:text-lg font-bold tracking-tight text-white leading-snug">
            Save your time by transforming your fashion, skin &amp; portraits in one AI platform!
          </p>
        </div>

        {/* Right metrics */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:gap-14">
          {/* Stat 1 */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
              50K+
            </span>
            <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">
              Active Users
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-white/30 hidden sm:block" />

          {/* Stat 2 */}
          <div className="flex flex-col items-center sm:items-start">
            <div className="flex items-center gap-1">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
                4.9
              </span>
              <Star className="h-5 w-5 fill-amber-300 text-amber-300" />
            </div>
            <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">
              User Rating
            </span>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-white/30 hidden sm:block" />

          {/* Stat 3 */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
              1.2M+
            </span>
            <span className="text-xs font-medium text-orange-100 uppercase tracking-wider">
              Photos Transformed
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

