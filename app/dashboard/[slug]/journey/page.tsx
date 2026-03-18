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

  // Fetch curriculum
  let curriculum: {
    day_number: number
    title: string
    theme?: string | null
    overview?: string | null
    main_content?: string | null
    exercises?: any[] | null
    key_theme?: string | null
    motivational_keynote?: string[] | null
    how_to_implement?: string[] | null
    three_actions?: { action_title: string; instruction: string }[] | null
    // Worship-specific fields
    scripture_reference?: string | null
    scripture_text?: string | null
    thought?: string | null
    real_scenario?: string | null
  }[] = []

  if (slug === "workforce-mindset-21-day") {
    const { data: days } = await supabase
      .from("vc_workforce_mindset_21day")
      .select(
        "day_number, title, theme, overview, main_content, exercises"
      )
      .order("day_number")
    curriculum = days ?? []
  } else if (slug === "worship-wins-the-war-21day") {
    const { data: lessons, error } = await supabase
      .from("vc_worship_microlearning_lessons")
      .select(
        "day_number, title, theme, scripture_reference, scripture_niv, thought, real_scenario, action_1, action_2, action_3"
      )
      .eq("is_active", true)
      .order("day_number")
    // Transform worship lessons to match curriculum structure
    curriculum = (lessons ?? []).map((lesson) => ({
      day_number: lesson.day_number,
      title: lesson.title,
      key_theme: lesson.theme,
      scripture_reference: lesson.scripture_reference,
      scripture_text: lesson.scripture_niv,
      thought: lesson.thought,
      real_scenario: lesson.real_scenario,
      three_actions: [
        ...(lesson.action_1 ? [{ action_title: "Action 1", instruction: lesson.action_1 }] : []),
        ...(lesson.action_2 ? [{ action_title: "Action 2", instruction: lesson.action_2 }] : []),
        ...(lesson.action_3 ? [{ action_title: "Action 3", instruction: lesson.action_3 }] : []),
      ],
    }))
  }

  // Fetch user action progress
  const { data: userActions } = await supabase
    .from("vc_user_actions")
    .select("action_type, action_data, created_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)

  // Fetch phases/themes for the current program
  let phases: { week_number: number | null; theme: string }[] = []
  
  if (slug === "worship-wins-the-war-21day") {
    const { data: weeklyThemes } = await supabase
      .from("vc_worship_microlearning_lessons")
      .select("week_number, theme")
      .eq("is_active", true)
      .distinct()
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
      phases={phases}
    />
  )
}
