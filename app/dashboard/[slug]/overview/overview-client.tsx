"use client"

import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Flame,
  MapPin,
  Rocket,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  Zap,
} from "lucide-react"

/* ── Phase definitions ── */
const PHASES = [
  {
    id: "foundation",
    label: "Foundation",
    dayStart: 1,
    dayEnd: 7,
    color: "#00c892",
    icon: Rocket,
    tagline: "Build your professional identity",
  },
  {
    id: "growth",
    label: "Growth Strategy",
    dayStart: 8,
    dayEnd: 14,
    color: "#0077b6",
    icon: TrendingUp,
    tagline: "Develop core leadership skills",
  },
  {
    id: "mastery",
    label: "Leadership Mastery",
    dayStart: 15,
    dayEnd: 21,
    color: "#1b2a4a",
    icon: Crown,
    tagline: "Lead with influence and trust",
  },
]

interface Phase {
  id: string
  phase_number: number
  title: string
  description: string | null
  day_start: number | null
  day_end: number | null
  sort_order: number
}

interface OverviewClientProps {
  program: {
    name: string
    slug: string
    tagline: string | null
    description: string | null
    badgeColor: string
    signalAcronym: string
    audience: string | null
    totalDays: number
  }
  enrollment: {
    currentDay: number
    totalDays: number
    progress: number
    startDate: string | null
    endDate: string | null
    planTier: string
  }
  stats: {
    actionsCompleted: number
    currentStreak: number
    longestStreak: number
    lastActivity: string | null
  }
  phases: Phase[]
  dailyInsight: { title: string; keyTheme: string } | null
}

/* Icon + logo maps for program branding */
const programIcons: Record<string, string> = {
  "workforce-ready": "/images/workforce-icon.png",
}
const programLogos: Record<string, string> = {
  "workforce-ready": "/images/workforce-logo.png",
}

