"use client";

import { Sparkles, Zap, ArrowDownToDot } from "lucide-react";
import { PricingSection } from "@/components/blocks/pricing-section";

const defaultTiers = [
  {
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "Perfect for individuals and small projects",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-gray-500/30 blur-2xl rounded-full" />
        <Zap className="w-7 h-7 relative z-10 text-gray-500 dark:text-gray-400 animate-[float_3s_ease-in-out_infinite]" />
      </div>
    ),
    features: [
      {
        name: "Basic Scrapping",
        description: "Track essential metrics",
        included: true,
      },
      {
        name: "Limited Credits",
        description: "50 Credits per month",
        included: true,
      },
      {
        name: "Basic Support",
        description: "Email support with 24h response time",
        included: true,
      },
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 100,
      yearly: 1000,
    },
    description: "Ideal for growing teams and projects ",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <ArrowDownToDot className="w-7 h-7 relative z-10" />
      </div>
    ),
    features: [
      {
        name: "Advanced Scrapping",
        description: "Deep insights and custom results",
        included: true,
      },
      {
        name: "Unlimited Credits",
        description: "Scale your creativity without limits",
        included: true,
      },
      {
        name: "Priority Support",
        description: "24/7 priority email and chat support",
        included: true,
      },
      {
        name: "Scrap Media",
        description: "Scrap Media From Websites",
        included: true,
      },
      {
        name: "Fast Scrapping",
        description: "Fast scrapping with advance AI filters",
        included: true,
      },
    ],
  },
];

export default function PricingSectionDemo() {
  return (
    <div className="md:pt-0 pt-20">
      <PricingSection className="dark bg-transparent" tiers={defaultTiers} />
    </div>
  );
}
