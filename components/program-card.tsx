import Link from "next/link"
import { CheckCircle2, ChevronRight, Clock, Users } from "lucide-react"

interface ProgramCardProps {
  program: {
    id: string
    slug: string
    name: string
    tagline: string | null
    description: string | null
    audience: string | null
    color: string | null
    badge: string | null
    duration: string | null
  }
  features: { id: string; title: string }[]
  pricing: { id: string; price: string | null }[]
}

export function ProgramCard({ program, features, pricing }: ProgramCardProps) {
  const startingPrice = pricing.find((p) => p.price)?.price

  return (
    <Link
      href={`/programs/${program.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-[#00c892]/5 hover:border-[#00c892]/30"
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{ backgroundColor: program.color || "#00c892" }}
      />

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex items-center justify-between">
          <span
            className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white"
            style={{ backgroundColor: program.color || "#00c892" }}
          >
            {program.badge || program.name}
          </span>
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="size-3.5" />
            {program.duration}
          </span>
        </div>

        <h3 className="font-serif text-xl font-bold text-card-foreground transition-colors group-hover:text-[#00c892]">
          {program.name}
        </h3>
        {program.tagline && (
          <p className="mt-1 text-sm font-medium text-[#00c892]">
            {program.tagline}
          </p>
        )}
        <p className="mt-3 flex-1 text-base leading-relaxed text-muted-foreground line-clamp-3">
          {program.description}
        </p>

        {program.audience && (
          <div className="mt-3 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="size-3.5" />
            {program.audience}
          </div>
        )}

        {features.length > 0 && (
          <div className="mt-4 flex flex-col gap-2">
            {features.slice(0, 3).map((feat) => (
              <div
                key={feat.id}
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <CheckCircle2 className="size-3.5 shrink-0 text-[#00c892]" />
                {feat.title}
              </div>
            ))}
            {features.length > 3 && (
              <span className="text-xs text-muted-foreground">
                +{features.length - 3} more features
              </span>
            )}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between border-t pt-4">
          {startingPrice ? (
            <div>
              <span className="text-xl font-extrabold text-foreground">
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
          <span className="flex items-center gap-1 text-sm font-semibold text-[#00c892] transition-all group-hover:gap-2">
            Learn More
            <ChevronRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}
