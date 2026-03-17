import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProgramDetail } from "./program-detail"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  try {
    const { slug } = await params
    const supabase = await createClient()
    const { data: program } = await supabase
      .from("programs")
      .select("name, tagline")
      .eq("slug", slug)
      .maybeSingle()

    if (!program) return { title: "Program Not Found" }

    return {
      title: program.name,
      description: program.tagline,
    }
  } catch {
    return { title: "Program" }
  }
}

export default async function ProgramPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  let supabase: Awaited<ReturnType<typeof createClient>>
  try {
    supabase = await createClient()
  } catch {
    notFound()
    return // unreachable but satisfies TS
  }

  const { data: program } = await supabase
    .from("programs")
    .select("*")
    .eq("slug", slug)
    .maybeSingle()

  if (!program) notFound()

  const [
    { data: features },
    { data: phases },
    { data: pricing },
    {
      data: { user },
    },
  ] = await Promise.all([
    supabase
      .from("program_features")
      .select("*")
      .eq("program_id", program.id)
      .order("sort_order"),
    supabase
      .from("program_phases")
      .select("*")
      .eq("program_id", program.id)
      .order("sort_order"),
    supabase
      .from("program_pricing")
      .select("*")
      .eq("program_id", program.id)
      .order("sort_order"),
    supabase.auth.getUser(),
  ])

  // Check if user already has active subscription for this program
  let hasSubscription = false
  if (user) {
    const { data: sub } = await supabase
      .from("subscriptions")
      .select("id, status")
      .eq("user_id", user.id)
      .eq("program_id", program.id)
      .eq("status", "active")
      .limit(1)
      .maybeSingle()
    hasSubscription = !!sub
  }

  // Parse leaders if stored as JSON string
  let leaders: string[] = []
  if (program.leaders) {
    try {
      leaders =
        typeof program.leaders === "string"
          ? JSON.parse(program.leaders)
          : Array.isArray(program.leaders)
          ? program.leaders
          : []
    } catch {
      leaders = []
    }
  }

  // Fetch curriculum titles only (no full content - that's gated behind subscription)
  let curriculum: {
    day_number: number
    title: string
    key_theme: string | null
  }[] = []

  if (slug === "workforce-ready") {
    const { data: days } = await supabase
      .from("workforce_mindset_21day")
      .select("day_number, title, key_theme")
      .order("day_number")
    curriculum = days ?? []
  }

  return (
    <ProgramDetail
      program={{ ...program, leaders }}
      features={features ?? []}
      phases={phases ?? []}
      pricing={pricing ?? []}
      curriculum={curriculum}
      isLoggedIn={!!user}
      hasSubscription={hasSubscription}
    />
  )
}
