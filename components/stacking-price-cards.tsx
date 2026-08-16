"use client"

import { useEffect, useRef, useState } from "react"

const PLANS = [
  {
    badge: "SUZISH HAVZASI",
    heading: "Bolalar 3–12",
    prices: [
      { label: "Bir kunlik", value: "30 000 so'm" },
      { label: "Oylik (12 tashrif)", value: "420 000 so'm" },
    ],
    variant: "kid" as const,
    theme: "pool" as const,
  },
  {
    badge: "SUZISH HAVZASI",
    heading: "Kattalar 12+",
    prices: [
      { label: "Bir kunlik", value: "50 000 so'm" },
      { label: "Oylik (12 tashrif)", value: "600 000 so'm" },
    ],
    variant: "adult" as const,
    theme: "pool" as const,
  },
  {
    badge: "SAUNA",
    heading: "4 kishilik xona",
    prices: [
      { label: "Narxi", value: "250 000 so'm" },
    ],
    variant: "kid" as const,
    theme: "sauna" as const,
  },
  {
    badge: "SAUNA",
    heading: "6 kishilik xona",
    prices: [
      { label: "Narxi", value: "350 000 so'm" },
    ],
    variant: "adult" as const,
    theme: "sauna" as const,
  },
]

const STICKY_TOP   = 80   // matches top: 80px on first card
const STICKY_STEP  = 16   // each card stacks 16px lower
const SCALE_STEP   = 0.04 // scale reduction per card stacked on top
const OFFSET_STEP  = 8    // px pushed down per card stacked on top

