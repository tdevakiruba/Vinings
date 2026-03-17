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
  const { enrollmentId, dayNumber, actionIndex, completed } = body

  if (!enrollmentId || dayNumber == null || actionIndex == null) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Upsert action progress
  const { error } = await supabase
    .from("user_actions")
    .upsert(
      {
        user_id: user.id,
        enrollment_id: enrollmentId,
        day_number: dayNumber,
        action_index: actionIndex,
        completed: !!completed,
        completed_at: completed ? new Date().toISOString() : null,
      },
      {
        onConflict: "enrollment_id,day_number,action_index",
      }
    )

  if (error) {
    console.error("Upsert action error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
