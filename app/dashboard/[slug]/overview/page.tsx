import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { OverviewClient } from "./overview-client"

export default async function OverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/signin")

  // Get program
  const { data: program } = await supabase
    .from("vc_programs")
    .select("id, slug, title, tagline, duration, description")
    .eq("slug", slug)
    .single()

  if (!program) redirect("/dashboard")

  // Get enrollment
  const { data: enrollment } = await supabase
    .from("vc_enrollments")
    .select("id, progress_percentage, enrolled_at, status")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .maybeSingle()

  if (!enrollment) redirect(`/programs/${slug}`)

  // Get subscription
  const { data: subscription } = await supabase
    .from("vc_subscriptions")
    .select("plan_type, current_period_start, current_period_end")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  // Calculate progress
  const durationMatch = program.duration?.match(/(\d+)/)
  const totalDays = durationMatch ? parseInt(durationMatch[1], 10) : 21
  let currentDay = 1
  if (enrollment.enrolled_at) {
    const start = new Date(enrollment.enrolled_at)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    currentDay = Math.min(Math.max(diffDays + 1, 1), totalDays)
  }

  // Get user actions completed
  const { count: actionsCompleted } = await supabase
    .from("vc_user_actions")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("program_id", program.id)

  // Get streak
  const { data: streak } = await supabase
    .from("vc_user_streaks")
    .select("current_streak, longest_streak, last_activity_date")
    .eq("user_id", user.id)
    .maybeSingle()

  // Get today's insight (title + theme for the daily quote tile)
  let dailyInsight: { title: string; keyTheme: string } | null = null
  if (slug === "workforce-mindset-21-day") {
    const { data: dayData } = await supabase
      .from("vc_workforce_mindset_21day")
      .select("title, theme")
      .eq("day_number", currentDay)
      .maybeSingle()
    if (dayData) {
      dailyInsight = {
        title: dayData.title,
        keyTheme: dayData.theme ?? "",
      }
    }
  }

  // Fetch phases/themes for the program
  let phases: { week_number: number | null; theme: string }[] = []
  if (slug === "worship-wins-the-war-21day") {
    const { data: weeklyThemes } = await supabase
      .from("vc_worship_microlearning_lessons")
      .select("week_number, theme")
      .eq("is_active", true)
      .order("week_number")
    phases = weeklyThemes ?? []
  } else {
    // Default phases for workforce program
    phases = [
      { week_number: 1, theme: "Foundation" },
      { week_number: 2, theme: "Growth Strategy" },
      { week_number: 3, theme: "Leadership Mastery" },
    ]
  }

  return (
    <OverviewClient
      program={{
        name: program.title,
        slug: program.slug,
        tagline: program.tagline,
        description: program.description,
        badgeColor: "#00c892",
        signalAcronym: "",
        audience: "",
        totalDays,
      }}
      enrollment={{
        currentDay,
        totalDays,
        progress: Math.round((currentDay / totalDays) * 100),
        startDate: enrollment.enrolled_at,
        endDate: subscription?.current_period_end ?? null,
        planTier: subscription?.plan_type ?? "free",
      }}
      stats={{
        actionsCompleted: actionsCompleted ?? 0,
        currentStreak: streak?.current_streak ?? 0,
        longestStreak: streak?.longest_streak ?? 0,
        lastActivity: streak?.last_activity_date ?? null,
      }}
      phases={phases}
      dailyInsight={dailyInsight}
    />
  )
}
