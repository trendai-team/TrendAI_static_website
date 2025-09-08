// src/components/PricingTAI.jsx
import React, { useState } from "react";

export default function PricingTAI() {
  const [annual, setAnnual] = useState(false);

  // USD pricing
  const prices = {
    basic: annual ? 108 : 10, // 10% off annually → $108/yr
    pro: annual ? 270 : 25,   // 10% off annually → $270/yr
  };

  const tiers = [
    {
      name: "Free",
      priceLabel: "$0",
      suffix: "forever",
      note: "Explore TrendAI with essential tools",
      cta: "Get Started",
      href: "#get-started",
      features: [
        "10 queries / day",
        "Basic sentiment charts",
        "Top 5 mentioned tokens",
        "Community support",
      ],
      highlighted: false,
      badge: null,
      perk: null,
    },
    {
      name: "Basic",
      priceLabel: annual ? `$${prices.basic}` : `$${prices.basic}`,
      suffix: annual ? "/year" : "/month",
      note: "Everyday analytics for active users",
      cta: annual ? "Choose Basic (Annual –10%)" : "Choose Basic (Monthly)",
      href: "#subscribe-basic",
      features: [
        "Unlimited sentiment queries",
        "Full dashboards (mentions, comments)",
        "Daily AI summaries",
        "Export (CSV / JSON)",
        "Standard support",
      ],
      highlighted: true,
      badge: "Most popular",
      perk: { label: "Pay with TRNDAI → +15% bonus usage", color: "text-cyan-300" },
    },
    {
      name: "Pro",
      priceLabel: annual ? `$${prices.pro}` : `$${prices.pro}`,
      suffix: annual ? "/year" : "/month",
      note: "For creators, teams & power users",
      cta: annual ? "Choose Pro (Annual –10%)" : "Choose Pro (Monthly)",
      href: "#subscribe-pro",
      features: [
        "Everything in Basic",
        "AI content generator (tweets, memes, threads)",
        "Scheduled posts & threads",
        "Narrative maps & theme clustering",
        "Priority support",
      ],
      highlighted: false,
      badge: null,
      perk: { label: "Pay with TRNDAI → +25% bonus usage", color: "text-pink-300" },
    },
  ];

  return (
    <section id="pricing" className="relative max-w-6xl mx-auto px-6">
      {/* Header + toggle */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="uppercase tracking-[0.18em] text-white/50 text-xs">
            Pricing
          </p>
          <h2 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
            Simple, transparent & token-friendly
          </h2>
          <p className="mt-2 text-white/70 text-sm">
            Pay with card, stablecoins, or <span className="font-semibold">TRNDAI</span>.
            Paying in TRNDAI unlocks bonus usage instead of a lower sticker price.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className={`text-sm ${annual ? "text-white/60" : "text-white"}`}>Monthly</span>
          <button
            onClick={() => setAnnual((a) => !a)}
            aria-label="Toggle monthly/annual"
            className="relative inline-flex h-9 w-20 items-center rounded-full bg-white/10 border border-white/10"
          >
            <span
              className="absolute h-7 w-7 rounded-full transition-transform"
              style={{
                background: "var(--grad-brand)",
                transform: annual ? "translateX(48px)" : "translateX(4px)",
              }}
            />
          </button>
          <span className={`text-sm ${annual ? "text-white" : "text-white/60"}`}>
            Annual <span className="text-[color:var(--brand-cyan)]">(save ~10%)</span>
          </span>
        </div>
      </div>

      {/* Cards */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {tiers.map((t, i) => {
          const colSpan = "lg:col-span-4";
          const colStart =
            i === 0 ? "lg:col-start-1" : i === 1 ? "lg:col-start-5" : "lg:col-start-9";

          return (
            <div key={t.name} className={`${colStart} ${colSpan}`}>
              <article
                className={`relative rounded-3xl p-6 border bg-white/[0.04] border-white/10 backdrop-blur-md ${
                  t.highlighted ? "bg-[#0d1126]" : ""
                }`}
              >
                {t.badge && (
                  <span
                    className="absolute -top-3 right-4 px-2 py-1 rounded-full text-[10px] font-semibold text-black"
                    style={{ background: "var(--grad-brand)" }}
                  >
                    {t.badge}
                  </span>
                )}

                <header className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{t.name}</h3>
                </header>

                <div className="mt-3">
                  <div className="text-3xl md:text-4xl font-extrabold leading-none">
                    {t.priceLabel}{" "}
                    <span className="text-sm md:text-base font-normal text-white/70">
                      {t.suffix}
                    </span>
                  </div>
                  <p className="text-white/70 text-sm mt-1">{t.note}</p>
                  {t.perk && (
                    <p className={`mt-2 text-xs font-medium ${t.perk.color}`}>
                      {t.perk.label}
                    </p>
                  )}
                </div>

                <ul className="mt-5 text-white/85 text-sm space-y-2">
                  {t.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <svg width="16" height="16" viewBox="0 0 24 24" className="mt-0.5 opacity-90">
                        <path
                          d="M20 6 9 17l-5-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                      </svg>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={t.href}
                  className={`mt-6 inline-flex w-full items-center justify-center gap-2 px-4 py-2.5 rounded-xl ${
                    t.highlighted
                      ? "text-black"
                      : "bg-white/10 border border-white/10 text-white"
                  } font-medium hover:opacity-95 transition`}
                  style={t.highlighted ? { background: "var(--grad-brand)" } : {}}
                >
                  {t.cta}
                </a>
              </article>
            </div>
          );
        })}
      </div>

      {/* TRNDAI comparison strip */}
      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center justify-between md:justify-start gap-3">
            <span className="px-2 py-1 rounded-full text-xs font-medium text-black" style={{ background: "var(--grad-brand)" }}>
              TRNDAI Bonus
            </span>
            <span className="text-white/80">Paying with TRNDAI unlocks extra usage (not a price cut).</span>
          </div>
          <div className="flex items-center justify-between md:justify-center gap-3">
            <span className="text-white/60">Basic</span>
            <span className="text-cyan-300 font-medium">+15% usage</span>
          </div>
          <div className="flex items-center justify-between md:justify-end gap-3">
            <span className="text-white/60">Pro</span>
            <span className="text-pink-300 font-medium">+25% usage</span>
          </div>
        </div>
      </div>

      {/* Footnotes */}
      <p className="mt-4 text-xs text-white/55">
        Examples: Basic ≈ 1,000 queries / month; Pro ≈ 3,000 queries / month. Paying in TRNDAI grants additional
        usage capacity (Basic +15%, Pro +25%). Annual prepay ~10% discount already applied. Future roadmap may include
        partial burns or staking boosts for payments in TRNDAI.
      </p>
    </section>
  );
}
