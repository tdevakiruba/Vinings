import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { CertificatesClient } from "./certificates-client"

export default async function CertificatesPage({
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

  const durationMatch = program.duration?.match(/(\d+)/)
  const totalDays = durationMatch ? parseInt(durationMatch[1], 10) : 21
  let currentDay = 1
  if (enrollment.started_at) {
    const start = new Date(enrollment.started_at)
    const now = new Date()
    currentDay = Math.min(
      Math.max(
        Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1,
        1
      ),
      totalDays
    )
  }

  // Fetch phases for milestone certificates
  const { data: phases } = await supabase
    .from("program_phases")
    .select("phase_number, title, day_start, day_end")
    .eq("program_id", program.id)
    .order("sort_order")

  // Build certificates data
  const certificates = (phases ?? []).map((phase) => {
    const dayEnd = phase.day_end ?? totalDays
    const isEarned = currentDay > dayEnd
    return {
      id: `phase-${phase.phase_number}`,
      title: `${phase.title} Mastery`,
      description: `Completed Phase ${phase.phase_number}: ${phase.title} (Days ${phase.day_start ?? 1}-${dayEnd})`,
      isEarned,
      earnedDate: isEarned ? enrollment.started_at : null,
      phaseNumber: phase.phase_number,
    }
  })

  // Add program completion certificate
  const programComplete = currentDay >= totalDays
  certificates.push({
    id: "program-complete",
    title: `${program.name} -- Program Completion`,
    description: `Successfully completed the entire ${totalDays}-day ${program.name} program.`,
    isEarned: programComplete,
    earnedDate: programComplete ? enrollment.started_at : null,
    phaseNumber: (phases?.length ?? 0) + 1,
  })

  return (
    <CertificatesClient
      program={{
        slug: program.slug,
        name: program.name,
        badgeColor: program.color ?? "#00c892",
        signalAcronym: program.badge ?? "",
        totalDays,
      }}
      currentDay={currentDay}
      certificates={certificates}
      userName={
        user.user_metadata?.first_name
          ? `${user.user_metadata.first_name} ${user.user_metadata.last_name ?? ""}`.trim()
          : user.email?.split("@")[0] ?? "Participant"
      }
    />
  )
}
