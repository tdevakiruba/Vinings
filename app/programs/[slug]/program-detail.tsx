"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Clock,
  Crown,
  Lightbulb,
  Loader2,
  Lock,
  MessageSquare,
  Quote,
  Rocket,
  Star,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"

/* ── 3-Phase definitions ── */
const PROGRAM_PHASES = [
  {
    id: "foundation",
    label: "Foundation",
    dayStart: 1,
    dayEnd: 7,
    color: "#00c892",
    icon: Rocket,
    tagline: "Build your professional identity",
    highlights: [
      "Shift from student to professional mindset",
      "Master ownership, integrity & resourcefulness",
      "Build discipline and authority habits",
    ],
  },
  {
    id: "growth",
    label: "Growth Strategy",
    dayStart: 8,
    dayEnd: 14,
    color: "#3b82f6",
    icon: TrendingUp,
    tagline: "Develop core leadership skills",
    highlights: [
      "Learn accountability and team dynamics",
      "Sharpen business acumen & communication",
      "Build credibility through feedback loops",
    ],
  },
  {
    id: "mastery",
    label: "Leadership Mastery",
    dayStart: 15,
    dayEnd: 21,
    color: "#a855f7",
    icon: Crown,
    tagline: "Lead with influence and trust",
    highlights: [
      "Develop strategic thinking and initiative",
      "Build resilience, reputation & service mindset",
      "Master influence and earn lasting trust",
    ],
  },
]
import { Button } from "@/components/ui/button"

/* ── Types ── */
interface Program {
  id: string
  name: string
  slug: string
  tagline: string
  short_description: string
  long_description: string | null
  audience: string
  duration: string
  color: string
  badge: string | null
  icon: string | null
  hero_image: string | null
  leaders: string[] | null
  [key: string]: unknown
}

interface Feature {
  id: string
  title: string
  description: string
  icon: string
}

interface Phase {
  id: string
  name: string
  letter: string | null
  description: string
  days: string | null
}

interface PricingTier {
  id: string
  tier: string
  name: string
  subtitle: string | null
  price: string | null
  original_price: string | null
  price_note: string | null
  features: string[] | null
  cta_label: string
  cta_href: string | null
  highlighted: boolean
  sort_order: number
}

interface CurriculumDay {
  day_number: number
  title: string
  key_theme: string | null
}

/* ── Static hero map ── */
const heroBackgrounds: Record<string, string> = {
  "workforce-ready": "/images/p1.jpg",
}
const heroIcons: Record<string, string> = {
  "workforce-ready": "/images/workforce-icon.png",
}
const heroLogos: Record<string, string> = {
  "workforce-ready": "/images/workforce-logo.png",
}

/* ── Testimonials (mock per-program, easily replaceable with DB later) ── */
const testimonialsBySlug: Record<
  string,
  { name: string; role: string; text: string }[]
> = {
  "workforce-ready": [
    {
      name: "Amara Johnson",
      role: "Recent Graduate, Marketing",
      text: "WorkforceReady gave me the confidence and frameworks I needed to land my first role. The daily actions made everything feel manageable.",
    },
    {
      name: "Daniel Osei",
      role: "Junior Analyst, Finance",
      text: "The 21-day format was perfect. I built real habits around networking and communication that I still use every day.",
    },
    {
      name: "Priya Sharma",
      role: "Career Changer, Tech",
      text: "I was intimidated by the professional world. This program broke it down into small, actionable steps that actually stuck.",
    },
  ],
  "signal-90": [
    {
      name: "Marcus Williams",
      role: "VP Operations, Fortune 500",
      text: "The SIGNAL framework rewired how I approach leadership challenges. The self-awareness phase alone was worth it.",
    },
    {
      name: "Elena Rodriguez",
      role: "Chief People Officer",
      text: "Our entire executive team has gone through this. The micro-action approach creates lasting change, not just temporary motivation.",
    },
    {
      name: "James Chen",
      role: "Startup Founder & CEO",
      text: "90 days of intentional leadership practice transformed how I lead my team. The legacy phase gave me clarity on my long-term vision.",
    },
  ],
  "faith-and-leadership": [
    {
      name: "Pastor David Mensah",
      role: "Senior Pastor, Grace Community",
      text: "Finally a leadership program that honors faith. The integration of scripture with practical leadership frameworks is powerful.",
    },
    {
      name: "Sarah Kim",
      role: "Ministry Director",
      text: "The servant leadership module changed how I lead our team. My ministry has grown in both impact and depth.",
    },
  ],
  "youth-leadership": [
    {
      name: "Jaylen Thompson",
      role: "Age 17, Student Council President",
      text: "I used to be terrified of public speaking. After the Growth phase, I gave my best speech ever at our school assembly.",
    },
    {
      name: "Aisha Patel",
      role: "Age 19, Community Organizer",
      text: "The peer community was amazing. Having other young leaders to grow with made the experience so much richer.",
    },
  ],
}

