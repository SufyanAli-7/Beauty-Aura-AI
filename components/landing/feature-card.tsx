"use client";

import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";

export interface FeatureCardProps {
  id?: string;
  tag: string;
  title: string;
  scriptTitle?: string;
  description: string;
  imageSrc: string;
  imageAlt: string;
  subImageSrc?: string;
  subImageAlt?: string;
  reversed?: boolean;
  actionText?: string;
}

export function FeatureCard({
  id,
  tag,
  title,
  scriptTitle,
  description,
  imageSrc,
  imageAlt,
  subImageSrc,
  subImageAlt,
  reversed = false,
  actionText = "Try this look free",
}: FeatureCardProps) {
  return (
    <div id={id} className="relative py-12 sm:py-16">
      <div
        className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 ${
          reversed ? "lg:grid-flow-dense" : ""
        }`}
      >
        {/* Visual / Image showcase with offset wireframe outlines (mockup signature style) */}
        <div
          className={`relative mx-auto w-full max-w-md lg:max-w-none ${
            reversed ? "lg:col-start-2" : "lg:col-start-1"
          }`}
        >
          <div className="relative mx-auto aspect-[4/3] sm:aspect-[16/11] max-w-lg">
            {/* Background offset wireframe outlines */}
            <div
              className={`absolute inset-0 rounded-3xl border border-amber-300/60 pointer-events-none transition-transform duration-500 ${
                reversed ? "rotate-[-3deg] translate-x-[-8px] translate-y-[-6px]" : "rotate-[3deg] translate-x-[8px] translate-y-[-6px]"
              }`}
            />
            <div
              className={`absolute inset-0 rounded-3xl border border-orange-200/70 pointer-events-none transition-transform duration-500 ${
                reversed ? "rotate-[2deg] translate-x-[6px] translate-y-[8px]" : "rotate-[-2deg] translate-x-[-6px] translate-y-[8px]"
              }`}
            />

            {/* Main Rounded Photo Card */}
            <div className="relative h-full w-full overflow-hidden rounded-3xl border border-orange-100 bg-white p-2.5 shadow-xl shadow-orange-950/5">
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-orange-50/50">
                <Image
                  src={imageSrc}
                  alt={imageAlt}
                  fill
                  className="object-cover object-top transition-transform duration-700 hover:scale-105"
                />

                {/* Subtle top badge */}
                <div className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur-md flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-[#FF5500]" />
                  <span>AI Generated</span>
                </div>
              </div>
            </div>

            {/* Optional floating secondary mini badge / asset */}
            {subImageSrc && (
              <div
                className={`absolute -bottom-5 ${
                  reversed ? "-left-5" : "-right-5"
                } z-10 hidden sm:block w-28 h-28 rounded-2xl border-2 border-white bg-white p-1.5 shadow-lg shadow-orange-900/10 transition-transform hover:scale-110 duration-300`}
              >
                <div className="relative h-full w-full overflow-hidden rounded-xl">
                  <Image
                    src={subImageSrc}
                    alt={subImageAlt || "Detail preview"}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Content */}
        <div
          className={`flex flex-col text-left ${
            reversed ? "lg:col-start-1" : "lg:col-start-2"
          }`}
        >
          {/* Tag Pill with dot */}
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50/90 px-3.5 py-1 text-xs font-semibold text-orange-800">
            <span className="h-2 w-2 rounded-full bg-[#FF5500]" />
            {tag}
          </div>

          {/* Script / Artistic Heading with peach brush backdrop (exact match from mockup) */}
          <div className="relative mt-4 mb-3 inline-block">
            <span className="relative z-10 font-script text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-wide text-zinc-900 drop-shadow-xs">
              {scriptTitle || title}
            </span>
            {/* Soft peach brush watercolor highlight */}
            <span
              className="absolute -bottom-1 left-0 -right-4 h-7 -z-0 opacity-80 pointer-events-none rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,224,204,0.85) 0%, rgba(255,206,179,0.9) 60%, rgba(255,235,219,0.5) 100%)",
                transform: "rotate(-1deg) skewX(-12deg)",
              }}
            />
          </div>

          {/* Description */}
          <p className="mt-2 text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            {description}
          </p>

          {/* Action Link */}
          <div className="mt-6 flex items-center gap-3">
            <a
              href="#hero"
              className="group inline-flex items-center gap-2 rounded-full bg-orange-100/80 hover:bg-orange-200/90 border-0 border-none outline-none ring-0 px-4 py-2 text-xs font-semibold text-[#FF5500] transition-all cursor-pointer"
            >
              <span>{actionText}</span>
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

