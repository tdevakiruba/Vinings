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
  const { programId, actionType, actionData } = body

  if (!programId || !actionType) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 })
  }

  // Insert action progress
  const { error } = await supabase
    .from("vc_user_actions")
    .insert({
      user_id: user.id,
      program_id: programId,
      action_type: actionType,
      action_data: actionData ?? {},
    })

  if (error) {
    console.error("Upsert action error:", error)
    return NextResponse.json({ error: "Failed to save" }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
