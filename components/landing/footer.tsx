"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "./logo";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <footer className="relative bg-[#1C0D06] text-white pt-16 pb-12 sm:pt-20 sm:pb-14 overflow-hidden border-t border-orange-950/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Col 1: Brand & Bio (4 cols on lg) */}
          <div className="lg:col-span-4 flex flex-col space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Logo dark />
            </Link>

            <p className="text-xs sm:text-sm text-stone-300/80 leading-relaxed max-w-sm">
              Transforming your fashion, skin, hair, and portraits with cutting-edge AI. Perfect for content creators, models, barbershops, or personal glow-ups.
            </p>
          </div>

          {/* Col 2: Quick Links (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Quick Links
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-stone-300/80">
              <li>
                <Link href="#hero" className="hover:text-[#FF5500] transition-colors">
                  • About Us
                </Link>
              </li>
              <li>
                <Link href="#features" className="hover:text-[#FF5500] transition-colors">
                  • Gallery
                </Link>
              </li>
              <li>
                <Link href="#services" className="hover:text-[#FF5500] transition-colors">
                  • How It Works
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="hover:text-[#FF5500] transition-colors">
                  • Shipping
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Info (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              Contact
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs sm:text-sm text-stone-300/80">
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                <span>+0149-0000-0000</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                <span>support@beautyaura.ai</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#FF5500] shrink-0" />
                <span>Multan, Pakistan</span>
              </li>
              <li className="pl-5 text-stone-400 text-xs">
                31450, PTC
              </li>
            </ul>
          </div>

          {/* Col 4: Newsletter (3 cols on lg) */}
          <div className="lg:col-span-3 flex flex-col">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">
              News Letter
            </h4>
            <p className="mt-4 text-xs sm:text-sm text-stone-300/80 leading-snug">
              • Subscribe for our daily updates.
            </p>

            <form onSubmit={handleSubscribe} className="mt-4 flex items-center">
              <div className="relative flex w-full items-center">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                  className="w-full rounded-full border border-stone-700/80 bg-stone-900/90 py-2.5 pl-4 pr-12 text-xs sm:text-sm text-white placeholder-stone-400 focus:border-[#FF5500] focus:outline-none focus:ring-1 focus:ring-[#FF5500]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe to newsletter"
                  className="absolute right-1.5 flex h-8 w-8 items-center justify-center rounded-full bg-[#FF5500] text-white transition hover:bg-[#E64C00] shadow-sm cursor-pointer border-0 border-none outline-none ring-0 focus:outline-none"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </form>
            {subscribed && (
              <span className="mt-2 text-xs text-orange-400">
                ✓ Thank you for subscribing!
              </span>
            )}
          </div>
        </div>

        {/* Bottom copyright line (matching mockup) */}
        <div className="mt-14 border-t border-stone-800/80 pt-6 text-center text-xs text-stone-400">
          <p>© 2026 BeautyAura. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

