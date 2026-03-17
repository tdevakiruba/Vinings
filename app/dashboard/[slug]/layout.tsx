import { createClient } from "@/lib/supabase/server"
import { notFound, redirect } from "next/navigation"
import { ProductDashboardShell } from "@/components/product-dashboard-shell"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: program } = await supabase
    .from("VC_programs")
    .select("title")
    .eq("slug", slug)
    .maybeSingle()

  return {
    title: program ? `${program.title} | Dashboard` : "Dashboard",
  }
}

export default async function ProductDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/signin?redirect=/dashboard/" + slug)

  // Fetch program
  const { data: program } = await supabase
    .from("VC_programs")
    .select("id, slug, title, tagline, duration")
    .eq("slug", slug)
    .maybeSingle()

  if (!program) notFound()

  // Verify active enrollment
  const { data: enrollment } = await supabase
    .from("VC_enrollments")
    .select("id, status, progress_percentage, enrolled_at")
    .eq("user_id", user.id)
    .eq("program_id", program.id)
    .eq("status", "active")
    .maybeSingle()

  if (!enrollment) {
    redirect(`/programs/${slug}`)
  }

  // Get subscription info
  const { data: subscription } = await supabase
    .from("VC_subscriptions")
    .select("plan_type, current_period_start, current_period_end")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  // Calculate current day
  // Parse duration like "21 days" or just use 21 as default
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

  const progress = Math.round((currentDay / totalDays) * 100)

  return (
    <ProductDashboardShell
      program={{
        slug: program.slug,
        name: program.title,
        tagline: program.tagline,
        badgeColor: "#00c892",
        signalAcronym: "",
      }}
      enrollment={{
        id: enrollment.id,
        currentDay,
        totalDays,
        progress,
        startDate: enrollment.enrolled_at,
        endDate: subscription?.current_period_end ?? null,
        planTier: subscription?.plan_type ?? "free",
      }}
    >
      {children}
    </ProductDashboardShell>
  )
}
