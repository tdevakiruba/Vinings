import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { programSlug, planTier } = body

  if (!programSlug || !planTier) {
    return NextResponse.json(
      { error: "Missing programSlug or planTier" },
      { status: 400 }
    )
  }

  // Get program (include duration for dynamic subscription length)
  const { data: program, error: programError } = await supabase
    .from("VC_programs")
    .select("id, slug, title, duration")
    .eq("slug", programSlug)
    .single()

  if (programError || !program) {
    return NextResponse.json({ error: "Program not found" }, { status: 404 })
  }

  // Check if already enrolled
  const { data: existingEnrollment } = await supabase
    .from("VC_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .maybeSingle()

  if (existingEnrollment) {
    // Check if subscription exists
    const { data: existingSub } = await supabase
      .from("VC_subscriptions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("program_id", program.id)
      .eq("status", "active")
      .maybeSingle()

    if (existingSub) {
      return NextResponse.json({ message: "Already enrolled", enrollmentId: existingEnrollment.id })
    }
  }

  const now = new Date()
  const endDate = new Date(now)
  const durMatch = program.duration?.match(/(\d+)/)
  const durationDays = durMatch ? parseInt(durMatch[1], 10) : 21
  endDate.setDate(endDate.getDate() + durationDays)

  // Create subscription record
  const { error: subError } = await supabase.from("VC_subscriptions").insert({
    user_id: user.id,
    plan_type: planTier === "individual" ? "basic" : "pro",
    status: "active",
    current_period_start: now.toISOString(),
    current_period_end: endDate.toISOString(),
  })

  if (subError) {
    console.error("Subscription insert error:", subError)
    return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
  }

  // Create enrollment (or reactivate existing)
  if (existingEnrollment) {
    const { error: updateError } = await supabase
      .from("VC_enrollments")
      .update({
        status: "active",
        progress_percentage: 0,
        enrolled_at: now.toISOString(),
        completed_at: null,
        updated_at: now.toISOString(),
      })
      .eq("id", existingEnrollment.id)

    if (updateError) {
      console.error("Enrollment update error:", updateError)
      return NextResponse.json({ error: "Failed to update enrollment" }, { status: 500 })
    }

    return NextResponse.json({ message: "Enrollment reactivated", enrollmentId: existingEnrollment.id })
  }

  const { data: enrollment, error: enrollError } = await supabase
    .from("VC_enrollments")
    .insert({
      user_id: user.id,
      program_id: program.id,
      status: "active",
      progress_percentage: 0,
      enrolled_at: now.toISOString(),
    })
    .select("id")
    .single()

  if (enrollError) {
    console.error("Enrollment insert error:", enrollError)
    return NextResponse.json({ error: "Failed to create enrollment" }, { status: 500 })
  }

  // Create streak record
  await supabase.from("VC_user_streaks").upsert({
    user_id: user.id,
    current_streak: 0,
    longest_streak: 0,
    last_activity_date: now.toISOString().split("T")[0],
  }, { onConflict: "user_id" })

  return NextResponse.json({
    message: "Enrolled successfully",
    enrollmentId: enrollment.id,
    startDate: now.toISOString(),
    endDate: endDate.toISOString(),
  })
}
