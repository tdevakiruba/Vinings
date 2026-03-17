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
    .from("VC_programs")
    .select("id, slug, title, duration")
    .eq("slug", slug)
    .single()

  if (!program) redirect("/dashboard")

  const { data: enrollment } = await supabase
    .from("VC_enrollments")
    .select("id, progress_percentage, enrolled_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .maybeSingle()

  if (!enrollment) redirect(`/programs/${slug}`)

  // Calculate current day
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

  // Fetch curriculum (for now only workforce-mindset-21-day has content)
  let curriculum: {
    day_number: number
    title: string
    theme: string | null
    overview: string | null
    main_content: string | null
    exercises: any[] | null
  }[] = []

  if (slug === "workforce-mindset-21-day") {
    const { data: days } = await supabase
      .from("VC_workforce_mindset_21day")
      .select(
        "day_number, title, theme, overview, main_content, exercises"
      )
      .order("day_number")
    curriculum = days ?? []
  }

  // Fetch user action progress
  const { data: userActions } = await supabase
    .from("VC_user_actions")
    .select("action_type, action_data, created_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)

  return (
    <JourneyClient
      program={{
        slug: program.slug,
        name: program.title,
        badgeColor: "#00c892",
        signalAcronym: "",
        totalDays,
      }}
      enrollmentId={enrollment.id}
      currentDay={currentDay}
      curriculum={curriculum}
      userActions={userActions ?? []}
    />
  )
}