/* ── FAQ (generic + per-program, easily editable) ── */
const faqsBySlug: Record<string, { q: string; a: string }[]> = {
  default: [
    {
      q: "How does the daily experience work?",
      a: "Each day includes a short reading, a reflection prompt, and a practical micro-action. The entire daily experience takes about 15-20 minutes.",
    },
    {
      q: "What happens if I miss a day?",
      a: "No worries! You can pick up right where you left off. Your progress is saved and you can complete days at your own pace within your subscription period.",
    },
    {
      q: "Do I get a credential when I finish?",
      a: "Yes! Upon completing all days and required actions, you earn a verified digital credential that you can share on LinkedIn and your resume.",
    },
    {
      q: "Can I get a refund?",
      a: "We offer a 7-day satisfaction guarantee. If the program is not right for you within the first 7 days, contact us for a full refund.",
    },
  ],
  "enterprise-signal": [
    {
      q: "What is the minimum team size?",
      a: "Enterprise cohorts typically start at 10 participants, but we can customize arrangements for smaller leadership teams.",
    },
    {
      q: "Can we integrate with our existing LMS?",
      a: "Yes! We support integrations with major LMS platforms including Workday Learning, Cornerstone, and custom SCORM/xAPI setups.",
    },
    {
      q: "How long does setup take?",
      a: "From initial consultation to launch, most enterprise deployments take 2-4 weeks depending on customization needs.",
    },
  ],
}