function Tag({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "gold" | "sky" }) {
  const styles = {
    default: "text-slate-700 bg-black/[0.04]",
    gold: "text-amber-700 bg-amber-400/20 border border-amber-400/30",
    sky: "text-sky-700 bg-sky-500/10 border border-sky-400/30",
  }[variant]

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans font-semibold ${styles}`}>
      {children}
    </span>
  )
}

// Ocean logo rendered large with a pseudo-3D tilt, drop-shadow glow, glossy
// highlight overlay, and a slow float. "adult" = larger/deeper. "kid" = smaller,
// lighter variant via filter. "gold" recolors the whole thing amber for the
// sauna cards instead of the default blue.
function OceanOrb({ variant, delay = 0, gold = false }: { variant: "adult" | "kid"; delay?: number; gold?: boolean }) {
  const isAdult = variant === "adult"
  const size = isAdult ? 260 : 210
  const blobGradient = gold
    ? (isAdult
        ? "radial-gradient(circle, rgba(217,119,6,0.35) 0%, rgba(120,53,15,0.18) 55%, transparent 75%)"
        : "radial-gradient(circle, rgba(253,230,138,0.5) 0%, rgba(217,119,6,0.18) 55%, transparent 75%)")
    : (isAdult
        ? "radial-gradient(circle, rgba(0,119,182,0.35) 0%, rgba(3,4,94,0.15) 55%, transparent 75%)"
        : "radial-gradient(circle, rgba(144,224,239,0.45) 0%, rgba(0,119,182,0.15) 55%, transparent 75%)")
  const logoFilterClass = gold
    ? (isAdult
        ? "sepia saturate-[3] hue-rotate-[-15deg] brightness-110 drop-shadow-[0_20px_40px_rgba(180,83,9,0.45)]"
        : "sepia saturate-[2] hue-rotate-[-10deg] brightness-125 drop-shadow-[0_20px_40px_rgba(180,83,9,0.45)]")
    : (isAdult
        ? "drop-shadow-[0_20px_40px_rgba(0,119,182,0.4)]"
        : "drop-shadow-[0_20px_40px_rgba(0,119,182,0.4)] brightness-125 saturate-75 hue-rotate-[-10deg]")

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size * 1.3, height: size * 1.3, perspective: "800px" }}
    >
      {/* Soft blurred blue blob so the logo doesn't float on plain background */}
      <div
        className="absolute rounded-full"
        style={{ width: size * 1.15, height: size * 1.15, background: blobGradient, filter: "blur(30px)" }}
      />

      {/* Floating logo */}
      <div
        style={{
          animation: `oceanOrbFloat 5s ease-in-out ${delay}ms infinite alternate`,
        }}
      >
        <div
          className="relative"
          style={{
            width: size,
            height: size,
            transform: "rotateY(-12deg) rotateX(6deg)",
            transformStyle: "preserve-3d",
          }}
        >
          <img
            src="/images/ocean-icon.png"
            alt=""
            aria-hidden="true"
            className={`w-full h-full rounded-full object-cover ${logoFilterClass}`}
          />
          {/* Glossy highlight overlay — white radial gradient, upper-left */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 50%)",
            }}
          />
        </div>
      </div>
    </div>
  )
}

export function StackingPriceCards() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])
  // depth[i] = 0..N how many cards are currently stacked on top of card i
  const [depth, setDepth] = useState<number[]>(PLANS.map(() => 0))

  useEffect(() => {
    function onScroll() {
      const nextDepth = PLANS.map((_, i) => {
        // Count how many cards j > i are currently in sticky position (i.e. have scrolled past card i)
        let count = 0
        for (let j = i + 1; j < PLANS.length; j++) {
          const el = cardRefs.current[j]
          if (!el) continue
          const rect = el.getBoundingClientRect()
          const stickyTopJ = STICKY_TOP + j * STICKY_STEP
          // Card j is "on top of" card i when it has reached its sticky position
          if (rect.top <= stickyTopJ + 2) count++
        }
        return count
      })
      setDepth(nextDepth)
    }

    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="flex flex-col" style={{ perspective: "1400px", perspectiveOrigin: "50% 0%" }}>
      {PLANS.map((plan, i) => {
        const d         = depth[i]
        const scale     = 1 - d * SCALE_STEP
        const translateY = d * OFFSET_STEP
        const isGold    = plan.theme === "sauna"

        return (
          <div
            key={`${plan.badge}-${plan.heading}`}
            ref={el => { cardRefs.current[i] = el }}
            className="sticky mb-4"
            style={{ top: `${STICKY_TOP + i * STICKY_STEP}px`, zIndex: 10 + i }}
          >
            <div
              style={{
                transform:      `scale(${scale}) translateY(${translateY}px)`,
                transformOrigin: "top center",
                transition:     "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
                willChange:     "transform",
              }}
            >
              <div
                className={
                  isGold
                    ? "group relative bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl border border-amber-300/50 overflow-hidden cursor-pointer"
                    : "group relative bg-[#faf9f7] rounded-2xl border border-black/[0.07] overflow-hidden cursor-pointer"
                }
              >

                {/* ── MOBILE: orb top ── */}
                <div className="relative w-full h-52 pointer-events-none md:hidden flex items-center justify-center overflow-hidden">
                  <OceanOrb variant={plan.variant} delay={i * 300} gold={isGold} />
                </div>

                {/* ── DESKTOP: orb right ── */}
                <div className="hidden md:flex absolute inset-y-0 right-0 w-1/2 items-center justify-center pointer-events-none overflow-hidden">
                  <OceanOrb variant={plan.variant} delay={i * 300} gold={isGold} />
                </div>

                {/* Text content — same compact min-height on all 4 cards */}
                <div className="relative z-10 p-8 min-h-[260px]">
                  <div className="md:max-w-[60%]">
                    <div className="flex items-start justify-between mb-6">
                      <Tag variant={isGold ? "gold" : "sky"}>{plan.badge}</Tag>
                    </div>
                    <h3 className="text-xl font-light mb-8">{plan.heading}</h3>
                  </div>
                  {plan.prices.length > 1 ? (
                    <div className={`pt-1 md:max-w-[60%] divide-y ${isGold ? "border-t border-amber-300/40 divide-amber-300/40" : "border-t border-black/[0.06] divide-black/[0.06]"}`}>
                      {plan.prices.map((p) => (
                        <div key={p.label} className="py-2">
                          <div className={`text-xs tracking-wide ${isGold ? "text-amber-700/60" : "text-black/40"}`}>{p.label}</div>
                          <div className={`text-xl md:text-2xl font-bold tracking-tight ${isGold ? "text-amber-600" : "text-[#03045E]"}`}>{p.value}</div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className={`pt-6 md:max-w-[60%] ${isGold ? "border-t border-amber-300/40" : "border-t border-black/[0.06]"}`}>
                      <div className={`text-4xl md:text-5xl font-bold tracking-tight ${isGold ? "text-amber-600" : "text-[#03045E]"}`}>
                        {plan.prices[0].value}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          </div>
        )
      })}

      <style>{`
        @keyframes oceanOrbFloat {
          0%   { transform: translateY(0); }
          100% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
