import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { FrameworksClient } from "./frameworks-client"

export default async function FrameworksPage({
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

  const { data: program } = await supabase
    .from("vc_programs")
    .select("id, slug, title, duration")
    .eq("slug", slug)
    .single()

  if (!program) redirect("/dashboard")

  const { data: enrollment } = await supabase
    .from("vc_enrollments")
    .select("id, progress_percentage, enrolled_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .maybeSingle()

  if (!enrollment) redirect(`/programs/${slug}`)

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

  // Fetch curriculum
  let curriculum: {
    day_number: number
    title: string
    theme: string | null
  }[] = []

  if (slug === "workforce-mindset-21-day") {
    const { data: days } = await supabase
      .from("vc_workforce_mindset_21day")
      .select("day_number, title, theme")
      .order("day_number")
    curriculum = days ?? []
  } else if (slug === "worship-wins-the-war-21day") {
    const { data: lessons } = await supabase
      .from("vc_worship_microlearning_lessons")
      .select("day_number, title, theme")
      .eq("is_active", true)
      .order("day_number")
    curriculum = lessons ?? []
  }

  // Fetch user action completions per day
  const { data: userActions } = await supabase
    .from("vc_user_actions")
    .select("action_type, action_data")
    .eq("user_id", user.id)
    .eq("program_id", program.id)

  // Build completion map
  const completionMap: Record<number, { total: number; done: number }> = {}
  for (const a of userActions ?? []) {
    if (!completionMap[a.day_number]) {
      completionMap[a.day_number] = { total: 0, done: 0 }
    }
    completionMap[a.day_number].total++
    if (a.completed) completionMap[a.day_number].done++
  }

  // Fetch phases/themes (deduplicated by week)
  let phases: { week_number: number | null; theme: string }[] = []
  if (slug === "worship-wins-the-war-21day") {
    const { data: weeklyThemes } = await supabase
      .from("vc_worship_microlearning_lessons")
      .select("week_number, theme")
      .eq("is_active", true)
      .order("week_number")
    // Deduplicate by week_number to get 3 unique phases
    const uniquePhases = new Map<number, string>()
    for (const row of weeklyThemes ?? []) {
      if (row.week_number && !uniquePhases.has(row.week_number)) {
        uniquePhases.set(row.week_number, row.theme)
      }
    }
    phases = Array.from(uniquePhases.entries()).map(([week_number, theme]) => ({
      week_number,
      theme,
    }))
  } else {
    // Default phases for workforce program
    phases = [
      { week_number: 1, theme: "Foundation" },
      { week_number: 2, theme: "Growth Strategy" },
      { week_number: 3, theme: "Leadership Mastery" },
    ]
  }

  return (
    <FrameworksClient
      program={{
        slug: program.slug,
        name: program.title,
        badgeColor: "#00c892",
        signalAcronym: "",
        totalDays,
      }}
      currentDay={currentDay}
      curriculum={curriculum}
      completionMap={completionMap}
      phases={phases}
    />
  )
}
