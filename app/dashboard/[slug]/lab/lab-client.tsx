"use client"

import { useState } from "react"
import {
  FlaskConical,
  Calendar,
  ExternalLink,
  Send,
  Clock,
  Lightbulb,
  Users,
  HelpCircle,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

/* ── Types ── */
interface OfficeHoursSession {
  id: string
  title: string
  description: string | null
  meeting_url: string | null
  scheduled_at: string
  duration_minutes: number
  status: string
}

interface Submission {
  id: string
  category: string
  title: string
  description: string
  status: string
  created_at: string
}

interface LabClientProps {
  program: {
    id: string
    slug: string
    name: string
    badgeColor: string
  }
  nextOfficeHours: OfficeHoursSession | null
  initialSubmissions: Submission[]
}

/* ── Categories ── */
const categories = [
  {
    id: "career-challenge",
    label: "Career Challenge",
    icon: TrendingUp,
    description: "Career decisions, job transitions, promotions",
  },
  {
    id: "workplace-conflict",
    label: "People & Team",
    icon: Users,
    description: "Interpersonal dynamics, teamwork, feedback",
  },
  {
    id: "leadership-dilemma",
    label: "Leadership Dilemma",
    icon: HelpCircle,
    description: "Ethical choices, authority, influence",
  },
  {
    id: "professional-growth",
    label: "Professional Growth",
    icon: Lightbulb,
    description: "Skills, learning, personal development",
  },
] as const

const submissionTips = [
  "Be specific about the context and stakeholders",
  "Share what you've already tried",
  "Describe your desired outcome",
  "Keep scenarios confidential-safe",
]

const statusLabels: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending Review", color: "#f59e0b" },
  selected: { label: "Selected for Discussion", color: "#3b82f6" },
  discussed: { label: "Discussed", color: "#10b981" },
  archived: { label: "Archived", color: "#6b7280" },
}

