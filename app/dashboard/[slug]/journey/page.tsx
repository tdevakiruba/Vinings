import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { JourneyClient } from "./journey-client"

export default async function JourneyPage({
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
    .from("programs")
    .select("id, slug, name, color, badge, duration")
    .eq("slug", slug)
    .single()

  if (!program) redirect("/dashboard")

  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, current_day, started_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .maybeSingle()

  if (!enrollment) redirect(`/programs/${slug}`)

  // Calculate current day
  const durationMatch = program.duration?.match(/(\d+)/)
  const totalDays = durationMatch ? parseInt(durationMatch[1], 10) : 21
  let currentDay = 1
  if (enrollment.started_at) {
    const start = new Date(enrollment.started_at)
    const now = new Date()
    const diffDays = Math.floor(
      (now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
    )
    currentDay = Math.min(Math.max(diffDays + 1, 1), totalDays)
  }

  // Fetch curriculum (for now only workforce-ready has content)
  let curriculum: {
    day_number: number
    title: string
    key_theme: string | null
    motivational_keynote: string[] | null
    how_to_implement: string[] | null
    three_actions: { action_title: string; instruction: string }[] | null
  }[] = []

  if (slug === "workforce-ready") {
    const { data: days } = await supabase
      .from("workforce_mindset_21day")
      .select(
        "day_number, title, key_theme, motivational_keynote, how_to_implement, three_actions"
      )
      .order("day_number")
    curriculum = days ?? []
  }

  // Fetch user action progress
  const { data: userActions } = await supabase
    .from("user_actions")
    .select("day_number, action_index, completed")
    .eq("enrollment_id", enrollment.id)

  return (
    <JourneyClient
      program={{
        slug: program.slug,
        name: program.name,
        badgeColor: program.color ?? "#00c892",
        signalAcronym: program.badge ?? "",
        totalDays,
      }}
      enrollmentId={enrollment.id}
      currentDay={currentDay}
      curriculum={curriculum}
      userActions={userActions ?? []}
    />
  )
}
