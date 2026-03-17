import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Search,
  Users,
} from "lucide-react"
import type { Metadata } from "next"
import { ProgramSearch } from "./program-search"

export const metadata: Metadata = {
  title: "Programs",
  description:
    "Browse all Transformer Hub Institute leadership programs. Filter by category to find the right fit for your journey.",
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
      .from("programs")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    programs = programsData

    const { data: categoriesData } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order")

    categories = categoriesData

    const programIds = programs?.map((p) => p.id) ?? []

    const [{ data: featuresData }, { data: pricingData }] = await Promise.all([
      supabase
        .from("program_features")
        .select("*")
        .in("program_id", programIds)
        .order("sort_order"),
      supabase
        .from("program_pricing")
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
    <>
      {/* Page header */}
      <section className="border-b bg-wf-bg px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Programs
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Explore our full catalog of leadership development programs.
          </p>
        </div>
      </section>

      <ProgramSearch
        programs={programs ?? []}
        categories={categories ?? []}
        features={features ?? []}
        pricing={pricing ?? []}
        initialCategory={category}
        initialQuery={q}
      />
    </>
  )
}
