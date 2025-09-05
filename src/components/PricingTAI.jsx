// src/components/PricingTAI.jsx
import React from "react";

export default function PricingTAI() {
  return (
    <section id="pricing" className="relative max-w-6xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <p className="uppercase tracking-[0.18em] text-white/50 text-xs">Pricing</p>
        <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
          Coming Soon
        </h2>
        <p className="mt-3 text-white/70 text-sm">
          We’re finalizing our Free, Basic, and Pro subscription plans.  
          Pay with card, stablecoins, or <span className="font-semibold">TRNDAI </span> 
          to unlock bonus usage. Stay tuned for launch!
        </p>
      </div>

      

      {/* Footnote */}
      <p className="mt-6 text-xs text-center text-white/55">
        Final pricing details will be announced soon. Annual prepay and TRNDAI
        discounts will be available at launch.
      </p>
    </section>
  );
}
