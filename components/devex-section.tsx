"use client"

import { useState, useEffect } from "react"
import { Calendar, MapPin, Ruler, Waves, Filter, ShieldCheck, SprayCan, UserCheck, Baby } from "lucide-react"

const TABS = [
  {
    num: "01",
    title: "Ocean haqida",
    desc: "Suzish havzasi va sauna haqida umumiy ma'lumot",
    heading: "Ocean haqida",
    items: [
      { Icon: Calendar, text: "2023-yildan beri faoliyat yuritamiz" },
      { Icon: MapPin,   text: "Chortoq markazi, Namangan" },
      { Icon: Ruler,    text: "Suzish havzasi maydoni — 500 m²" },
      { Icon: Waves,    text: "Sauna — Harvia jihozlari bilan qurilgan" },
    ],
  },
  {
    num: "02",
    title: "Tozalik",
    desc: "Suv tozaligi va filtratsiya tizimi",
    heading: "Suv tozaligi",
    items: [
      { Icon: Filter,      text: "4 bosqichli filtratsiya tizimi" },
      { Icon: ShieldCheck, text: "Suv tozaligi muntazam ravishda tekshiriladi" },
      { Icon: SprayCan,    text: "Zamonaviy dezinfeksiya vositalari qo'llaniladi" },
    ],
  },
  {
    num: "03",
    title: "Xavfsizlik",
    desc: "Xavfsizlik qoidalari",
    heading: "Xavfsizlik",
    items: [
      { Icon: UserCheck, text: "Basseynda doimiy nazoratchi xodim mavjud" },
      { Icon: Baby,      text: "3 yoshgacha bo'lgan bolalar kattalar nazorati ostida suzishi shart" },
    ],
  },
]

export function DevExSection() {
  const [active, setActive] = useState(0)
  const [visible, setVisible] = useState(true)

  function selectTab(i: number) {
    if (i === active) return
    setVisible(false)
    setTimeout(() => {
      setActive(i)
      setVisible(true)
    }, 180)
  }

  // Auto-advance every 5s; restarts fresh whenever `active` changes, so a
  // manual tab click resets the countdown instead of firing mid-cycle.
  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setActive(prev => (prev + 1) % TABS.length)
        setVisible(true)
      }, 180)
    }, 5000)
    return () => clearInterval(t)
  }, [active])

  const tab = TABS[active] ?? TABS[0]

  return (
    <section id="devex" className="py-32 px-6 md:px-12 lg:px-20 border-t border-black/[0.06] bg-[#03045E]">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] tracking-widest font-sans text-sky-300 bg-white/10">
            MA'LUMOT
          </span>
          <h2 className="mt-5 text-4xl md:text-5xl font-light tracking-tight leading-[1.05] text-white">
            Sizga kerakli barcha ma'lumotlar.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-stretch">
          {/* Left — 3 clickable tab cards, equal height */}
          <div className="flex flex-col gap-3">
            {TABS.map((t, i) => (
              <button
                key={t.num}
                onClick={() => selectTab(i)}
                className="flex-1 text-left rounded-2xl border transition-all duration-200 p-6 group backdrop-blur-sm"
                style={{
                  background: active === i ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)",
                  borderColor: active === i ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.12)",
                }}
              >
                <div className="flex gap-4 items-start">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-light shrink-0 transition-colors duration-200"
                    style={{
                      background: active === i ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                      color: active === i ? "#ffffff" : "rgba(255,255,255,0.5)",
                    }}
                  >
                    {t.num}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium transition-colors duration-200"
                      style={{ color: active === i ? "#ffffff" : "rgba(255,255,255,0.6)" }}
                    >
                      {t.title}
                    </p>
                    <p className="text-xs mt-0.5 text-sky-100/60">{t.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Right — content panel */}
          <div
            className="lg:col-span-2 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-sm p-8 flex flex-col"
            style={{ minHeight: "360px" }}
          >
            <div
              style={{
                opacity: visible ? 1 : 0,
                filter: visible ? "blur(0px)" : "blur(6px)",
                transform: visible ? "translateY(0)" : "translateY(6px)",
                transition: "opacity 220ms cubic-bezier(0.16,1,0.3,1), filter 220ms cubic-bezier(0.16,1,0.3,1), transform 220ms cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <h3 className="text-2xl font-semibold text-white mb-6">{tab.heading}</h3>

              <div className="space-y-6">
                {tab.items.map(({ Icon, text }) => (
                  <div key={text} className="flex items-center gap-4">
                    <Icon size={24} className="text-sky-300 shrink-0" />
                    <span className="text-lg text-white">{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
