"use client";

import { FeatureCard } from "./feature-card";

export function FeatureAlternating() {
  const features = [
    {
      id: "virtual-try-on",
      tag: "Popular",
      title: "Virtual Try-On",
      scriptTitle: "Virtual Try-On",
      description:
        "Turns your photos into high-fashion editorial looks with instant outfit try-on, tailored suits, evening dresses, jackets, and accessories. Our generative engine adapts the clothes naturally to your body posture, folds, and lighting.",
      imageSrc: "/ai-photo-editing-images/ai-virtual-cloth-try-on.webp",
      imageAlt: "AI Virtual Clothing Try-On Showcase",
      subImageSrc: "/fashion-looks/clothes/upper_blazer.jpg",
      subImageAlt: "Tailored blazer swatch",
      reversed: false,
      actionText: "Try on outfits now",
    },
    {
      id: "skin-face-ai",
      tag: "Trending",
      title: "Skin & Face AI",
      scriptTitle: "Skin & Face AI",
      description:
        "Turns your portraits into flawless, magazine-ready skin with smart acne & blemish removal, skin tone evening, gentle wrinkle softening, and natural texture preservation for realistic, radiant beauty.",
      imageSrc: "/ai-photo-editing-images/ai-skin-analaysis.webp",
      imageAlt: "AI Skin Retouching and Face Analysis",
      subImageSrc: "/ai-photo-editing-images/skin-type-analaysis.webp",
      subImageAlt: "Skin analysis swatch",
      reversed: true,
      actionText: "Analyze skin & glow",
    },
    {
      id: "hair-beard-studio",
      tag: "Fast",
      title: "Hair & Beard Studio",
      scriptTitle: "Hair & Beard Studio",
      description:
        "This feature lets you test fresh hairstyles, buzz cuts, pompadours, vibrant hair dye colors, and precision-groomed beards before committing at the salon. Hairline blending looks completely natural and sharp.",
      imageSrc: "/ai-photo-editing-images/beard-try-on.jpg",
      imageAlt: "AI Hair and Beard Makeover Studio",
      subImageSrc: "/ai-photo-editing-images/hair-color-try-on.png",
      subImageAlt: "Hair color palette swatch",
      reversed: false,
      actionText: "Experiment with hairstyles",
    },
    {
      id: "makeup-beauty",
      tag: "Studio Grade",
      title: "Glamour & Makeup Transfer",
      scriptTitle: "Glamour & Makeup",
      description:
        "Transfer iconic celebrity red-carpet makeup looks, try colored eye contacts, whiten teeth, sculpt contours, and enhance eyes with pixel-perfect accuracy for high-fashion portraits.",
      imageSrc: "/ai-photo-editing-images/ai-makeup-try-on.jpg",
      imageAlt: "AI Makeup and Beauty Transfer",
      subImageSrc: "/eye-lens/webp_eye_len_01.png",
      subImageAlt: "Eye contact lens preview",
      reversed: true,
      actionText: "Transfer makeup look",
    },
  ];

  return (
    <section id="features" className="relative divide-y divide-orange-100/40">
      {features.map((feature) => (
        <FeatureCard
          key={feature.id}
          {...feature}
        />
      ))}
    </section>
  );
}
