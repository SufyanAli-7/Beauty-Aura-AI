"use client";

import { Shirt, Sparkles, Scissors, Wand2, ArrowUpRight } from "lucide-react";

export function ServicesGrid() {
  const services = [
    {
      title: "Virtual Wardrobe & Outfits",
      description:
        "Instantly swap luxury dresses, business blazers, streetwear tops, denim, and accessories onto your body with realistic fabric folding, stretch, and lighting.",
      icon: Shirt,
      accent: "from-orange-500 to-amber-500",
    },
    {
      title: "Skin & Body Contouring",
      description:
        "Pro-grade studio skin retouching, intelligent acne & blemish removal, body curve shaping, natural wrinkle smoothing, and radiant complexion correction.",
      icon: Sparkles,
      accent: "from-orange-600 to-rose-500",
    },
    {
      title: "Hair & Beard Makeover",
      description:
        "Try 50+ trending male & female hairstyles, hair extensions, bold dye colors, fades, and precision beard shaping with natural hairline blending.",
      icon: Scissors,
      accent: "from-amber-500 to-orange-500",
    },
    {
      title: "Studio Retouch & Magic AI",
      description:
        "HD photo enhancement, studio relighting, one-click background remover, clutter erase, and high-definition export ready for social campaigns.",
      icon: Wand2,
      accent: "from-orange-500 to-red-500",
    },
  ];

  return (
    <section id="services" className="relative py-20 sm:py-24 bg-[#FFF9F3]/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
            Our Services
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-zinc-600 leading-relaxed font-normal">
            We transform your photos into high-fashion editorial looks, pristine skin portraits, custom hairstyles, and eCommerce-ready showcases in a few intuitive clicks.
          </p>
        </div>

        {/* 4 Service Cards Grid (Matching mockup layout & colors) */}
        <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <a
                key={index}
                href="#features"
                className="group relative flex flex-col justify-between rounded-3xl border border-orange-200/70 bg-[#FFF5EC] p-7 transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-900/5 cursor-pointer"
              >
                <div>
                  {/* Orange Icon Container */}
                  <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF5500] to-[#FF841A] text-white shadow-md shadow-orange-500/25 transition-transform group-hover:scale-110">
                    <IconComponent className="h-7 w-7" />
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold tracking-tight text-zinc-900 group-hover:text-[#FF5500] transition-colors">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Card footer link */}
                <div className="mt-6 flex items-center gap-1.5 text-xs font-semibold text-[#FF5500] group-hover:underline">
                  <span>Explore service</span>
                  <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