/* ── Component ── */
export function ProgramDetail({
  program,
  features,
  phases,
  pricing,
  curriculum = [],
  isLoggedIn,
  hasSubscription,
}: {
  program: Program
  features: Feature[]
  phases: Phase[]
  pricing: PricingTier[]
  curriculum?: CurriculumDay[]
  isLoggedIn: boolean
  hasSubscription: boolean
}) {
  const router = useRouter()
  const [enrollingTier, setEnrollingTier] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const heroBg = heroBackgrounds[program.slug] || "/images/p1.jpg"
  const heroIcon = heroIcons[program.slug]
  const heroLogo = heroLogos[program.slug]

  const testimonials =
    testimonialsBySlug[program.slug] ?? testimonialsBySlug["workforce-ready"] ?? []
  const faqs = [
    ...(faqsBySlug[program.slug] ?? []),
    ...(faqsBySlug.default ?? []),
  ]

  async function handleEnroll(tier: PricingTier) {
    if (!isLoggedIn) {
      router.push(`/signin?redirect=/programs/${program.slug}`)
      return
    }
    if (hasSubscription) {
      router.push(`/dashboard/${program.slug}`)
      return
    }
    if (tier.cta_href === "/organizations") {
      router.push("/organizations")
      return
    }

    setEnrollingTier(tier.id)
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programSlug: program.slug,
          planTier: tier.tier.toLowerCase(),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Enrollment failed")
        return
      }
      router.push(`/dashboard/${program.slug}`)
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setEnrollingTier(null)
    }
  }

  /* pick the "highlighted" tier for the sticky card */
  const stickyTier = pricing.find((t) => t.highlighted) ?? pricing[0]

  return (
    <>
      {/* ─────────── HERO ─────────── */}
      <section className="relative overflow-hidden border-b">
        {/* Background image */}
        <Image
          src={heroBg}
          alt=""
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />

        <div className="relative mx-auto flex max-w-7xl flex-col items-center px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          {/* White content tile */}
          <div className="w-full max-w-5xl rounded-3xl bg-white/95 p-8 shadow-2xl backdrop-blur-md sm:p-12 lg:p-16">
            {/* Logo + icon row */}
            <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-6">
              {heroIcon && (
                <Image
                  src={heroIcon}
                  alt={`${program.name} icon`}
                  width={128}
                  height={128}
                  className="size-20 shrink-0 sm:size-auto"
                  priority
                />
              )}
              {heroLogo ? (
                <Image
                  src={heroLogo}
                  alt={program.name}
                  width={440}
                  height={96}
                  className="h-auto w-[80%] max-w-[440px] sm:w-auto"
                  priority
                />
              ) : (
                <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  {program.name}
                </h1>
              )}
            </div>

            {/* Duration badge */}
            <span
              className="mb-6 inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-base font-bold text-white"
              style={{ backgroundColor: program.color || "#00c892" }}
            >
              <Clock className="size-5" />
              {program.duration}-Day Program
            </span>

            {/* Tagline */}
            {program.tagline && (
              <p className="mt-3 text-2xl font-bold text-foreground sm:text-3xl">
                {program.tagline}
              </p>
            )}

            {/* Description */}
            <p className="mt-4 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground sm:text-xl">
              {program.long_description || program.short_description}
            </p>

            {/* Key outcomes pills */}
            <div className="mt-6 flex flex-wrap gap-3">
              {features.slice(0, 3).map((f) => (
                <span
                  key={f.id}
                  className="rounded-full border-2 px-5 py-2 text-base font-bold"
                  style={{
                    borderColor: `${program.color || "#00c892"}40`,
                    color: program.color || "#00c892",
                    backgroundColor: `${program.color || "#00c892"}08`,
                  }}
                >
                  {f.title}
                </span>
              ))}
            </div>

            {/* CTA row */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              {hasSubscription && (
                <Button
                  asChild
                  size="lg"
                  className="h-14 rounded-xl px-10 text-lg font-bold text-white"
                  style={{ backgroundColor: program.color || "#00c892" }}
                >
                  <Link href={`/dashboard/${program.slug}`}>Go to Dashboard</Link>
                </Button>
              )}
              {!hasSubscription && (
                <Button
                  size="lg"
                  className="h-14 rounded-xl px-10 text-lg font-bold text-white"
                  style={{ backgroundColor: program.color || "#00c892" }}
                  onClick={() =>
                    document
                      .getElementById("pricing")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                >
                  Start Free Trial
                  <ArrowRight className="ml-2 size-5" />
                </Button>
              )}
              {!isLoggedIn && (
                <>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-xl px-8"
                  >
                    <Link href={`/signin?redirect=/programs/${program.slug}`}>
                      Sign In
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="ghost"
                    className="rounded-xl px-8"
                  >
                    <Link href="/signup">
                      Create Account
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Layout wrapper: main content + sticky sidebar on desktop */}
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row lg:gap-8 px-4 sm:px-6 lg:px-8">
        {/* ── Main content column ── */}
        <div className="flex-1 min-w-0">
          {/* ─────────── WHO IT'S FOR ─────────── */}
          <section className="py-14 border-b">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Who This Program Is For
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {program.audience}
            </p>
            {program.leaders &&
              Array.isArray(program.leaders) &&
              program.leaders.length > 0 && (
                <div className="mt-6">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Inspired by leaders like
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {(program.leaders as string[]).slice(0, 8).map((name) => (
                      <span
                        key={name}
                        className="rounded-full bg-wf-bg px-3 py-1 text-xs font-medium text-muted-foreground"
                      >
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
          </section>

          {/* ─────────── 3-PHASE JOURNEY PREVIEW ─────────── */}
          <section className="py-14 border-b">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Your {program.duration}-Day Journey
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
              Three phases designed to transform how you show up professionally.
            </p>

            {/* ── Phase timeline connector ── */}
            <div className="relative mt-10 flex flex-col gap-0">
              {/* Vertical connecting line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#00c892] via-[#3b82f6] to-[#a855f7] sm:left-8" />

              {PROGRAM_PHASES.map((phase, phaseIdx) => {
                const PhaseIcon = phase.icon
                const phaseDays = curriculum.filter(
                  (d) =>
                    d.day_number >= phase.dayStart &&
                    d.day_number <= phase.dayEnd
                )
                return (
                  <div key={phase.id} className="relative pb-10 last:pb-0">
                    {/* ── Phase header row ── */}
                    <div className="flex items-start gap-4 sm:gap-5">
                      {/* Phase icon (sits on the timeline) */}
                      <div
                        className="relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-lg sm:size-16"
                        style={{ backgroundColor: phase.color }}
                      >
                        <PhaseIcon className="size-5 sm:size-7" />
                      </div>

                      {/* Phase info */}
                      <div className="flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-xl font-extrabold text-foreground sm:text-2xl">
                            {phase.label}
                          </h3>
                          <span
                            className="rounded-full px-3 py-0.5 text-xs font-bold text-white"
                            style={{ backgroundColor: phase.color }}
                          >
                            Days {phase.dayStart}-{phase.dayEnd}
                          </span>
                        </div>
                        <p className="mt-1 text-base text-muted-foreground">
                          {phase.tagline}
                        </p>

                        {/* Highlights as inline chips */}
                        <div className="mt-3 flex flex-wrap gap-2">
                          {phase.highlights.map((h, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm text-muted-foreground"
                              style={{ borderColor: `${phase.color}30`, backgroundColor: `${phase.color}06` }}
                            >
                              <CheckCircle2
                                className="size-3.5 shrink-0"
                                style={{ color: phase.color }}
                              />
                              {h}
                            </span>
                          ))}
                        </div>

                        {/* Day titles -- compact numbered list */}
                        {phaseDays.length > 0 && (
                          <div className="mt-4 overflow-hidden rounded-xl border" style={{ borderColor: `${phase.color}20` }}>
                            {phaseDays.map((day, i) => (
                              <div
                                key={day.day_number}
                                className={`flex items-center gap-3 px-4 py-2.5 ${
                                  i < phaseDays.length - 1 ? "border-b" : ""
                                }`}
                                style={{ borderColor: `${phase.color}12` }}
                              >
                                <span
                                  className="flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                                  style={{ backgroundColor: phase.color }}
                                >
                                  {day.day_number}
                                </span>
                                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
                                  {day.title}
                                </p>
                                <Lock className="size-3.5 shrink-0 text-muted-foreground/30" />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* CTA after journey preview */}
            <div className="mt-10 text-center">
              <Button
                size="lg"
                className="rounded-xl px-10 py-3 text-base font-bold text-white shadow-md"
                style={{ backgroundColor: program.color || "#00c892" }}
                onClick={() =>
                  document
                    .getElementById("pricing")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Unlock Full Journey
                <ArrowRight className="ml-2 size-4" />
              </Button>
              <p className="mt-3 text-sm text-muted-foreground">
                Get access to all {program.duration} days of daily content, actions & frameworks
              </p>
            </div>
          </section>

          {/* ─────────── WHAT YOU GET / FEATURES ─────────── */}
          {features.length > 0 && (
            <section className="py-14 border-b">
              <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                {"What You'll Learn"}
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
                {features.map((feat) => (
                  <div key={feat.id} className="flex gap-4 rounded-xl border bg-card p-6">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-wf-mint/10">
                      <CheckCircle2 className="size-5 text-wf-mint" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-card-foreground">
                        {feat.title}
                      </h3>
                      <p className="mt-1 text-sm leading-relaxed text-foreground/70">
                        {feat.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─────────── DAILY EXPERIENCE ─────────── */}
          <section className="py-14 border-b">
            <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              Your Daily Experience
            </h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-foreground/70">
              Each day follows a simple, powerful rhythm designed for busy
              professionals.
            </p>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {[
                {
                  icon: BookOpen,
                  step: "01",
                  title: "Read",
                  desc: "Engage with curated micro-content aligned to your current phase. Short, focused, and actionable.",
                  time: "5 min",
                },
                {
                  icon: Lightbulb,
                  step: "02",
                  title: "Reflect",
                  desc: "Answer a thought-provoking question to deepen your understanding and connect insights to your life.",
                  time: "5 min",
                },
                {
                  icon: Zap,
                  step: "03",
                  title: "Act",
                  desc: "Complete a micro-action that builds real-world skills and creates compounding leadership habits.",
                  time: "5 min",
                },
              ].map((step) => (
                <div
                  key={step.title}
                  className="rounded-xl border bg-card p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div
                      className="flex size-12 items-center justify-center rounded-xl"
                      style={{
                        backgroundColor:
                          (program.color || "#00c892") + "18",
                      }}
                    >
                      <step.icon
                        className="size-6"
                        style={{ color: program.color || "#00c892" }}
                      />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-foreground/50">
                        Step {step.step}
                      </p>
                      <h3 className="font-serif text-lg font-bold text-card-foreground">
                        {step.title}
                      </h3>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/70">
                    {step.desc}
                  </p>
                  <span className="mt-4 inline-block rounded-full bg-muted px-3 py-1 text-xs font-semibold text-foreground/60">
                    ~{step.time}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* ─────────── TESTIMONIALS ─────────── */}
          {testimonials.length > 0 && (
            <section className="py-14 border-b">
              <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                What Participants Say
              </h2>
              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t, i) => (
                  <div
                    key={i}
                    className="flex flex-col rounded-xl border bg-card p-6"
                  >
                    <Quote className="mb-3 size-6 text-wf-mint/50" />
                    <p className="flex-1 text-base leading-relaxed text-foreground/80 italic">
                      {`"${t.text}"`}
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t pt-4">
                      <div
                        className="flex size-9 items-center justify-center rounded-full text-sm font-bold text-white"
                        style={{
                          backgroundColor: program.color || "#00c892",
                        }}
                      >
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-card-foreground">
                          {t.name}
                        </p>
                        <p className="text-sm text-foreground/60">
                          {t.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─────────── PRICING (full section, visible on all sizes) ─────────── */}
          {pricing.length > 0 && (
            <section id="pricing" className="py-14 border-b">
              <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Choose Your Plan
              </h2>
              <p className="mt-3 text-base text-foreground/70">
                Get started with {program.name} today.
              </p>

              <div
                className={`mt-8 grid grid-cols-1 gap-6 ${
                  pricing.length === 1
                    ? "max-w-sm"
                    : pricing.length === 2
                    ? "sm:grid-cols-2 max-w-2xl"
                    : "sm:grid-cols-2 lg:grid-cols-3"
                }`}
              >
                {pricing.map((tier) => (
                  <div
                    key={tier.id}
                    className={`flex flex-col rounded-2xl border bg-card p-6 ${
                      tier.highlighted ? "ring-2 ring-wf-mint shadow-lg" : ""
                    }`}
                  >
                    {tier.highlighted && (
                      <span className="mb-3 inline-flex w-fit items-center gap-1.5 rounded-full bg-wf-mint/10 px-4 py-1.5 text-xs font-bold text-wf-mint">
                        <Star className="size-3.5" /> Recommended
                      </span>
                    )}
                    <h3 className="font-serif text-xl font-bold text-card-foreground">
                      {tier.name}
                    </h3>
                    {tier.subtitle && (
                      <p className="mt-1 text-sm text-foreground/60">
                        {tier.subtitle}
                      </p>
                    )}
                    <div className="mt-4">
                      {tier.price ? (
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-4xl font-extrabold text-foreground">
                            {tier.price}
                          </span>
                          {tier.original_price && (
                            <span className="text-base text-muted-foreground line-through">
                              {tier.original_price}
                            </span>
                          )}
                          {tier.price_note && (
                            <span className="text-sm text-foreground/60">
                              {tier.price_note}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="font-serif text-xl font-bold text-foreground">
                          Custom Pricing
                        </span>
                      )}
                    </div>
                    {tier.features && tier.features.length > 0 && (
                      <ul className="mt-5 flex flex-1 flex-col gap-2.5">
                        {tier.features.map((f, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-foreground/70"
                          >
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-wf-mint" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <Button
                      className={`mt-6 w-full rounded-xl ${
                        tier.highlighted
                          ? "bg-wf-mint text-white hover:bg-wf-mint-light"
                          : ""
                      }`}
                      variant={tier.highlighted ? "default" : "outline"}
                      onClick={() => handleEnroll(tier)}
                      disabled={enrollingTier === tier.id}
                    >
                      {enrollingTier === tier.id ? (
                        <>
                          <Loader2 className="mr-2 size-4 animate-spin" />
                          Processing...
                        </>
                      ) : hasSubscription ? (
                        "Go to Dashboard"
                      ) : !isLoggedIn ? (
                        "Start Free Trial"
                      ) : (
                        tier.cta_label || "Enroll Now"
                      )}
                    </Button>
                    {!isLoggedIn && (
                      <div className="mt-3 flex flex-col gap-2">
                        <Button
                          asChild
                          variant="outline"
                          className="w-full rounded-xl"
                        >
                          <Link href={`/signin?redirect=/programs/${program.slug}`}>
                            Sign In
                          </Link>
                        </Button>
                        <p className="text-center text-sm text-foreground/60">
                          {"Don't have an account? "}
                          <Link
                            href="/signup"
                            className="font-semibold text-wf-mint hover:underline"
                          >
                            Create account
                          </Link>
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─────────── FAQ ─────────── */}
          {faqs.length > 0 && (
            <section className="py-14 border-b">
              <h2 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                Frequently Asked Questions
              </h2>
              <div className="mt-8 flex flex-col gap-2">
                {faqs.map((faq, i) => (
                  <div key={i} className="rounded-xl border bg-card">
                    <button
                      className="flex w-full items-center justify-between px-5 py-4 text-left"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span className="text-base font-semibold text-card-foreground pr-4">
                        {faq.q}
                      </span>
                      <ChevronDown
                        className={`size-5 shrink-0 text-muted-foreground transition-transform ${
                          openFaq === i ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {openFaq === i && (
                      <div className="border-t px-5 py-4">
                        <p className="text-sm leading-relaxed text-foreground/70">
                          {faq.a}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ─────────── BOTTOM CTA ─────────── */}
          <section className="py-14">
            <div
              className="rounded-2xl px-8 py-12 text-center"
              style={{ backgroundColor: program.color || "#002b5c" }}
            >
              <h2 className="font-serif text-balance text-3xl font-extrabold text-white sm:text-4xl">
                Ready to transform your leadership?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-base leading-relaxed text-white/80">
                Join the {program.name} and take the first step toward lasting
                change. Your {program.duration}-day journey starts today.
              </p>
              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {hasSubscription && (
                  <Button
                    asChild
                    size="lg"
                    className="rounded-xl bg-white px-8 text-wf-dark hover:bg-white/90"
                  >
                    <Link href={`/dashboard/${program.slug}`}>Go to Dashboard</Link>
                  </Button>
                )}
                {!hasSubscription && (
                  <Button
                    size="lg"
                    className="rounded-xl bg-white px-8 text-wf-dark hover:bg-white/90"
                    onClick={() =>
                      document
                        .getElementById("pricing")
                        ?.scrollIntoView({ behavior: "smooth" })
                    }
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 size-4" />
                  </Button>
                )}
                {!isLoggedIn && (
                  <>
                    <Button
                      size="lg"
                      asChild
                      className="rounded-xl border-2 border-white bg-transparent px-8 text-white hover:bg-white/10"
                    >
                      <Link href={`/signin?redirect=/programs/${program.slug}`}>
                        Sign In
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      asChild
                      className="rounded-xl border-2 border-white bg-transparent px-8 text-white hover:bg-white/10"
                    >
                      <Link href="/signup">
                        Create Account
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* ── Sticky sidebar pricing card (desktop only) ── */}
        {stickyTier && !hasSubscription && (
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="sticky top-20 mt-14 rounded-2xl border bg-card p-6 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                {program.duration}-Day Program
              </p>
              <h3 className="mt-1 text-lg font-bold text-card-foreground">
                {stickyTier.name}
              </h3>
              {stickyTier.subtitle && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {stickyTier.subtitle}
                </p>
              )}
              <div className="mt-4">
                {stickyTier.price ? (
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-foreground">
                      {stickyTier.price}
                    </span>
                    {stickyTier.original_price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {stickyTier.original_price}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-lg font-bold text-foreground">
                    Custom Pricing
                  </span>
                )}
                {stickyTier.price_note && (
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {stickyTier.price_note}
                  </p>
                )}
              </div>

              {stickyTier.features && stickyTier.features.length > 0 && (
                <ul className="mt-5 flex flex-col gap-2 border-t pt-4">
                  {stickyTier.features.slice(0, 6).map((f, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <CheckCircle2 className="mt-0.5 size-3 shrink-0 text-wf-mint" />
                      {f}
                    </li>
                  ))}
                </ul>
              )}

              <Button
                className="mt-5 w-full rounded-xl bg-wf-mint text-white hover:bg-wf-mint-light"
                onClick={() => handleEnroll(stickyTier)}
                disabled={enrollingTier === stickyTier.id}
              >
                {enrollingTier === stickyTier.id ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Processing...
                  </>
                ) : !isLoggedIn ? (
                  "Start Free Trial"
                ) : (
                  stickyTier.cta_label || "Enroll Now"
                )}
              </Button>

              {!isLoggedIn && (
                <div className="mt-4 space-y-2">
                  <Button
                    asChild
                    variant="outline"
                    className="w-full rounded-xl"
                  >
                    <Link href={`/signin?redirect=/programs/${program.slug}`}>
                      Sign In
                    </Link>
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    {"Don't have an account? "}
                    <Link
                      href={`/signup`}
                      className="font-semibold text-wf-mint hover:underline"
                    >
                      Sign up free
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </aside>
        )}
      </div>
    </>
  )
}
