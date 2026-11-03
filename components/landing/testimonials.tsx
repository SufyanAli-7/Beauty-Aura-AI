"use client";

import Image from "next/image";
import { Star, Quote } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      name: "Daniel R.",
      role: "Fashion Creator & Stylist",
      avatar: "/normal-headshot/boy1.png",
      rating: 5,
      quote:
        "“The virtual clothing try-on saved me countless hours of physical photoshoots. I can test 20 different designer outfits on my actual photo in minutes with incredible fabric realism!”",
      theme: "orange",
    },
    {
      name: "Hannan K.",
      role: "Editorial Photographer",
      avatar: "/normal-headshot/girl2.png",
      rating: 5,
      quote:
        "“The skin retouching and beard styling tool is insane. Super easy to use, keeps natural skin texture intact without looking plastic, and the results blow my clients away.”",
      theme: "dark",
    },
  ];

  return (
    <section id="testimonials" className="relative py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            What Our Community Says
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            Hear from our amazing community of fashion creators, barbers, photographers, and beauty enthusiasts transforming their photos with BeautyAura.
          </p>
        </div>

        {/* Testimonial Cards Grid (Terracotta & Dark Brown from mockup) */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-4xl mx-auto">
          {reviews.map((review, index) => {
            const isOrange = review.theme === "orange";
            return (
              <div
                key={index}
                className={`relative flex flex-col justify-between rounded-3xl p-8 shadow-xl transition-transform hover:-translate-y-1.5 duration-300 ${
                  isOrange
                    ? "bg-[#D8571F] text-white shadow-orange-900/15"
                    : "bg-[#25130A] text-white shadow-stone-900/20"
                }`}
              >
                {/* Quote Icon Bubble */}
                <div
                  className={`mb-6 flex h-10 w-10 items-center justify-center rounded-full ${
                    isOrange ? "bg-white/20 text-white" : "bg-orange-500/30 text-orange-400"
                  }`}
                >
                  <Quote className="h-5 w-5" />
                </div>

                {/* Quote Text */}
                <p className="text-sm sm:text-base leading-relaxed font-normal opacity-95">
                  {review.quote}
                </p>

                {/* User Info & Rating */}
                <div className="mt-8 flex items-center justify-between border-t border-white/15 pt-5">
                  <div className="flex items-center gap-3">
                    <div className="relative h-11 w-11 overflow-hidden rounded-full border-2 border-white/30 bg-white/10">
                      <Image
                        src={review.avatar}
                        alt={review.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white tracking-wide">
                        {review.name}
                      </h4>
                      <p className="text-xs text-white/70">{review.role}</p>
                    </div>
                  </div>

                  {/* 5 Stars */}
                  <div className="flex gap-0.5">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-amber-300 text-amber-300"
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

