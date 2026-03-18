"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Search,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface Program {
  id: string
  title: string
  slug: string
  tagline: string
  description: string | null
  duration: string | null
  category_id: string | null
  image_url: string | null
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
  feature: string
}

interface Pricing {
  id: string
  program_id: string
  price_cents: number | null
  tier_name: string
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
          p.title.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          (p.description?.toLowerCase() || "").includes(q)
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

  const featuredCategory = categories.find((c) => c.slug === activeCategory) || categories[0]

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="border-b px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {activeCategory && activeCategory !== "all" && featuredCategory && (
            <p className="mb-3 text-sm font-semibold tracking-wide text-teal-600 uppercase">
              {featuredCategory.label}
            </p>
          )}
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-slate-900">
                {activeCategory === "all" ? "All Programs" : "Career Advancement"}
              </h1>
              <p className="mt-2 text-lg text-slate-600">
                {activeCategory === "all"
                  ? "Choose your path to professional excellence"
                  : "Build your competitive advantage"}
              </p>
            </div>
            <Link href="/programs">
              <Button variant="outline" className="whitespace-nowrap">
                View All Programs
                <ChevronRight className="ml-2 size-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {/* Search Box */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
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
                  <X className="size-4 text-slate-400" />
                </button>
              )}
            </div>
          </div>

          {/* Category Pills */}
          <div className="mb-8 flex flex-wrap gap-2">
            <button
              onClick={() => handleCategoryClick("all")}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                activeCategory === "all"
                  ? "bg-teal-600 text-white shadow-lg"
                  : "border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
              }`}
            >
              All Programs
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat.slug)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  activeCategory === cat.slug
                    ? "bg-teal-600 text-white shadow-lg"
                    : "border border-slate-200 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <p className="mb-8 text-sm text-slate-600">
            {filtered.length} program{filtered.length !== 1 ? "s" : ""} available
          </p>

          {/* Programs Grid */}
          {filtered.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-lg font-semibold text-slate-900">
                No programs found
              </p>
              <p className="mt-2 text-slate-600">
                Try adjusting your search or explore other categories.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((program) => {
                const pFeatures = features
                  .filter((f) => f.program_id === program.id)
                  .slice(0, 3)
                const pPricing = pricing.filter(
                  (p) => p.program_id === program.id
                )
                const basePrice = pPricing.find(p => p.price_cents)

                return (
                  <Link
                    key={program.id}
                    href={`/programs/${program.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all hover:border-teal-300 hover:shadow-xl"
                  >
                    {/* Top Accent Border */}
                    <div className="h-1 bg-gradient-to-r from-teal-500 to-teal-400" />

                    <div className="flex flex-col p-6">
                      {/* Header: Badge + Duration */}
                      <div className="mb-4 flex items-center justify-between">
                        <span className="inline-block rounded-full bg-teal-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                          {program.title.split(" ")[0]}-Badge
                        </span>
                        {program.duration && (
                          <span className="flex items-center gap-1.5 text-xs font-medium text-slate-600">
                            <Clock className="size-3.5" />
                            {program.duration}
                          </span>
                        )}
                      </div>

                      {/* Title + Tagline */}
                      <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-teal-600">
                        {program.title}
                      </h3>
                      {program.tagline && (
                        <p className="mt-1 text-sm font-medium text-teal-600">
                          {program.tagline}
                        </p>
                      )}

                      {/* Description */}
                      {program.description && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-2">
                          {program.description}
                        </p>
                      )}

                      {/* Features List */}
                      {pFeatures.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {pFeatures.map((feat) => (
                            <div
                              key={feat.id}
                              className="flex items-start gap-2.5 text-sm text-slate-700"
                            >
                              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-teal-500" />
                              <span>{feat.feature}</span>
                            </div>
                          ))}
                          {features.filter((f) => f.program_id === program.id)
                            .length > 3 && (
                            <p className="text-xs font-medium text-slate-500 mt-1">
                              +
                              {
                                features.filter(
                                  (f) => f.program_id === program.id
                                ).length - 3
                              }{" "}
                              more features
                            </p>
                          )}
                        </div>
                      )}

                      {/* Footer: CTA */}
                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                        <span className="text-sm font-medium text-slate-600">
                          Learn More
                        </span>
                        <ChevronRight className="size-5 text-teal-600 transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
