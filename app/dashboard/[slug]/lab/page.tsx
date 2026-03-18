import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LabClient } from "./lab-client"

export default async function LabPage({
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
    .select("id, slug, title")
    .eq("slug", slug)
    .single()

  if (!program) redirect("/dashboard")

  const { data: enrollment } = await supabase
    .from("vc_enrollments")
    .select("id")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .maybeSingle()

  if (!enrollment) redirect(`/programs/${slug}`)

  // Fetch next upcoming office hours for this program
  const { data: nextOfficeHours } = await supabase
    .from("vc_office_hours")
    .select("id, title, description, meeting_url, scheduled_at, duration_minutes, is_active")
    .eq("is_active", true)
    .gte("scheduled_at", new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString())
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle()

  // Fetch user's submissions
  const { data: submissions } = await supabase
    .from("vc_lab_submissions")
    .select("id, lab_name, submission_text, status, submitted_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .order("submitted_at", { ascending: false })

  return (
    <LabClient
      program={{
        id: program.id,
        slug: program.slug,
        name: program.title,
        badgeColor: "#00c892",
      }}
      nextOfficeHours={nextOfficeHours ?? null}
      initialSubmissions={submissions ?? []}
    />
  )
}
