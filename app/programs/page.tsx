import { createClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import { ProgramSearch } from "./program-search"

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Browse our professional development programs designed to accelerate your career growth.",
}

export default async function ProgramsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>
}) {
  const { category, q } = await searchParams

  let programs: any[] | null = null
  let categories: any[] | null = null
  let features: any[] | null = null
  let pricing: any[] | null = null

  try {
    const supabase = await createClient()

    const { data: programsData } = await supabase
      .from("vc_programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    programs = programsData

    const { data: categoriesData } = await supabase
      .from("vc_categories")
      .select("*")
      .order("sort_order")

    categories = categoriesData

    const programIds = programs?.map((p) => p.id) ?? []

    const [{ data: featuresData }, { data: pricingData }] = await Promise.all([
      supabase
        .from("vc_program_features")
        .select("*")
        .in("program_id", programIds)
        .order("sort_order"),
      supabase
        .from("vc_program_pricing")
        .select("*")
        .in("program_id", programIds)
        .order("sort_order"),
    ])

    features = featuresData
    pricing = pricingData
  } catch {
    // Supabase not configured – render with empty data
  }

  // Client-side filtering is handled in ProgramSearch component
  return (
    <ProgramSearch
      programs={programs ?? []}
      categories={categories ?? []}
      features={features ?? []}
      pricing={pricing ?? []}
      initialCategory={category}
      initialQuery={q}
    />
  )
}
