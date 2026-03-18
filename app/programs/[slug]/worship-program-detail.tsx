"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Heart,
  Lightbulb,
  Lock,
  MessageCircle,
  Quote,
  Zap,
} from "lucide-react"
import { useState } from "react"

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
  const [expandedDay, setExpandedDay] = useState<number | null>(null)

  const handleCTA = () => {
    if (!isLoggedIn) {
      window.location.href = `/signin?redirect=/programs/${program.slug}`
      return
    }
    if (hasSubscription) {
      window.location.href = `/dashboard/${program.slug}`
      return
    }
    window.location.href = `#pricing`
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
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-100 px-4 py-2">
              <Clock className="size-4 text-teal-600" />
              <span className="text-sm font-semibold text-teal-600">21 Days</span>
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
              <button
                onClick={handleCTA}
                className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 font-semibold text-white transition-all hover:bg-teal-700 hover:shadow-lg"
              >
                {hasSubscription ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="size-5" />
              </button>
              {!hasSubscription && (
                <>
                  <button
                    onClick={() =>
                      (window.location.href = isLoggedIn
                        ? "#"
                        : `/signin?redirect=/programs/${program.slug}`)
                    }
                    className="rounded-full border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-all hover:border-teal-600 hover:bg-teal-50"
                  >
                    {isLoggedIn ? "Sign Out" : "Sign In"}
                  </button>
                  <button
                    onClick={() =>
                      (window.location.href = `/signup?redirect=/programs/${program.slug}`)
                    }
                    className="rounded-full border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 transition-all hover:border-teal-600 hover:bg-teal-50"
                  >
                    Create Account
                  </button>
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
                title: "Worship Leaders",
                description:
                  "Deepen your spiritual leadership and elevate your worship practice with practical daily frameworks.",
              },
              {
                icon: Lightbulb,
                title: "Spiritual Seekers",
                description:
                  "Transform your personal worship journey through scriptural guidance and actionable spiritual practices.",
              },
              {
                icon: Users,
                title: "Church Communities",
                description:
                  "Build a stronger, more spiritually aligned community through shared worship transformation.",
              },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="rounded-2xl border border-slate-200 p-6">
                  <div className="mb-4 inline-flex items-center justify-center rounded-full bg-teal-100 p-3">
                    <Icon className="size-6 text-teal-600" />
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

      {/* Your 21-Day Worship Journey */}
      <section className="px-4 py-16 sm:px-6 lg:px-8 bg-slate-50">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12">
            <h2 className="mb-4 text-3xl font-bold text-slate-900">
              Your 21-Day Worship Journey
            </h2>
            <p className="text-lg text-slate-600">
              {curriculum.length > 0
                ? "Daily spiritual practices designed to transform how you worship and live your faith."
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
                      <div className="flex size-10 items-center justify-center rounded-full bg-teal-600 text-white font-bold">
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
                          className="text-left rounded-2xl border-2 border-slate-200 bg-white p-6 transition-all hover:border-teal-300 hover:shadow-lg"
                        >
                          {/* Day Number */}
                          <div className="mb-3 flex items-center justify-between">
                            <span className="inline-block rounded-full bg-teal-100 px-3 py-1 text-xs font-bold text-teal-600">
                              Day {lesson.day_number}
                            </span>
                            {expandedDay === lesson.day_number ? (
                              <Zap className="size-5 text-teal-600" />
                            ) : (
                              <ArrowRight className="size-5 text-slate-400" />
                            )}
                          </div>

                          {/* Theme & Title */}
                          <h4 className="mb-1 font-bold text-slate-900">
                            {lesson.title}
                          </h4>
                          {lesson.theme && (
                            <p className="mb-3 text-sm font-medium text-teal-600">
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
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-500" />
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

      {/* CTA Section */}
      {!hasSubscription && (
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl rounded-2xl bg-gradient-to-br from-teal-600 to-teal-700 p-8 sm:p-12 text-center text-white">
            <h2 className="mb-4 text-3xl font-bold">Ready to Transform Your Worship?</h2>
            <p className="mb-8 text-lg opacity-90">
              Join thousands of worship leaders and spiritual seekers on their
              21-day transformation journey.
            </p>
            <button
              onClick={handleCTA}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 font-bold text-teal-600 transition-all hover:shadow-lg hover:scale-105"
            >
              {hasSubscription ? "Go to Dashboard" : "Start Your Free Trial"}
              <ArrowRight className="size-5" />
            </button>
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
