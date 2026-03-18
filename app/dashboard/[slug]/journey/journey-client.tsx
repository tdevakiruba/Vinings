"use client"

import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Zap,
  Sparkles,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { VC_BLUE } from "@/lib/program-phases"

interface CurriculumDay {
  day_number: number
  title: string
  key_theme: string | null
  motivational_keynote?: string[] | null
  how_to_implement?: string[] | null
  three_actions: { action_title: string; instruction: string }[] | null
  scripture_reference?: string | null
  scripture_text?: string | null
  thought?: string | null
  real_scenario?: string | null
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
  phases: { week_number: number | null; theme: string }[]
}

export function JourneyClient({
  program,
  enrollmentId,
  currentDay,
  curriculum,
  userActions,
  phases: providedPhases,
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
  const [showDayPicker, setShowDayPicker] = useState(false)

  const todayContent = curriculum.find((d) => d.day_number === selectedDay)
  
  // Get current week/phase
  const currentWeek = Math.ceil(selectedDay / 7)
  const currentPhase = providedPhases.find((p) => p.week_number === currentWeek) || providedPhases[0]
  const phaseColor = [VC_BLUE.phase1, VC_BLUE.phase2, VC_BLUE.phase3][currentWeek - 1] || VC_BLUE.phase1

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

  // Calculate overall progress
  const totalActions = curriculum.reduce((sum, day) => sum + (day.three_actions?.length ?? 0), 0)
  const totalCompleted = completedActions.size
  const overallProgress = totalActions > 0 ? Math.round((totalCompleted / totalActions) * 100) : 0

  return (
    <div className="relative mx-auto max-w-3xl">
      {/* Sticky Progress Indicator - Top Right */}
      <div className="fixed right-4 top-20 z-50 hidden lg:block">
        <div className="flex flex-col items-center gap-2 rounded-2xl border bg-card p-3 shadow-lg">
          {/* Circular progress ring */}
          <div className="relative flex size-16 items-center justify-center">
            <svg className="size-16 -rotate-90" viewBox="0 0 36 36">
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className="text-muted"
              />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeDasharray={`${todayProgress * 0.9425} 94.25`}
                style={{ stroke: phaseColor }}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-sm font-bold" style={{ color: phaseColor }}>
              {todayActionsDone}/{todayActionsTotal}
            </span>
          </div>
          <span className="text-[10px] font-medium text-muted-foreground">Today</span>
          <div className="h-px w-full bg-border" />
          <span className="text-xs font-semibold text-foreground">Day {selectedDay}</span>
          <span className="text-[10px] text-muted-foreground">of {program.totalDays}</span>
        </div>
      </div>

      {/* Mobile sticky header */}
      <div className="sticky top-0 z-40 -mx-4 mb-4 border-b bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => selectedDay > 1 && setSelectedDay(selectedDay - 1)}
              disabled={selectedDay <= 1}
              className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowLeft className="size-4" />
            </button>
            <button
              onClick={() => setShowDayPicker(!showDayPicker)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-semibold hover:bg-muted"
            >
              Day {selectedDay}
              <ChevronDown className="size-3.5" />
            </button>
            <button
              onClick={() => selectedDay < currentDay && setSelectedDay(selectedDay + 1)}
              disabled={selectedDay >= currentDay}
              className="flex size-8 items-center justify-center rounded-lg border text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
          {/* Circular progress - mobile */}
          <div className="relative flex size-10 items-center justify-center">
            <svg className="size-10 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" strokeWidth="3" className="text-muted" />
              <circle
                cx="18" cy="18" r="15"
                fill="none"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={`${todayProgress * 0.9425} 94.25`}
                style={{ stroke: phaseColor }}
                className="transition-all duration-500"
              />
            </svg>
            <span className="absolute text-[10px] font-bold" style={{ color: phaseColor }}>
              {todayActionsDone}/{todayActionsTotal}
            </span>
          </div>
        </div>

        {/* Day picker dropdown */}
        {showDayPicker && (
          <div className="mt-3 flex flex-wrap gap-1.5 rounded-lg border bg-card p-2">
            {Array.from({ length: program.totalDays }, (_, i) => i + 1).map((day) => {
              const isLocked = day > currentDay
              const isSelected = day === selectedDay
              return (
                <button
                  key={day}
                  onClick={() => {
                    if (!isLocked) {
                      setSelectedDay(day)
                      setShowDayPicker(false)
                    }
                  }}
                  disabled={isLocked}
                  className={`flex size-8 items-center justify-center rounded-md text-xs font-semibold transition-colors ${
                    isSelected
                      ? "text-white"
                      : isLocked
                      ? "text-muted-foreground/40"
                      : "hover:bg-muted"
                  }`}
                  style={isSelected ? { backgroundColor: phaseColor } : undefined}
                >
                  {day}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Compact Header */}
      <div className="mb-6 rounded-xl p-4" style={{ backgroundColor: `${phaseColor}10` }}>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="mb-1 flex items-center gap-2">
              <span
                className="rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
                style={{ backgroundColor: phaseColor }}
              >
                Week {currentWeek}
              </span>
              <span className="text-xs text-muted-foreground">Day {selectedDay}</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {todayContent?.title ?? `Day ${selectedDay}`}
            </h1>
            {currentPhase?.theme && (
              <p className="mt-0.5 text-sm text-muted-foreground">{currentPhase.theme}</p>
            )}
          </div>
          {/* Desktop day nav */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              onClick={() => selectedDay > 1 && setSelectedDay(selectedDay - 1)}
              disabled={selectedDay <= 1}
              className="flex size-8 items-center justify-center rounded-lg border hover:bg-muted disabled:opacity-30"
            >
              <ArrowLeft className="size-4" />
            </button>
            <span className="min-w-[60px] text-center text-sm font-medium text-muted-foreground">
              {selectedDay} / {program.totalDays}
            </span>
            <button
              onClick={() => selectedDay < currentDay && setSelectedDay(selectedDay + 1)}
              disabled={selectedDay >= currentDay}
              className="flex size-8 items-center justify-center rounded-lg border hover:bg-muted disabled:opacity-30"
            >
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content - No fluff, straight to learning */}
      <div className="space-y-5">
        {/* Scripture */}
        {todayContent?.scripture_text && (
          <section className="rounded-xl border bg-card">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div
                className="flex size-8 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: phaseColor }}
              >
                <BookOpen className="size-4" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Scripture</h3>
                {todayContent.scripture_reference && (
                  <span className="text-xs text-muted-foreground">{todayContent.scripture_reference}</span>
                )}
              </div>
            </div>
            <div className="p-4">
              <p className="text-base italic leading-relaxed text-muted-foreground">
                &ldquo;{todayContent.scripture_text}&rdquo;
              </p>
            </div>
          </section>
        )}

        {/* Thought */}
        {todayContent?.thought && (
          <section className="rounded-xl border bg-card">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Lightbulb className="size-4" />
              </div>
              <h3 className="font-semibold text-foreground">Today&apos;s Thought</h3>
            </div>
            <div className="p-4">
              <p className="text-base leading-relaxed text-muted-foreground">{todayContent.thought}</p>
            </div>
          </section>
        )}

        {/* Real Scenario */}
        {todayContent?.real_scenario && (
          <section className="rounded-xl border bg-card">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-purple-500 text-white">
                <Sparkles className="size-4" />
              </div>
              <h3 className="font-semibold text-foreground">Real Scenario</h3>
            </div>
            <div className="p-4">
              <p className="text-base leading-relaxed text-muted-foreground">{todayContent.real_scenario}</p>
            </div>
          </section>
        )}

        {/* Actions */}
        {todayContent?.three_actions && todayContent.three_actions.length > 0 && (
          <section className="rounded-xl border bg-card">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex size-8 items-center justify-center rounded-lg text-white"
                  style={{ backgroundColor: phaseColor }}
                >
                  <Zap className="size-4" />
                </div>
                <h3 className="font-semibold text-foreground">Actions</h3>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-xs font-bold text-white"
                style={{ backgroundColor: phaseColor }}
              >
                {todayActionsDone}/{todayActionsTotal}
              </span>
            </div>
            <div className="divide-y">
              {todayContent.three_actions.map((action, i) => {
                const isCompleted = completedActions.has(`${selectedDay}-${i}`)
                return (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-4 transition-colors ${
                      isCompleted ? "bg-muted/30" : ""
                    }`}
                  >
                    <button
                      onClick={() => toggleAction(selectedDay, i)}
                      disabled={saving}
                      className="mt-0.5 shrink-0"
                    >
                      <CheckCircle2
                        className={`size-5 transition-colors ${
                          isCompleted ? "fill-current" : ""
                        }`}
                        style={{ color: isCompleted ? phaseColor : "#d1d5db" }}
                      />
                    </button>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{action.action_title}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">{action.instruction}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Generic Read section for non-worship */}
        {todayContent?.motivational_keynote && todayContent.motivational_keynote.length > 0 && (
          <section className="rounded-xl border bg-card">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div
                className="flex size-8 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: phaseColor }}
              >
                <BookOpen className="size-4" />
              </div>
              <h3 className="font-semibold text-foreground">Read</h3>
            </div>
            <div className="space-y-3 p-4">
              {todayContent.motivational_keynote.map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-muted-foreground">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Generic Reflect section for non-worship */}
        {todayContent?.how_to_implement && todayContent.how_to_implement.length > 0 && (
          <section className="rounded-xl border bg-card">
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500 text-white">
                <Lightbulb className="size-4" />
              </div>
              <h3 className="font-semibold text-foreground">Reflect</h3>
            </div>
            <div className="space-y-3 p-4">
              {todayContent.how_to_implement.map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-muted-foreground">{para}</p>
              ))}
            </div>
          </section>
        )}

        {/* Empty state */}
        {!todayContent && (
          <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-16 text-center">
            <BookOpen className="mb-4 size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-foreground">Content Coming Soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">Day {selectedDay} content is being prepared.</p>
          </div>
        )}
      </div>
    </div>
  )
}
