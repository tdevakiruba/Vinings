import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardClient } from "./dashboard-client"

export const metadata = {
  title: "Dashboard",
  description: "Your Transformer Hub Institute learning dashboard",
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/signin")

  // Get profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("first_name, last_name")
    .eq("id", user.id)
    .maybeSingle()

  // Get ALL active subscriptions for this user
  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")

  // Get ALL active enrollments with their program data
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select("*, programs(id, slug, name, tagline, audience, duration, color, badge)")
    .eq("user_id", user.id)
    .eq("status", "active")

  // Build journey data for each enrollment
  const journeys = (enrollments ?? []).map((enrollment) => {
    const program = enrollment.programs as {
      id: string
      slug: string
      name: string
      tagline: string
      audience: string
      duration: string
      color: string
      badge: string
    } | null

    const sub = subscriptions?.find(
      (s) => s.program_id === enrollment.program_id
    )

    const durationMatch = program?.duration?.match(/(\d+)/)
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

    return {
      enrollmentId: enrollment.id,
      programId: enrollment.program_id,
      programName: program?.name ?? "Unknown Program",
      programSlug: program?.slug ?? "",
      tagline: program?.tagline ?? "",
      audience: program?.audience ?? "",
      badgeColor: program?.color ?? "#00c892",
      signalAcronym: program?.badge ?? "",
      currentDay,
      totalDays,
      startDate: enrollment.started_at || sub?.current_period_start,
      endDate: sub?.current_period_end,
      progress: Math.round((currentDay / totalDays) * 100),
    }
  })

  // Get all programs for "Discover more" section
  const { data: allPrograms } = await supabase
    .from("programs")
    .select("id, name, slug, tagline, duration, color, badge, audience")
    .eq("is_active", true)
    .order("sort_order")

  const enrolledIds = new Set(journeys.map((j) => j.programId))
  const recommended = (allPrograms ?? []).filter((p) => !enrolledIds.has(p.id))

  return (
    <DashboardClient
      user={{
        id: user.id,
        email: user.email || "",
        firstName: profile?.first_name || user.user_metadata?.first_name || "",
        lastName: profile?.last_name || user.user_metadata?.last_name || "",
      }}
      journeys={journeys}
      recommended={recommended}
    />
  )
}
