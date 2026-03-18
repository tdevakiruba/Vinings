import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  ArrowRight,
  Brain,
  ChevronRight,
  Clock,
  Sparkles,
  Target,
  Users,
  Award,
  Zap,
  TrendingUp,
  Shield,
  CheckCircle2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { HeroAnimation } from "@/components/hero-animation"

export default async function Home() {
  let programs: any[] | null = null
  let categories: any[] | null = null
  let features: any[] | null = null
  let pricing: any[] | null = null

  try {
    const supabase = await createClient()

    const { data: programsData } = await supabase
      .from("vc_programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    programs = programsData

    const { data: categoriesData } = await supabase
      .from("vc_categories")
      .select("*")
      .order("sort_order")

    categories = categoriesData

    const programIds = programs?.map((p) => p.id) ?? []

    const [{ data: featuresData }, { data: pricingData }] = await Promise.all([
      supabase
        .from("vc_program_features")
        .select("*")
        .in("program_id", programIds)
        .order("sort_order"),
      supabase
        .from("vc_program_pricing")
        .select("*")
        .in("program_id", programIds)
        .order("sort_order"),
    ])

    features = featuresData
    pricing = pricingData
  } catch {
    // Supabase not configured – render page with empty data
  }

  return (
    <>
      {/* ──── CINEMATIC HERO ──── */}
      <section className="relative overflow-hidden bg-[#0a0e14] px-4 py-24 sm:px-6 lg:px-8 lg:py-36">
        <HeroAnimation />

        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2.5 text-sm font-semibold tracking-wider text-white/80 uppercase backdrop-blur-md">
            <Sparkles className="size-4 text-blue-400" />
            Vinings Church
          </div>

          <h1 className="font-serif text-balance text-5xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Leadership is not taught.{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              It is built.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-pretty text-xl leading-relaxed text-white/60">
            Structured, research-backed programs that turn ambition into
            professional excellence — from emerging talent to senior
            executives.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-blue-900 px-8 py-6 text-base font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:bg-blue-800 hover:shadow-xl"
            >
              <Link href="/programs">
                Explore Programs
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-full border-white/20 px-8 py-6 text-base text-white/80 backdrop-blur-sm hover:bg-white/10 hover:text-white"
            >
              <Link href="/signin">Sign In</Link>
            </Button>
          </div>

          {/* Stats row */}
          <div className="mt-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { value: "2,500+", label: "Participants" },
              { value: "4.9/5", label: "Average Rating" },
              { value: "6", label: "Program Tracks" },
              { value: "90-Day", label: "Transformations" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/5 bg-white/[0.03] px-4 py-5 backdrop-blur-sm"
              >
                <div className="font-serif text-3xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="mt-1 text-sm text-white/40">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CATEGORY BAR ──── */}
      {categories && categories.length > 0 && (
        <section className="sticky top-0 z-30 border-b border-border/50 bg-background/80 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-2">
            <Link
              href="/programs"
              className="rounded-full bg-blue-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-blue-800 hover:shadow-md"
            >
              All Programs
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/programs?category=${cat.slug}`}
                className="rounded-full border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900"
              >
                {cat.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ──── PROGRAMS GRID ──── */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-900">
                Our Programs
              </p>
              <h2 className="mt-2 font-serif text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
                Choose your transformation
              </h2>
              <p className="mt-3 max-w-lg text-base leading-relaxed text-muted-foreground">
                Each program is a structured journey — daily frameworks, real
                actions, and measurable growth.
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="shrink-0 rounded-full"
            >
              <Link href="/programs">
                View All Programs
                <ChevronRight className="ml-1 size-4" />
              </Link>
            </Button>
          </div>

          {/* Program Cards — ink blue tile format */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {programs?.map((program) => {
              const pFeatures = (features ?? [])
                .filter((f: any) => f.program_id === program.id)
                .slice(0, 3)
              const pPricing = (pricing ?? []).filter(
                (p: any) => p.program_id === program.id
              )
              const basePrice = pPricing.find((p: any) => p.price_cents)

              return (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/5"
                >
                  {/* Ink blue top accent bar */}
                  <div className="h-1 bg-blue-900" />

                  <div className="flex flex-col p-6">
                    {/* Badge + Duration */}
                    <div className="mb-4 flex items-center justify-between">
                      <span className="inline-flex items-center rounded-full bg-blue-900 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                        {program.title?.split(" ")[0]}-Badge
                      </span>
                      {program.duration && (
                        <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <Clock className="size-3.5" />
                          {program.duration}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-900">
                      {program.title || program.name}
                    </h3>

                    {/* Tagline */}
                    {(program.tagline) && (
                      <p className="mt-1 text-sm font-semibold text-blue-900">
                        {program.tagline}
                      </p>
                    )}

                    {/* Description */}
                    {program.description && (
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-3">
                        {program.description}
                      </p>
                    )}

                    {/* Features */}
                    {pFeatures.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {pFeatures.map((feat: any) => (
                          <div
                            key={feat.id}
                            className="flex items-start gap-2 text-sm text-slate-700"
                          >
                            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-700" />
                            <span>{feat.feature || feat.title}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-sm text-slate-500">Contact Us</span>
                      <span className="flex items-center gap-1 text-sm font-bold text-blue-900 transition-all group-hover:gap-2">
                        Learn More
                        <ChevronRight className="size-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section className="border-t bg-[#0a0e14] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-400">
              How It Works
            </p>
            <h2 className="mt-2 font-serif text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Three steps to transformation
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                icon: Target,
                title: "Choose Your Path",
                desc: "Select a program aligned with your career stage and leadership goals.",
              },
              {
                step: "02",
                icon: Zap,
                title: "Daily Frameworks",
                desc: "Each day delivers a structured Read, Reflect, Act framework — 15 minutes that compound.",
              },
              {
                step: "03",
                icon: Award,
                title: "Earn Credentials",
                desc: "Complete phases, track your trajectory, and earn verified digital certificates.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-white/5 bg-white/[0.02] p-8 transition-all hover:border-blue-800/40 hover:bg-white/[0.04]"
              >
                <span className="absolute right-6 top-6 text-4xl font-black text-white/5">
                  {item.step}
                </span>
                <div className="mb-4 flex size-12 items-center justify-center rounded-xl bg-blue-900/20">
                  <item.icon className="size-5 text-blue-400" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-base leading-relaxed text-white/50">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── WHY VININGS CHURCH ──── */}
      <section className="border-t px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-blue-900">
            Why Vinings Church
          </p>
          <h2 className="mt-2 font-serif text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Built different. By design.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-muted-foreground">
            Our proprietary SIGNAL framework is a research-backed system that
            transforms leadership potential into measurable results.
          </p>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Brain,
                title: "Research-Backed",
                desc: "Grounded in behavioral science and proven leadership models.",
              },
              {
                icon: TrendingUp,
                title: "Action-Oriented",
                desc: "Daily micro-actions that compound into transformational habits.",
              },
              {
                icon: Shield,
                title: "Structured Pathways",
                desc: "Clear phases with measurable milestones and progress tracking.",
              },
              {
                icon: Award,
                title: "Verified Credentials",
                desc: "Digital certificates recognized by employers and organizations.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:shadow-blue-900/5 hover:border-blue-200"
              >
                <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-blue-100 transition-colors group-hover:bg-blue-200">
                  <item.icon className="size-5 text-blue-900" />
                </div>
                <h3 className="font-serif text-base font-bold text-card-foreground">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── CTA BANNER ──── */}
      <section className="border-t bg-[#0a0e14] px-4 py-20 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-600/10 px-8 py-14 text-center sm:px-14">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(30,58,138,0.15),transparent_50%),radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)]" />
          <div className="relative">
            <h2 className="font-serif text-balance text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Ready to lead differently?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-white/60">
              Join thousands of professionals who have transformed their
              leadership through structured, research-backed programs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-blue-900 px-8 py-6 text-base font-bold text-white shadow-lg shadow-blue-900/30 hover:bg-blue-800"
              >
                <Link href="/programs">Browse Programs</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                asChild
                className="rounded-full border-white/20 px-8 py-6 text-white/80 hover:bg-white/10"
              >
                <Link href="/organizations">For Organizations</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
