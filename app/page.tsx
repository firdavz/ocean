"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import { Ruler, Users, Calendar, Clock } from "lucide-react"
import { IntroAnimation, HERO_REVEAL_MS } from "@/components/intro-animation"
import { RevealText } from "@/components/reveal-text"
import { StackingPriceCards } from "@/components/stacking-price-cards"
import { MobileNav } from "@/components/mobile-nav"
import { InfoSection } from "@/components/info-section"

// ─── Intersection Observer hook ──────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true) }, { threshold })
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, inView }
}

// ─── Animated counter ────────────────────────────────────────────────────────
function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const { ref, inView } = useInView()
  useEffect(() => {
    if (!inView) return
    let start = 0
    const duration = 1800
    const step = 16
    const increment = end / (duration / step)
    const timer = setInterval(() => {
      start += increment
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, step)
    return () => clearInterval(timer)
  }, [inView, end])
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ─── Pill tag ─────────────────────────────────────────────────────────────────
function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-black/40 bg-black/[0.04]">
      {children}
    </span>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function OceanLandingPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [heroReady, setHeroReady] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const handleIntroDone = useCallback(() => {
    setHeroReady(true)
  }, [])

  // Start video zoom slightly before hero content reveals, for seamless overlap
  useEffect(() => {
    const t = setTimeout(() => setVideoReady(true), HERO_REVEAL_MS)
    return () => clearTimeout(t)
  }, [])

  const month = new Date().getMonth() + 1 // 1-12
  const isWinter = month === 10 || month === 11 || month === 12 || month <= 3
  const heroQuote = isWinter ? "Qishning eng issiq manzili" : "Yozning eng salqin manzili"
  const contactHeading = isWinter ? "Qishni o'tkazib yubormang !" : "Yozni o'tkazib yubormang !"
  const heroVideoSrc = isWinter ? "/sauna.mp4" : "/hero.mp4"

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    el.style.setProperty("--mouse-x", `${e.clientX - rect.left}px`)
    el.style.setProperty("--mouse-y", `${e.clientY - rect.top}px`)
  }

  return (
    <div className="bg-white text-[#111] min-h-screen font-sans antialiased">

      {/* ── INTRO ANIMATION ───────────────────────────────────────────────── */}
      <IntroAnimation onDone={handleIntroDone} />

      {/* ── STICKY NAV ────────────────────────────────────────────────────── */}
      <MobileNav />

      {/* ── HERO ──────────────────────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex flex-col justify-end items-start md:flex-row md:justify-start md:items-end bg-[#03045E] overflow-hidden">
        {/* Full-bleed background video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          src={heroVideoSrc}
          style={{
            opacity: videoReady ? 1 : 0,
            transform: videoReady ? "scale(1)" : "scale(1.1)",
            filter: "saturate(1.15) contrast(1.08) brightness(1.05)",
            transition: "opacity 1.5s cubic-bezier(0.16,1,0.3,1) 0ms, transform 2s cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {/* Dark overlay for text legibility — blue tint, darker at bottom where text sits */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#03045E]/60 via-black/20 to-transparent" />

        {/* Kicker — bottom-right corner */}
        <div
          className="z-10 ml-6 mb-3 md:mb-0 md:ml-0 md:absolute md:bottom-12 md:right-16 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-white/20 bg-white/10 backdrop-blur-md self-start"
          style={{
            opacity: heroReady ? 1 : 0,
            filter: heroReady ? "blur(0px)" : "blur(24px)",
            transform: heroReady ? "translateY(0px)" : "translateY(32px)",
            transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white shrink-0">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span className="text-white text-xs md:text-sm tracking-widest uppercase">CHORTOQ · NAMANGAN</span>
        </div>

        <div className="relative z-10 w-full pb-12 md:pb-10 pl-6 md:pl-16">
          <div className="max-w-2xl">
            <h1
              className="text-3xl md:text-5xl font-light text-white leading-[1.1] tracking-tight drop-shadow-lg text-left"
              style={{
                opacity: heroReady ? 1 : 0,
                filter: heroReady ? "blur(0px)" : "blur(24px)",
                transform: heroReady ? "translateY(0px)" : "translateY(32px)",
                transition: "opacity 1s cubic-bezier(0.16,1,0.3,1) 0ms, filter 1s cubic-bezier(0.16,1,0.3,1) 0ms, transform 1s cubic-bezier(0.16,1,0.3,1) 0ms",
              }}
            >
              {heroQuote}
            </h1>
          </div>
        </div>
      </section>

      {/* ── SUZISH HAVZASI ───────────────────────────────────────────────── */}
      <section id="basseyn" className="relative bg-[#03045E] py-24 md:py-32 overflow-hidden">
        {/* Ambient cyan glow — restrained */}
        <div className="pointer-events-none absolute -top-32 -left-32 w-[28rem] h-[28rem] rounded-full bg-sky-400/10 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-center">

            {/* Left — editorial text */}
            <div className="md:col-span-5 md:pr-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-sky-400" />
                <span className="text-xs tracking-[0.3em] uppercase text-sky-300">Suzish havzasi</span>
              </div>

              <RevealText
                as="h2"
                className="mt-6 text-4xl md:text-5xl font-light tracking-tight leading-[1.1] text-white"
              >
                {"Ocean — bu shunchaki\nsuzish havzasi emas."}
              </RevealText>
            </div>

            {/* Right — cinematic video, allowed to bleed past the grid */}
            <div className="md:col-span-7 md:-mr-6 lg:-mr-16 xl:-mr-24">
              <div
                className="relative w-full h-[420px] md:h-[560px] lg:h-[620px] overflow-hidden shadow-2xl"
                style={{ borderRadius: "3rem 1rem 1rem 1rem" }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/ocean_3page.mp4"
                />

                {/* Thin cyan corner accent */}
                <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-sky-300/50 pointer-events-none" />
                <div className="absolute top-10 right-10 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_12px_4px_rgba(56,189,248,0.6)] pointer-events-none" />

                {/* Bottom fade so the stats stay legible over the video */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03045E] via-[#03045E]/70 to-transparent pointer-events-none" />

                {/* Stats — integrated into the frame, overlapping the video's lower edge */}
                <div className="absolute inset-x-0 bottom-0 px-5 md:px-8 pb-5 md:pb-8 flex items-end justify-between">
                  {[
                    { Icon: Ruler,    value: "500 m²",      label: "Maydon" },
                    { Icon: Clock,    value: "10:00–24:00", label: "Ish vaqti" },
                    { Icon: Calendar, value: "May–Sentabr", label: "Ish mavsumi" },
                  ].map(({ Icon, value, label }, i) => (
                    <div key={value} className={`flex flex-col ${i > 0 ? "pl-3 md:pl-6 border-l border-white/15" : ""}`}>
                      <Icon size={13} className="text-sky-300 mb-1.5" />
                      <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light text-white tracking-tight whitespace-nowrap">{value}</div>
                      <div className="mt-1 text-[9px] md:text-xs text-sky-100/50 tracking-widest uppercase">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SAUNA ─────────────────────────────────────────────────────────── */}
      <section id="sauna" className="relative bg-[#03045E] py-24 md:py-32 overflow-hidden">
        {/* Ambient cyan glow — restrained, mirrors the pool section */}
        <div className="pointer-events-none absolute -bottom-32 -right-32 w-[28rem] h-[28rem] rounded-full bg-sky-400/10 blur-[120px]" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6 items-center">

            {/* Left — editorial text, clean and spacious, no stats here */}
            <div className="md:col-span-5 md:pr-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-px bg-sky-400" />
                <span className="text-xs tracking-[0.3em] uppercase text-sky-300">Sauna</span>
              </div>

              <RevealText
                as="h2"
                className="mt-6 text-4xl md:text-5xl font-light tracking-tight leading-[1.1] text-white"
              >
                {"Tanangiz uchun eng yaxshi\ndam — Sauna"}
              </RevealText>
            </div>

            {/* Right — cinematic video, same frame language as the pool section */}
            <div className="md:col-span-7 md:-mr-6 lg:-mr-16 xl:-mr-24">
              <div
                className="relative w-full h-[420px] md:h-[560px] lg:h-[620px] overflow-hidden shadow-2xl"
                style={{ borderRadius: "1rem 3rem 1rem 1rem" }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                  src="/sauna.mp4"
                />

                {/* Thin cyan corner accent */}
                <div className="absolute top-6 right-6 w-10 h-10 border-t border-r border-sky-300/50 pointer-events-none" />
                <div className="absolute top-10 right-10 w-1.5 h-1.5 rounded-full bg-sky-300 shadow-[0_0_12px_4px_rgba(56,189,248,0.6)] pointer-events-none" />

                {/* Bottom fade so the stats stay legible over the video */}
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#03045E] via-[#03045E]/70 to-transparent pointer-events-none" />

                {/* Stats — attached to the bottom of the frame, same treatment as the pool section */}
                <div className="absolute inset-x-0 bottom-0 px-5 md:px-8 pb-5 md:pb-8 flex items-end justify-between">
                  {[
                    { Icon: Users,    value: "4 / 6 kishilik", label: "Xonalar" },
                    { Icon: Clock,    value: "11:00–24:00",    label: "Ish vaqti" },
                    { Icon: Calendar, value: "Noyabr–Mart",    label: "Ish mavsumi" },
                  ].map(({ Icon, value, label }, i) => (
                    <div key={value} className={`flex flex-col ${i > 0 ? "pl-3 md:pl-6 border-l border-white/15" : ""}`}>
                      <Icon size={13} className="text-sky-300 mb-1.5" />
                      <div className="text-lg sm:text-xl md:text-3xl lg:text-4xl font-light text-white tracking-tight whitespace-nowrap">{value}</div>
                      <div className="mt-1 text-[9px] md:text-xs text-sky-100/50 tracking-widest uppercase">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── PRICING (4 cards) ───────────────────────────────────────────────── */}
      <section id="narxlar" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#03045E]">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
            <div>
              <img src="/images/ocean-icon.png" alt="Ocean" className="w-10 h-10 rounded-full" />
              <div className="mt-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-sky-300 bg-white/10">
                  NARXLAR
                </span>
              </div>
              <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.1] text-white">
                {"Ocean Narxlari"}
              </RevealText>
            </div>
            <p className="text-lg text-sky-100 leading-relaxed max-w-md">
              Ocean'da narxlar 1 soatlik foydalanish uchun. Ko'proq ma'lumot uchun biz bilan bog'laning.
            </p>
          </div>

          <StackingPriceCards />
        </div>
      </section>

      {/* ── FACILITY INFO ────────────────────────────────────────────────── */}
      <InfoSection />

      {/* ── HOW IT WORKS ──────────────────────────────────────────────────── */}
      <section id="imkoniyatlar" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] overflow-hidden bg-[#03045E]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <img src="/images/ocean-icon.png" alt="Ocean" className="w-[50px] h-[50px] rounded-full" />
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-sky-300 bg-white/10">
                NEGA BIZ
              </span>
            </div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.1] text-white">
              {"Nega aynan Ocean"}
            </RevealText>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" onMouseMove={handleMouse}>
            {[
              { n: "01", title: "Milliy taomlar", desc: "Sevimli taomlaringizni do'stlaringiz bilan bahram oling — suzish havzasi yonida tayyorlanadi.", delay: 0, img: "/images/pilaf.jpg" },
              { n: "02", title: "Jonli futbol",    desc: "Katta ekranda barcha muhim o'yinlar — suvdan chiqmasdan tomosha qiling.", delay: 80, img: "/images/futbol.jpg" },
              { n: "03", title: "Jonli musiqa",    desc: "Kechqurunlari jonli ijro — suzish va musiqa bir joyda.", delay: 140, img: "/images/music.jpg" },
            ].map((step) => (
              <div
                key={step.n}
                className="group relative rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(0,119,182,0.5)]"
                style={{ transitionDelay: `${step.delay}ms` }}
              >
                {/* Real photo when available, otherwise a blue gradient placeholder with faint logo watermark */}
                <div className="p-4 pb-0">
                  <div className="relative w-full h-56 rounded-xl overflow-hidden bg-gradient-to-br from-[#0077B6] to-[#03045E] flex items-center justify-center">
                    {step.img ? (
                      <img
                        src={step.img}
                        alt={step.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : (
                      <img
                        src="/images/ocean-icon.png"
                        alt=""
                        aria-hidden="true"
                        className="w-32 h-32 object-contain"
                        style={{ opacity: 0.15 }}
                      />
                    )}
                  </div>
                </div>
                {/* Text */}
                <div className="relative z-10 px-7 pt-5 pb-7">
                  <span className="font-pixel text-[11px] text-sky-300/60 tracking-widest block mb-3">{step.n}</span>
                  <h3 className="text-2xl font-light mb-3 text-white">{step.title}</h3>
                  <p className="text-sm text-sky-100 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BOOK ──────────────────────────────────────────────────────────── */}
      <section id="contact" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#03045E]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 flex flex-col items-center">
            <img src="/images/ocean-icon.png" alt="Ocean" className="w-[60px] h-[60px] rounded-full" />
            <div className="mt-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-sky-300 bg-white/10">
                BOG'LANISH
              </span>
            </div>
            <RevealText className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.1] text-white">
              {contactHeading}
            </RevealText>
            <p className="mt-6 text-base md:text-lg text-white/70 leading-relaxed max-w-sm">
              Bugun joy band qiling — qo'ng'iroq qiling yoki Instagramdan yozing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3" onMouseMove={handleMouse}>
            {/* Phone card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl border border-white/25 bg-white/15 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              </div>
              <div className="font-pixel text-[11px] tracking-widest text-sky-300 mb-3">QO'NG'IROQ QILING</div>
              <a href="tel:+998949900055" className="text-2xl font-bold tracking-tight mb-6 text-white hover:text-sky-200 transition-colors">
                +998 94 990 00 55
              </a>
              <a
                href="tel:+998949900055"
                className="w-full py-3 rounded-xl text-sm tracking-widest transition-all duration-200 bg-white text-[#03045E] hover:bg-sky-100"
              >
                Qo'ng'iroq qilish
              </a>
            </div>

            {/* Instagram card */}
            <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-8 flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-xl border border-white/25 bg-white/15 flex items-center justify-center mb-6">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <defs>
                    <linearGradient id="bookIgGradient" x1="0" y1="24" x2="24" y2="0" gradientUnits="userSpaceOnUse">
                      <stop offset="0%" stopColor="#FFDC80" />
                      <stop offset="25%" stopColor="#FCAF45" />
                      <stop offset="50%" stopColor="#E1306C" />
                      <stop offset="75%" stopColor="#C13584" />
                      <stop offset="100%" stopColor="#833AB4" />
                    </linearGradient>
                  </defs>
                  <rect x="2" y="2" width="20" height="20" rx="5" stroke="url(#bookIgGradient)" strokeWidth="1.8" />
                  <circle cx="12" cy="12" r="4" stroke="url(#bookIgGradient)" strokeWidth="1.8" />
                  <circle cx="17.5" cy="6.5" r="1.2" fill="url(#bookIgGradient)" />
                </svg>
              </div>
              <div className="font-pixel text-[11px] tracking-widest text-sky-300 mb-3">INSTAGRAM</div>
              <a href="https://instagram.com/ocean_bassen_sauna" target="_blank" rel="noopener noreferrer" className="text-2xl font-bold tracking-tight mb-6 text-white hover:text-sky-200 transition-colors">
                @ocean_bassen_sauna
              </a>
              <a
                href="https://instagram.com/ocean_bassen_sauna"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 rounded-xl text-sm tracking-widest text-white transition-all duration-200"
                style={{ background: "linear-gradient(90deg, #833AB4, #C13584, #E1306C, #FCAF45, #FFDC80)" }}
              >
                Instagramni ochish
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-12 lg:px-20 border-t border-white/10 bg-[#03045E]">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <img src="/images/ocean-icon.png" alt="Ocean" className="w-16 h-16 rounded-full" />
            <span className="font-pixel text-sm tracking-[0.25em] text-white">OCEAN</span>
          </div>

          {/* Location tagline */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/15 bg-white/5">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-sky-300 shrink-0">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="text-xs text-sky-100/70 tracking-widest uppercase">Chortoq · Namangan</span>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-white/10">
          <span className="text-xs text-sky-100/60">© 2026 Ocean. Barcha huquqlar himoyalangan.</span>
        </div>
      </footer>
    </div>
  )
}