export function OverviewClient({
  program,
  enrollment,
  stats,
  phases,
  dailyInsight,
}: OverviewClientProps) {
  const daysRemaining = enrollment.totalDays - enrollment.currentDay
  const iconSrc = programIcons[program.slug]
  const logoSrc = programLogos[program.slug]

  return (
    <div className="mx-auto max-w-5xl">
      {/* ── Welcome Hero Banner ── */}
      <div
        className="relative overflow-hidden rounded-2xl p-5 sm:p-6 lg:p-8"
        style={{ backgroundColor: program.badgeColor }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
        {/* Decorative circles */}
        <div
          className="absolute -right-16 -top-16 size-64 rounded-full opacity-10"
          style={{ backgroundColor: "white" }}
        />
        <div
          className="absolute -bottom-8 -left-8 size-40 rounded-full opacity-10"
          style={{ backgroundColor: "white" }}
        />

        <div className="relative z-10">
          {/* Program logo + icon */}
          <div className="mb-5 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            {iconSrc && (
              <Image
                src={iconSrc}
                alt=""
                width={56}
                height={56}
                className="shrink-0 drop-shadow-lg"
              />
            )}
            {logoSrc ? (
              <Image
                src={logoSrc}
                alt={program.name}
                width={200}
                height={40}
                className="h-auto w-[160px] brightness-0 invert drop-shadow-lg sm:w-[200px]"
              />
            ) : (
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {program.name}
              </h1>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
              Day {enrollment.currentDay} of {enrollment.totalDays}
            </span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/80">
              {enrollment.progress}% Complete
            </span>
          </div>

          {program.tagline && (
            <p className="mt-3 max-w-lg text-base font-medium text-white/90 sm:text-lg">
              {program.tagline}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              href={`/dashboard/${program.slug}/journey`}
              className="flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-base font-bold shadow-lg transition-all hover:shadow-xl"
              style={{ color: program.badgeColor }}
            >
              <Zap className="size-5" />
              {"Continue Today's Session"}
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href={`/dashboard/${program.slug}/frameworks`}
              className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-3 text-base font-bold text-white backdrop-blur transition-all hover:bg-white/25"
            >
              <BookOpen className="size-5" />
              Browse Frameworks
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={<Target className="size-6" />}
          label="Progress"
          value={`${enrollment.progress}%`}
          accent={program.badgeColor}
        />
        <StatCard
          icon={<CheckCircle2 className="size-6" />}
          label="Actions Done"
          value={stats.actionsCompleted.toString()}
          accent="#0077b6"
        />
        <StatCard
          icon={<Flame className="size-6" />}
          label="Current Streak"
          value={`${stats.currentStreak}d`}
          accent="#f59e0b"
        />
        <StatCard
          icon={<Trophy className="size-6" />}
          label="Best Streak"
          value={`${stats.longestStreak}d`}
          accent="#1b2a4a"
        />
      </div>

      {/* ── Today's Leadership Insight ── */}
      {dailyInsight && (
        <div className="mt-5">
          <div
            className="relative overflow-hidden rounded-2xl border p-8 sm:p-10 lg:p-12"
            style={{ background: `linear-gradient(135deg, ${program.badgeColor}06, ${program.badgeColor}12)` }}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-6 flex items-center gap-2">
                <Sparkles className="size-5" style={{ color: program.badgeColor }} />
                <span
                  className="text-xs font-extrabold uppercase tracking-[0.2em]"
                  style={{ color: program.badgeColor }}
                >
                  {"Today's Leadership Insight"}
                </span>
              </div>
              <h2 className="max-w-3xl text-balance text-3xl font-extrabold leading-tight text-foreground sm:text-4xl lg:text-5xl">
                {dailyInsight.title.split(":").length > 1 ? (
                  <>
                    {dailyInsight.title.split(":")[0]}:{" "}
                    <span style={{ color: program.badgeColor }}>
                      {dailyInsight.title.split(":").slice(1).join(":")}
                    </span>
                  </>
                ) : (
                  dailyInsight.title
                )}
              </h2>
              {dailyInsight.keyTheme && (
                <p
                  className="mt-4 max-w-2xl text-lg font-semibold sm:text-xl"
                  style={{ color: program.badgeColor }}
                >
                  {dailyInsight.keyTheme}
                </p>
              )}
              <div className="mt-6 flex items-center gap-2 text-muted-foreground">
                <Calendar className="size-4" />
                <span className="text-sm font-medium">
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Bottom Row: Quick Actions + Program Details ── */}
      <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Quick Actions */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-lg font-extrabold text-foreground">
            Quick Actions
          </h3>
          <div className="flex flex-col gap-3">
            <Link
              href={`/dashboard/${program.slug}/journey`}
              className="flex items-center gap-4 rounded-xl border-2 border-transparent p-4 transition-all hover:shadow-md"
              style={{
                backgroundColor: `${program.badgeColor}08`,
              }}
            >
              <div
                className="flex size-10 items-center justify-center rounded-xl text-white"
                style={{ backgroundColor: program.badgeColor }}
              >
                <Zap className="size-5" />
              </div>
              <div>
                <span className="text-base font-bold text-card-foreground">
                  {"Today's Session"}
                </span>
                <p className="text-sm text-muted-foreground">
                  Day {enrollment.currentDay} content
                </p>
              </div>
              <ArrowRight className="ml-auto size-5 text-muted-foreground" />
            </Link>
            <Link
              href={`/dashboard/${program.slug}/frameworks`}
              className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500">
                <BookOpen className="size-5" />
              </div>
              <div>
                <span className="text-base font-bold text-card-foreground">
                  View Frameworks
                </span>
                <p className="text-sm text-muted-foreground">
                  Browse all {enrollment.totalDays} daily frameworks
                </p>
              </div>
              <ArrowRight className="ml-auto size-5 text-muted-foreground" />
            </Link>
            <Link
              href={`/dashboard/${program.slug}/certificates`}
              className="flex items-center gap-4 rounded-xl border p-4 transition-all hover:shadow-md"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500">
                <Trophy className="size-5" />
              </div>
              <div>
                <span className="text-base font-bold text-card-foreground">
                  Certificates
                </span>
                <p className="text-sm text-muted-foreground">
                  View earned credentials
                </p>
              </div>
              <ArrowRight className="ml-auto size-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Program Details Card */}
        <div className="rounded-2xl border bg-card p-5">
          <h3 className="mb-3 text-lg font-extrabold text-foreground">
            Program Details
          </h3>
          <dl className="space-y-4">
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="size-4" />
                Duration
              </dt>
              <dd className="text-base font-bold text-card-foreground">
                {program.totalDays} days
              </dd>
            </div>
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                Started
              </dt>
              <dd className="text-base font-bold text-card-foreground">
                {enrollment.startDate
                  ? new Date(enrollment.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A"}
              </dd>
            </div>
            {enrollment.endDate && (
              <>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <dt className="flex items-center gap-3 text-sm text-muted-foreground">
                    <Calendar className="size-4" />
                    Target Completion
                  </dt>
                  <dd className="text-base font-bold text-card-foreground">
                    {new Date(enrollment.endDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </dd>
                </div>
              </>
            )}
            {program.audience && (
              <>
                <div className="h-px bg-border" />
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Audience</dt>
                  <dd className="max-w-[180px] truncate text-base font-bold text-card-foreground">
                    {program.audience}
                  </dd>
                </div>
              </>
            )}
            <div className="h-px bg-border" />
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">Plan</dt>
              <dd className="text-base font-bold capitalize text-card-foreground">
                {enrollment.planTier}
              </dd>
            </div>
          </dl>

          {stats.lastActivity && (
            <div className="mt-5 rounded-xl bg-muted/50 p-4">
              <p className="text-xs font-medium text-muted-foreground">
                Last Activity
              </p>
              <p className="mt-1 text-sm font-bold text-card-foreground">
                {new Date(stats.lastActivity).toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Journey Map (3 horizontal phase tiles) ── */}
      <div className="mt-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-extrabold text-foreground">
            <MapPin className="size-5" style={{ color: program.badgeColor }} />
            Journey Map
          </h2>
          <span className="text-sm font-bold text-muted-foreground">
            {daysRemaining > 0 ? `${daysRemaining} days left` : "Complete!"}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {PHASES.map((phase) => {
            const PhaseIcon = phase.icon
            const isActive =
              enrollment.currentDay >= phase.dayStart &&
              enrollment.currentDay <= phase.dayEnd
            const isCompleted = enrollment.currentDay > phase.dayEnd
            const phaseProgress = isCompleted
              ? 100
              : isActive
              ? Math.round(
                  ((enrollment.currentDay - phase.dayStart) /
                    (phase.dayEnd - phase.dayStart + 1)) *
                    100
                )
              : 0

            return (
              <Link
                key={phase.id}
                href={`/dashboard/${program.slug}/journey`}
                className={`group flex flex-col rounded-2xl border-2 p-5 transition-all hover:shadow-lg ${
                  isActive ? "shadow-md" : isCompleted ? "" : "opacity-50"
                }`}
                style={{
                  borderColor: isActive
                    ? phase.color
                    : isCompleted
                    ? `${phase.color}30`
                    : "transparent",
                  backgroundColor: isActive ? `${phase.color}05` : undefined,
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex size-10 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: phase.color }}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="size-5" />
                    ) : (
                      <PhaseIcon className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-extrabold text-foreground">
                      {phase.label}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Days {phase.dayStart}-{phase.dayEnd}
                    </p>
                  </div>
                  {isActive && (
                    <span
                      className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold text-white"
                      style={{ backgroundColor: phase.color }}
                    >
                      Now
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  {phase.tagline}
                </p>
                {(isActive || isCompleted) && (
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${phaseProgress}%`,
                          backgroundColor: phase.color,
                        }}
                      />
                    </div>
                    <span
                      className="text-xs font-bold"
                      style={{ color: phase.color }}
                    >
                      {phaseProgress}%
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border bg-card p-4 transition-all hover:shadow-md">
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold text-foreground">
          {value}
        </div>
        <div className="text-xs font-medium text-muted-foreground">{label}</div>
      </div>
    </div>
  )
}