export function LabClient({
  program,
  nextOfficeHours,
  initialSubmissions,
}: LabClientProps) {
  const router = useRouter()
  const [submissions, setSubmissions] = useState<Submission[]>(initialSubmissions)
  const [selectedCategory, setSelectedCategory] = useState(categories[0].id)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleSubmit = async () => {
    if (!title.trim() || !description.trim()) return

    setIsSubmitting(true)
    setSubmitError("")
    setSubmitSuccess(false)

    try {
      const res = await fetch("/api/lab-submission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          programId: program.id,
          category: selectedCategory,
          title: title.trim(),
          description: description.trim(),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Failed to submit")
      }

      const data = await res.json()
      setSubmissions((prev) => [data.submission, ...prev])
      setTitle("")
      setDescription("")
      setSubmitSuccess(true)
      setTimeout(() => setSubmitSuccess(false), 4000)
      router.refresh()
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (iso: string) => {
    const d = new Date(iso)
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const formatRelative = (iso: string) => {
    const d = new Date(iso)
    const now = new Date()
    const diff = now.getTime() - d.getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    const days = Math.floor(hrs / 24)
    if (days < 7) return `${days}d ago`
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
  }

  return (
    <div className="mx-auto max-w-6xl">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Decision Lab
        </h1>
        <p className="mt-2 text-base text-muted-foreground">
          Submit challenging scenarios and career dilemmas for expert guidance
          during office hours
        </p>
      </div>

      {/* Main layout: 2-col on lg */}
      <div className="flex flex-col gap-6 lg:flex-row">
        {/* Left column: Office Hours Banner + Form */}
        <div className="flex-1 space-y-6">
          {/* ── Office Hours Banner ── */}
          {nextOfficeHours && (
            <div
              className="relative overflow-hidden rounded-2xl p-6"
              style={{
                background: `linear-gradient(135deg, ${program.badgeColor}, ${program.badgeColor}cc)`,
              }}
            >
              {/* Decorative circles */}
              <div
                className="absolute -right-8 -top-8 size-32 rounded-full opacity-10"
                style={{ backgroundColor: "white" }}
              />
              <div
                className="absolute -bottom-4 -left-4 size-20 rounded-full opacity-10"
                style={{ backgroundColor: "white" }}
              />

              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Calendar className="size-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Next Office Hours
                    </p>
                    <h3 className="mt-1 text-lg font-bold text-white">
                      {nextOfficeHours.title}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-white/80">
                      <Clock className="size-3.5" />
                      {formatDate(nextOfficeHours.scheduled_at)} at{" "}
                      {formatTime(nextOfficeHours.scheduled_at)}
                    </p>
                  </div>
                </div>
                {nextOfficeHours.meeting_url && (
                  <Button
                    asChild
                    size="lg"
                    className="shrink-0 rounded-full bg-white px-6 font-bold text-foreground shadow-lg hover:bg-white/90"
                  >
                    <a
                      href={nextOfficeHours.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Join Meeting
                      <ExternalLink className="ml-2 size-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* ── Submission Form ── */}
          <div className="rounded-2xl border bg-card p-6 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div
                className="flex size-10 items-center justify-center rounded-xl"
                style={{ backgroundColor: `${program.badgeColor}15` }}
              >
                <FlaskConical
                  className="size-5"
                  style={{ color: program.badgeColor }}
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-card-foreground">
                  Submit a Scenario
                </h2>
                <p className="text-sm text-muted-foreground">
                  Share a real challenge you{"'"}re facing. Your scenario will be
                  discussed during the next office hours session.
                </p>
              </div>
            </div>

            {/* Success message */}
            {submitSuccess && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-sm font-medium text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
                <CheckCircle2 className="size-4 shrink-0" />
                Scenario submitted successfully! It will be reviewed for the next
                office hours.
              </div>
            )}

            {/* Error message */}
            {submitError && (
              <div className="mb-4 flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700 dark:bg-red-950/30 dark:text-red-400">
                <AlertCircle className="size-4 shrink-0" />
                {submitError}
              </div>
            )}

            {/* Category selector */}
            <div className="mb-5">
              <label className="mb-2 block text-sm font-semibold text-card-foreground">
                Category
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isActive = selectedCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex flex-col items-start gap-2 rounded-xl border-2 p-3 text-left transition-all ${
                        isActive
                          ? "shadow-md"
                          : "border-transparent bg-muted/50 hover:border-muted-foreground/20"
                      }`}
                      style={
                        isActive
                          ? {
                              borderColor: program.badgeColor,
                              backgroundColor: `${program.badgeColor}08`,
                            }
                          : undefined
                      }
                    >
                      <Icon
                        className="size-5"
                        style={{
                          color: isActive
                            ? program.badgeColor
                            : "var(--muted-foreground)",
                        }}
                      />
                      <span
                        className={`text-xs font-semibold ${
                          isActive ? "" : "text-muted-foreground"
                        }`}
                        style={isActive ? { color: program.badgeColor } : undefined}
                      >
                        {cat.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Title input */}
            <div className="mb-4">
              <label
                htmlFor="lab-title"
                className="mb-1.5 block text-sm font-semibold text-card-foreground"
              >
                Brief Title
              </label>
              <input
                id="lab-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
                placeholder="e.g., Handling resistance to a new initiative"
                className="w-full rounded-xl border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                style={
                  { "--tw-ring-color": program.badgeColor } as React.CSSProperties
                }
              />
            </div>

            {/* Description textarea */}
            <div className="mb-4">
              <label
                htmlFor="lab-desc"
                className="mb-1.5 block text-sm font-semibold text-card-foreground"
              >
                Describe Your Scenario
              </label>
              <textarea
                id="lab-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={2000}
                rows={6}
                placeholder="Provide context about the situation, the stakeholders involved, what you've tried, and what outcome you're hoping for..."
                className="w-full resize-y rounded-xl border bg-background px-4 py-3 text-sm leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2"
                style={
                  { "--tw-ring-color": program.badgeColor } as React.CSSProperties
                }
              />
              <p className="mt-1 text-xs text-muted-foreground">
                {description.length}/2000 characters
              </p>
            </div>

            {/* Submit button */}
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !title.trim() || !description.trim()}
              className="rounded-xl px-6 text-white"
              style={{ backgroundColor: program.badgeColor }}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 size-4" />
                  Submit for Office Hours
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Right column: Submissions + Tips */}
        <div className="w-full space-y-6 lg:w-80">
          {/* ── My Submissions ── */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              <h3 className="text-base font-bold text-card-foreground">
                My Submissions
              </h3>
            </div>

            {submissions.length === 0 ? (
              <div className="py-8 text-center">
                <MessageSquare className="mx-auto mb-3 size-10 text-muted-foreground/30" />
                <p className="text-sm font-medium text-muted-foreground">
                  No submissions yet
                </p>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  Submit your first scenario above
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub) => {
                  const statusInfo = statusLabels[sub.status] ?? statusLabels.pending
                  const catInfo = categories.find((c) => c.id === sub.category)
                  return (
                    <div
                      key={sub.id}
                      className="rounded-xl border bg-background p-3"
                    >
                      <div className="mb-1.5 flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-card-foreground line-clamp-2">
                          {sub.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold"
                          style={{
                            backgroundColor: `${statusInfo.color}15`,
                            color: statusInfo.color,
                          }}
                        >
                          {statusInfo.label}
                        </span>
                        {catInfo && (
                          <span className="text-[10px] text-muted-foreground">
                            {catInfo.label}
                          </span>
                        )}
                      </div>
                      <p className="mt-1.5 text-[10px] text-muted-foreground">
                        {formatRelative(sub.created_at)}
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ── Submission Tips ── */}
          <div className="rounded-2xl border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb
                className="size-4"
                style={{ color: program.badgeColor }}
              />
              <h3 className="text-base font-bold text-card-foreground">
                Submission Tips
              </h3>
            </div>
            <ul className="space-y-2.5">
              {submissionTips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2
                    className="mt-0.5 size-3.5 shrink-0"
                    style={{ color: program.badgeColor }}
                  />
                  <span className="text-xs leading-relaxed text-muted-foreground">
                    {tip}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
