"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Crown,
  Eye,
  Heart,
  Lightbulb,
  Lock,
  MessageCircle,
  Quote,
  Shield,
  Sword,
  User,
  Zap,
} from "lucide-react"

// Worship program phases
const WORSHIP_PHASES = [
  {
    name: "Perspective",
    days: "Days 1-7",
    description: "See God as bigger than your circumstances",
    color: "#1e3a8a", // ink blue dark
    icon: Eye,
    outcomes: [
      "Shift focus from problems to God's sovereignty",
      "Develop awe and reverence in daily life",
      "Build trust through expanded vision",
    ],
  },
  {
    name: "Identity",
    days: "Days 8-14",
    description: "Understand who you are in Christ",
    color: "#3b82f6", // ink blue light
    icon: User,
    outcomes: [
      "Anchor your identity in Christ, not circumstances",
      "Release performance-based acceptance",
      "Walk in confidence and spiritual authority",
    ],
  },
  {
    name: "Warfare",
    days: "Days 15-21",
    description: "Use worship as a spiritual weapon",
    color: "#1e40af", // ink blue medium
    icon: Sword,
    outcomes: [
      "Deploy worship against fear and anxiety",
      "Break through spiritual opposition",
      "Lead others through worship-driven victory",
    ],
  },
]
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface WorshipLesson {
  id: number
  day_number: number
  week_number: number
  theme: string
  title: string
  scripture_reference: string
  scripture_niv: string
  thought: string
  real_scenario: string
  action_1: string
  action_2: string
  action_3: string
}

interface Program {
  id: string
  title: string
  slug: string
  tagline: string
  description: string | null
  duration: string | null
  [key: string]: unknown
}

interface WorshipProgramDetailProps {
  program: Program
  curriculum: WorshipLesson[]
  isLoggedIn: boolean
  hasSubscription: boolean
}

