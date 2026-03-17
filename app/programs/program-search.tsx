"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Search,
  Users,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface Program {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  audience: string
  duration: string
  color: string
  badge: string
  category_id: string | null
  [key: string]: unknown
}

interface Category {
  id: string
  slug: string
  label: string
}

interface Feature {
  id: string
  program_id: string
  title: string
}

interface Pricing {
  id: string
  program_id: string
  price: number | null
  label: string
}

export function ProgramSearch({
  programs,
  categories,
  features,
  pricing,
  initialCategory,
  initialQuery,
}: {
  programs: Program[]
  categories: Category[]
  features: Feature[]
  pricing: Pricing[]
  initialCategory?: string
  initialQuery?: string
}) {
  const [query, setQuery] = useState(initialQuery ?? "")
  const [activeCategory, setActiveCategory] = useState(initialCategory ?? "all")
  const router = useRouter()

  const filtered = useMemo(() => {
    let result = programs

    if (activeCategory && activeCategory !== "all") {
      const cat = categories.find((c) => c.slug === activeCategory)
      if (cat) {
        result = result.filter((p) => p.category_id === cat.id)
      }
    }

    if (query.trim()) {
      const q = query.toLowerCase()
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.audience.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      )
    }

    return result
  }, [programs, categories, activeCategory, query])

  function handleCategoryClick(slug: string) {
    setActiveCategory(slug)
    const params = new URLSearchParams()
    if (slug !== "all") params.set("category", slug)
    if (query) params.set("q", query)
    router.replace(`/programs${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    })
  }

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Search + filters */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search programs..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                aria-label="Clear search"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Category pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryClick("all")}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
              activeCategory === "all"
                ? "bg-wf-mint text-white"
                : "border text-muted-foreground hover:bg-muted/50"
            }`}
          >
            All Programs
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryClick(cat.slug)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                activeCategory === cat.slug
                  ? "bg-wf-mint text-white"
                  : "border text-muted-foreground hover:bg-muted/50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results count */}
        <p className="mb-6 text-xs text-muted-foreground">
          {filtered.length} program{filtered.length !== 1 ? "s" : ""} found
        </p>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-lg font-medium text-foreground">
              No programs found
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((program) => {
              const pFeatures = features.filter(
                (f) => f.program_id === program.id
              )
              const pPricing = pricing.filter(
                (p) => p.program_id === program.id
              )
              const startingPrice = pPricing.find((p) => p.price)?.price

              return (
                <Link
                  key={program.id}
                  href={`/programs/${program.slug}`}
                  className="group flex flex-col rounded-2xl border bg-card p-6 transition-all hover:shadow-lg hover:border-wf-mint/30"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <span
                      className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white"
                      style={{
                        backgroundColor: program.color || "#00c892",
                      }}
                    >
                      {program.badge || program.name}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="size-3" />
                      {program.duration}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-card-foreground transition-colors group-hover:text-wf-mint">
                    {program.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-wf-mint">
                    {program.tagline}
                  </p>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground line-clamp-3">
                    {program.description}
                  </p>

                  <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Users className="size-3" />
                    {program.audience}
                  </div>

                  {pFeatures.length > 0 && (
                    <div className="mt-4 flex flex-col gap-1.5">
                      {pFeatures.slice(0, 3).map((feat) => (
                        <div
                          key={feat.id}
                          className="flex items-center gap-2 text-xs text-muted-foreground"
                        >
                          <CheckCircle2 className="size-3 shrink-0 text-wf-mint" />
                          {feat.title}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    {startingPrice ? (
                      <div>
                        <span className="text-xl font-bold text-foreground">
                          ${startingPrice}
                        </span>
                        <span className="ml-1 text-xs text-muted-foreground">
                          starting
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm font-medium text-muted-foreground">
                        Contact Us
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-sm font-semibold text-wf-mint transition-all group-hover:gap-2">
                      Details
                      <ChevronRight className="size-4" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
