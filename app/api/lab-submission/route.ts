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
  const { programId, category, title, description } = body

  if (!programId || !category || !title || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
  }

  const validCategories = [
    "career-challenge",
    "workplace-conflict",
    "leadership-dilemma",
    "professional-growth",
  ]
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 })
  }

  if (title.length > 200) {
    return NextResponse.json({ error: "Title too long (max 200)" }, { status: 400 })
  }

  if (description.length > 2000) {
    return NextResponse.json(
      { error: "Description too long (max 2000)" },
      { status: 400 }
    )
  }

  // Find the next upcoming office hours session for this program
  const { data: nextSession } = await supabase
    .from("office_hours")
    .select("id")
    .eq("program_id", programId)
    .eq("status", "scheduled")
    .gte("scheduled_at", new Date().toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  const { data: submission, error } = await supabase
    .from("lab_submissions")
    .insert({
      user_id: user.id,
      program_id: programId,
      office_hours_id: nextSession?.id ?? null,
      category,
      title,
      description,
    })
    .select("id, category, title, description, status, created_at")
    .single()

  if (error) {
    console.error("Lab submission error:", error)
    return NextResponse.json({ error: "Failed to submit" }, { status: 500 })
  }

  return NextResponse.json({ ok: true, submission })
}