export function WorshipProgramDetail({
  program,
  curriculum,
  isLoggedIn,
  hasSubscription,
}: WorshipProgramDetailProps) {
  const router = useRouter()
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [enrolling, setEnrolling] = useState(false)

  const handleEnrollNow = async () => {
    if (!isLoggedIn) {
      router.push(`/signin?redirect=/programs/${program.slug}`)
      return
    }
    if (hasSubscription) {
      router.push(`/dashboard`)
      return
    }

    setEnrolling(true)
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programSlug: program.slug,
          planTier: "individual",
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        alert(err.error || "Enrollment failed")
        return
      }
      router.push(`/dashboard`)
    } catch {
      alert("Something went wrong. Please try again.")
    } finally {
      setEnrolling(false)
    }
  }

  const handleSignIn = () => {
    router.push(`/signin?redirect=/programs/${program.slug}`)
  }

  // Group lessons by week
  const weekGroups = curriculum.reduce(
    (acc, lesson) => {
      const week = lesson.week_number || 1
      if (!acc[week]) acc[week] = []
      acc[week].push(lesson)
      return acc
    },
    {} as Record<number, WorshipLesson[]>
  )

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden bg-gradient-to-br from-amber-900 to-amber-950">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/programs/worship-hero.jpg"
            alt="Worship gathering"
            fill
            priority
            loading="eager"
            className="object-cover opacity-60"
          />
        </div>

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/20 to-transparent" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-8">
          {/* Floating Card */}
          <div className="mx-auto w-full max-w-2xl rounded-3xl bg-white/95 backdrop-blur-sm p-8 sm:p-12 shadow-2xl">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2">
              <Clock className="size-4 text-blue-900" />
              <span className="text-sm font-semibold text-blue-900">21 Days</span>
            </div>

            {/* Headline */}
            <h1 className="mb-4 text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 text-balance">
              {program.title}
            </h1>

            {/* Description */}
            <p className="mb-8 text-lg text-slate-600">
              {program.description ||
                "Transform worship from a moment into a lifestyle of power and spiritual transformation."}
            </p>

            {/* CTAs */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
              {hasSubscription ? (
                /* Enrolled: only show Dashboard */
                <button
                  onClick={() => router.push("/dashboard")}
                  className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  Dashboard
                  <ArrowRight className="size-5" />
                </button>
              ) : (
                <>
                  {/* Enroll Now */}
                  <button
                    onClick={handleEnrollNow}
                    disabled={enrolling}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-900 px-6 py-3 font-semibold text-white transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                  >
                    {enrolling ? 'Enrolling...' : 'Enroll Now'}
                    <ArrowRight className="size-5" />
                  </button>
                  {/* Sign In — only when not logged in */}
                  {!isLoggedIn && (
                    <button
                      onClick={handleSignIn}
                      className="rounded-full border-2 border-blue-900 px-6 py-3 font-semibold text-blue-900 transition-all hover:bg-blue-50"
                    >
                      Sign In
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Who This Program Is For */}
      <section className="border-b px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-3xl font-bold text-slate-900">
            Who This Program Is For
          </h2>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Heart,
                title: "Believers Facing Stress",
                description:
                  "Learn to deploy worship as your first response to pressure, anxiety, and overwhelming circumstances.",
              },
              {
                icon: Lightbulb,
                title: "Decision Makers",
                description:
                  "Gain clarity and confidence in uncertain seasons through a worship-centered approach to discernment.",
              },
              {
                icon: Crown,
                title: "Spiritual Leaders",
                description:
                  "Lead others from a posture of worship that influences how you think, respond, and guide your community.",
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="rounded-2xl border border-slate-200 p-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-blue-100 p-3">
                    <Icon className="size-6 text-blue-900" />
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Your 21-Day Worship Journey - Phase Overview */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Your 21-Day Journey
            </h2>
            <p className="text-lg text-slate-600">
              Three phases designed to transform worship into a lifestyle of power.
            </p>
          </div>

          {/* Phase Timeline */}
          <div className="relative">
            {WORSHIP_PHASES.map((phase, index) => {
              const Icon = phase.icon
              return (
                <div key={phase.name} className="relative flex gap-6 pb-12 last:pb-0">
                  {/* Timeline Line */}
                  {index < WORSHIP_PHASES.length - 1 && (
                    <div
                      className="absolute left-[28px] top-[56px] h-[calc(100%-56px)] w-0.5"
                      style={{ backgroundColor: phase.color }}
                    />
                  )}

                  {/* Icon Circle */}
                  <div
                    className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full"
                    style={{ backgroundColor: `${phase.color}20` }}
                  >
                    <Icon className="size-7" style={{ color: phase.color }} />
                  </div>

                  {/* Phase Content */}
                  <div className="flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-3">
                      <h3 className="text-2xl font-bold text-slate-900">
                        {phase.name}
                      </h3>
                      <span
                        className="rounded-full px-3 py-1 text-xs font-bold text-white"
                        style={{ backgroundColor: phase.color }}
                      >
                        {phase.days}
                      </span>
                    </div>
                    <p className="mb-4 text-slate-600">{phase.description}</p>

                    {/* Outcome Tags */}
                    <div className="flex flex-wrap gap-2">
                      {phase.outcomes.map((outcome, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1.5 rounded-full border bg-white px-3 py-1.5 text-sm text-slate-700"
                          style={{ borderColor: `${phase.color}40` }}
                        >
                          <CheckCircle2
                            className="size-4"
                            style={{ color: phase.color }}
                          />
                          {outcome}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Daily Curriculum */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Daily Curriculum
            </h2>
            <p className="text-lg text-slate-600">
              {curriculum.length > 0
                ? "Each day includes scripture, real-life scenarios, and actionable practices for stress, pressure, decision-making, and uncertainty."
                : "Loading curriculum..."}
            </p>
          </div>

          {curriculum.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
              <BookOpen className="mx-auto mb-4 size-12 text-slate-400" />
              <p className="text-slate-600">
                Curriculum loading or not yet available.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(weekGroups)
                .sort(([weekA], [weekB]) => Number(weekA) - Number(weekB))
                .map(([week, lessons]) => (
                  <div key={week}>
                    {/* Week Header */}
                    <div className="mb-4 flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-blue-900 text-white font-bold">
                        W{week}
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Week {week}
                      </h3>
                    </div>

                    {/* Week Lessons Grid */}
                    <div className="grid gap-4 md:grid-cols-3">
                      {lessons.map((lesson) => (
                        <button
                          key={lesson.id}
                          onClick={() =>
                            setExpandedDay(
                              expandedDay === lesson.day_number
                                ? null
                                : lesson.day_number
                            )
                          }
                          className="text-left rounded-2xl border-2 border-slate-200 bg-white p-6 transition-all hover:border-blue-300 hover:shadow-lg"
                        >
                          {/* Day Number */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-900">
                              Day {lesson.day_number}
                            </span>
                            {expandedDay === lesson.day_number ? (
                              <Zap className="size-5 text-blue-900" />
                            ) : (
                              <ArrowRight className="size-5 text-slate-400" />
                            )}
                          </div>

                          {/* Theme & Title */}
                          <h4 className="mb-1 font-bold text-slate-900">
                            {lesson.title}
                          </h4>
                          {lesson.theme && (
                            <p className="mb-3 text-sm font-medium text-blue-900">
                              {lesson.theme}
                            </p>
                          )}

                          {/* Scripture Reference */}
                          {lesson.scripture_reference && (
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                              {lesson.scripture_reference}
                            </p>
                          )}

                          {/* Expand Details */}
                          {expandedDay === lesson.day_number && (
                            <div className="mt-4 border-t pt-4 space-y-4">
                              {/* Scripture */}
                              {lesson.scripture_niv && (
                                <div className="rounded-lg bg-amber-50 p-3">
                                  <div className="mb-2 flex items-start gap-2">
                                    <Quote className="mt-1 size-4 shrink-0 text-amber-600" />
                                    <p className="text-sm italic text-slate-700">
                                      {lesson.scripture_niv}
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Thought */}
                              {lesson.thought && (
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Today&apos;s Thought
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {lesson.thought}
                                  </p>
                                </div>
                              )}

                              {/* Real Scenario */}
                              {lesson.real_scenario && (
                                <div>
                                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                    Real-Life Scenario
                                  </p>
                                  <p className="text-sm text-slate-600">
                                    {lesson.real_scenario}
                                  </p>
                                </div>
                              )}

                              {/* Actions */}
                              <div>
                                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                                  Today&apos;s Actions
                                </p>
                                <ul className="space-y-1.5">
                                  {[lesson.action_1, lesson.action_2, lesson.action_3]
                                    .filter(Boolean)
                                    .map((action, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-slate-600"
                                      >
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-blue-500" />
                                        {action}
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section — only show if not enrolled */}
      {!hasSubscription && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 sm:p-12 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Worship?</h2>
            <p className="mb-8 text-lg opacity-90">
              Join believers on a 21-day journey that shifts worship from a Sunday activity into a daily lifestyle of power.
            </p>
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <button
                onClick={() =>
                  (window.location.href = isLoggedIn
                    ? "/dashboard"
                    : `/signup?redirect=/programs/${program.slug}`)
                }
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-blue-900 transition-all hover:shadow-lg hover:scale-105"
              >
                Enroll Now
                <ArrowRight className="size-5" />
              </button>
              {!isLoggedIn && (
                <button
                  onClick={() =>
                    (window.location.href = `/signin?redirect=/programs/${program.slug}`)
                  }
                  className="rounded-full border-2 border-white/60 px-8 py-4 font-bold text-white transition-all hover:bg-white/10"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Helper component for Users icon
function Users({ className }: { className: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
