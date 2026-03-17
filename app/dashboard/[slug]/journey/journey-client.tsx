"use client"

import { useState } from "react"
import Image from "next/image"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Zap,
  Play,
  Lock,
  Sparkles,
  Rocket,
  TrendingUp,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"

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

interface CurriculumDay {
  day_number: number
  title: string
  key_theme: string | null
  motivational_keynote: string[] | null
  how_to_implement: string[] | null
  three_actions: { action_title: string; instruction: string }[] | null
}

interface JourneyClientProps {
  program: {
    slug: string
    name: string
    badgeColor: string
    signalAcronym: string
    totalDays: number
  }
  enrollmentId: string
  currentDay: number
  curriculum: CurriculumDay[]
  userActions: {
    day_number: number
    action_index: number
    completed: boolean
  }[]
}

const programIcons: Record<string, string> = {
  "workforce-ready": "/images/workforce-icon.png",
}

export function JourneyClient({
  program,
  enrollmentId,
  currentDay,
  curriculum,
  userActions,
}: JourneyClientProps) {
  const [selectedDay, setSelectedDay] = useState(currentDay)
  const [completedActions, setCompletedActions] = useState<Set<string>>(
    new Set(
      userActions
        .filter((a) => a.completed)
        .map((a) => `${a.day_number}-${a.action_index}`)
    )
  )
  const [saving, setSaving] = useState(false)
  const [expandedPhase, setExpandedPhase] = useState<string | null>(
    PHASES.find((p) => selectedDay >= p.dayStart && selectedDay <= p.dayEnd)
      ?.id ?? "foundation"
  )

  const todayContent = curriculum.find((d) => d.day_number === selectedDay)
  const activePhase =
    PHASES.find((p) => selectedDay >= p.dayStart && selectedDay <= p.dayEnd) ??
    PHASES[0]
  const iconSrc = programIcons[program.slug]

  async function toggleAction(dayNum: number, actionIdx: number) {
    const key = `${dayNum}-${actionIdx}`
    const isNowCompleted = !completedActions.has(key)
    const next = new Set(completedActions)
    if (isNowCompleted) next.add(key)
    else next.delete(key)
    setCompletedActions(next)

    setSaving(true)
    try {
      await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId,
          dayNumber: dayNum,
          actionIndex: actionIdx,
          completed: isNowCompleted,
        }),
      })
    } catch {
      if (isNowCompleted) next.delete(key)
      else next.add(key)
      setCompletedActions(new Set(next))
    } finally {
      setSaving(false)
    }
  }

  const todayActionsTotal = todayContent?.three_actions?.length ?? 0
  const todayActionsDone =
    todayContent?.three_actions?.filter((_, i) =>
      completedActions.has(`${selectedDay}-${i}`)
    ).length ?? 0
  const todayProgress =
    todayActionsTotal > 0
      ? Math.round((todayActionsDone / todayActionsTotal) * 100)
      : 0

  function isDayCompleted(day: number) {
    const content = curriculum.find((d) => d.day_number === day)
    return (
      content?.three_actions?.every((_, i) =>
        completedActions.has(`${day}-${i}`)
      ) ?? false
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      {/* ── Phase-Grouped Day Navigator ── */}
      <div className="space-y-3">
        {PHASES.map((phase) => {
          const PhaseIcon = phase.icon
          const isExpanded = expandedPhase === phase.id
          const days = Array.from(
            { length: phase.dayEnd - phase.dayStart + 1 },
            (_, i) => phase.dayStart + i
          )
          const phaseDaysCompleted = days.filter((d) => isDayCompleted(d)).length
          const phaseProgress = Math.round(
            (phaseDaysCompleted / days.length) * 100
          )
          const isCurrentPhase =
            currentDay >= phase.dayStart && currentDay <= phase.dayEnd
          const isPastPhase = currentDay > phase.dayEnd
          const isFuturePhase = currentDay < phase.dayStart

          return (
            <div
              key={phase.id}
              className="overflow-hidden rounded-2xl border-2 transition-all"
              style={{
                borderColor: isCurrentPhase
                  ? phase.color
                  : isPastPhase
                  ? `${phase.color}30`
                  : "transparent",
                backgroundColor: isCurrentPhase
                  ? `${phase.color}04`
                  : undefined,
              }}
            >
              {/* Phase header - clickable */}
              <button
                onClick={() =>
                  setExpandedPhase(isExpanded ? null : phase.id)
                }
                className="flex w-full items-center gap-4 p-4 text-left transition-colors hover:bg-muted/30"
              >
                <div
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
                  style={{ backgroundColor: phase.color }}
                >
                  <PhaseIcon className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-extrabold text-foreground">
                      {phase.label}
                    </h3>
                    {isCurrentPhase && (
                      <span
                        className="rounded-full px-2.5 py-0.5 text-[11px] font-bold text-white"
                        style={{ backgroundColor: phase.color }}
                      >
                        Current
                      </span>
                    )}
                    {isPastPhase && (
                      <CheckCircle2
                        className="size-5"
                        style={{ color: phase.color }}
                      />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {phase.tagline} &middot; Days {phase.dayStart}-{phase.dayEnd}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="hidden items-center gap-2 sm:flex">
                    <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
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
                  <ArrowRight
                    className={`size-5 text-muted-foreground transition-transform ${
                      isExpanded ? "rotate-90" : ""
                    }`}
                  />
                </div>
              </button>

              {/* Expanded day grid */}
              {isExpanded && (
                <div className="border-t px-4 pb-4 pt-3">
                  <div className="flex flex-wrap gap-2">
                    {days.map((day) => {
                      const isSelected = day === selectedDay
                      const isCurrent = day === currentDay
                      const isLocked = day > currentDay
                      const completed = isDayCompleted(day)
                      const dayTitle =
                        curriculum.find((d) => d.day_number === day)?.title ?? ""

                      return (
                        <button
                          key={day}
                          onClick={() => !isLocked && setSelectedDay(day)}
                          disabled={isLocked}
                          title={isLocked ? "Locked" : dayTitle}
                          className={`group relative flex h-12 items-center gap-2 rounded-xl px-3.5 text-sm font-bold transition-all ${
                            isSelected
                              ? "text-white shadow-lg"
                              : completed
                              ? "border-2 bg-card hover:shadow-md"
                              : isLocked
                              ? "bg-muted/60 text-muted-foreground/30"
                              : isCurrent
                              ? "border-2 bg-card shadow-md"
                              : "border bg-card text-foreground hover:shadow-md"
                          }`}
                          style={
                            isSelected
                              ? { backgroundColor: phase.color }
                              : completed
                              ? {
                                  borderColor: `${phase.color}40`,
                                  color: phase.color,
                                }
                              : isCurrent
                              ? { borderColor: phase.color }
                              : undefined
                          }
                        >
                          {isLocked ? (
                            <Lock className="size-3.5" />
                          ) : completed && !isSelected ? (
                            <CheckCircle2 className="size-4" />
                          ) : null}
                          <span>Day {day}</span>
                          {isCurrent && !isSelected && (
                            <span
                              className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-card"
                              style={{ backgroundColor: phase.color }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Active Day Hero Card ── */}
      <div
        className="overflow-hidden rounded-2xl"
        style={{ backgroundColor: activePhase.color }}
      >
        <div className="relative p-5 sm:p-6">
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              {iconSrc && (
                <Image
                  src={iconSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="shrink-0 drop-shadow-lg"
                />
              )}
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-white/70">
                  {activePhase.label} &middot; Day {selectedDay}
                </span>
                <h2 className="text-xl font-extrabold text-white sm:text-2xl">
                  {todayContent?.title ?? `Day ${selectedDay}`}
                </h2>
              </div>
            </div>
            {todayContent?.key_theme && (
              <p className="mt-2 text-base text-white/80">
                {todayContent.key_theme}
              </p>
            )}
            <div className="mt-4 flex items-center gap-3">
              <Button
                size="lg"
                className="rounded-xl bg-white px-5 font-bold shadow-lg hover:bg-white/90"
                style={{ color: activePhase.color }}
                onClick={() =>
                  document
                    .getElementById("session-content")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                <Play className="mr-2 size-4" />
                {selectedDay === currentDay ? "Start Session" : "View Session"}
              </Button>
              <div className="flex items-center gap-2 rounded-full bg-white/15 px-4 py-2">
                <div className="h-2.5 w-20 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white transition-all duration-500"
                    style={{ width: `${todayProgress}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-white">
                  {todayActionsDone}/{todayActionsTotal}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Day nav arrows ── */}
      <div className="flex items-center justify-between">
        <button
          onClick={() =>
            selectedDay > 1 && setSelectedDay(selectedDay - 1)
          }
          disabled={selectedDay <= 1}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          <ArrowLeft className="size-4" />
          Day {selectedDay - 1 > 0 ? selectedDay - 1 : ""}
        </button>
        <button
          onClick={() =>
            selectedDay < currentDay && setSelectedDay(selectedDay + 1)
          }
          disabled={selectedDay >= currentDay}
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30"
        >
          {selectedDay < currentDay ? `Day ${selectedDay + 1}` : ""}
          {selectedDay >= currentDay && selectedDay < program.totalDays && (
            <span className="flex items-center gap-1 opacity-50">
              <Lock className="size-3" /> Day {selectedDay + 1}
            </span>
          )}
          <ArrowRight className="size-4" />
        </button>
      </div>

      {/* ── Session Content ── */}
      <div id="session-content" className="flex flex-col gap-5">
        {/* READ */}
        {todayContent?.motivational_keynote &&
          todayContent.motivational_keynote.length > 0 && (
            <section className="overflow-hidden rounded-2xl border bg-card">
              <div
                className="flex items-center gap-3 px-5 py-3.5"
                style={{ backgroundColor: `${activePhase.color}08` }}
              >
                <div
                  className="flex size-9 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: activePhase.color }}
                >
                  <BookOpen className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    Read
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Motivational Keynote
                  </span>
                </div>
              </div>
              <div className="space-y-3 px-5 py-4">
                {todayContent.motivational_keynote.map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-muted-foreground"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          )}

        {/* REFLECT */}
        {todayContent?.how_to_implement &&
          todayContent.how_to_implement.length > 0 && (
            <section className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-center gap-3 bg-amber-500/5 px-5 py-3.5">
                <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500 text-white">
                  <Lightbulb className="size-4" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-foreground">
                    Reflect
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    How to Implement
                  </span>
                </div>
              </div>
              <div className="space-y-3 px-5 py-4">
                {todayContent.how_to_implement.map((para, i) => (
                  <p
                    key={i}
                    className="text-base leading-relaxed text-muted-foreground"
                  >
                    {para}
                  </p>
                ))}
              </div>
            </section>
          )}

        {/* ACT */}
        {todayContent?.three_actions &&
          todayContent.three_actions.length > 0 && (
            <section className="overflow-hidden rounded-2xl border bg-card">
              <div className="flex items-center justify-between bg-blue-500/5 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-blue-500 text-white">
                    <Zap className="size-4" />
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-foreground">
                      Act
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Strategic Actions
                    </span>
                  </div>
                </div>
                <span
                  className="rounded-full px-3 py-1 text-sm font-bold text-white"
                  style={{ backgroundColor: activePhase.color }}
                >
                  {todayActionsDone}/{todayActionsTotal}
                </span>
              </div>
              <div className="flex flex-col gap-2.5 p-4">
                {todayContent.three_actions.map((action, i) => {
                  const key = `${selectedDay}-${i}`
                  const done = completedActions.has(key)
                  return (
                    <button
                      key={i}
                      onClick={() => toggleAction(selectedDay, i)}
                      disabled={saving}
                      className={`group flex items-start gap-4 rounded-xl border-2 p-4 text-left transition-all ${
                        done ? "border-transparent" : "hover:shadow-md"
                      }`}
                      style={
                        done
                          ? {
                              backgroundColor: `${activePhase.color}06`,
                              borderColor: `${activePhase.color}25`,
                            }
                          : undefined
                      }
                    >
                      <div
                        className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                          done ? "border-transparent" : ""
                        }`}
                        style={
                          done
                            ? { backgroundColor: activePhase.color }
                            : { borderColor: `${activePhase.color}40` }
                        }
                      >
                        {done && (
                          <CheckCircle2 className="size-5 text-white" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4
                          className={`text-base font-bold ${
                            done
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {action.action_title}
                        </h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {action.instruction}
                        </p>
                      </div>
                    </button>
                  )
                })}
              </div>

              {todayProgress === 100 && (
                <div
                  className="flex items-center gap-3 px-5 py-3"
                  style={{ backgroundColor: `${activePhase.color}10` }}
                >
                  <Sparkles
                    className="size-5"
                    style={{ color: activePhase.color }}
                  />
                  <p
                    className="text-sm font-bold"
                    style={{ color: activePhase.color }}
                  >
                    All actions completed for Day {selectedDay}! Great work.
                  </p>
                </div>
              )}
            </section>
          )}

        {!todayContent && (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-card py-16 text-center">
            <BookOpen className="mb-3 size-10 text-muted-foreground/40" />
            <h3 className="text-lg font-bold text-foreground">
              Content Coming Soon
            </h3>
            <p className="mt-1 max-w-xs text-sm text-muted-foreground">
              Day {selectedDay} content is being prepared.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
