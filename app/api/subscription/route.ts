import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Get active subscription with program info
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("*, programs(id, slug, name, duration)")
    .eq("user_id", user.id)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (!subscription) {
    return NextResponse.json({ hasSubscription: false })
  }

  // Get enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", user.id)
    .eq("program_id", subscription.program_id)
    .eq("status", "active")
    .maybeSingle()

  // Calculate current day based on start date
  let currentDay = 1
  let totalDays = 21
  let startDate = subscription.current_period_start
  let endDate = subscription.current_period_end

  if (enrollment?.started_at) {
    startDate = enrollment.started_at
    const start = new Date(enrollment.started_at)
    const now = new Date()
    const diffTime = now.getTime() - start.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    currentDay = Math.min(Math.max(diffDays + 1, 1), totalDays)
  }

  // Check if subscription period has ended
  if (endDate) {
    const end = new Date(endDate)
    if (new Date() > end) {
      return NextResponse.json({
        hasSubscription: true,
        expired: true,
        subscription,
        enrollment,
        currentDay: totalDays,
        totalDays,
        startDate,
        endDate,
      })
    }
  }

  return NextResponse.json({
    hasSubscription: true,
    expired: false,
    subscription,
    enrollment,
    currentDay,
    totalDays,
    startDate,
    endDate,
  })
}
