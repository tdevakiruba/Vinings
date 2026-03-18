import { Rocket, TrendingUp, Crown } from "lucide-react"

/**
 * Vinings ink-blue color palette used consistently across
 * overview, journey, and frameworks pages.
 */
export const VC_BLUE = {
  phase1: "#1e3a8a",   // ink blue (deep navy)
  phase2: "#2563eb",   // mid blue
  phase3: "#0f172a",   // ink dark
  accent:  "#1d4ed8",  // action blue
  streak:  "#f59e0b",  // amber — streak only
  trophy:  "#1e3a8a",  // ink blue reuse
} as const

export const PROGRAM_PHASES = [
  {
    id: "foundation",
    label: "Foundation",
    dayStart: 1,
    dayEnd: 7,
    color: VC_BLUE.phase1,
    icon: Rocket,
    tagline: "Build your professional identity",
  },
  {
    id: "growth",
    label: "Growth Strategy",
    dayStart: 8,
    dayEnd: 14,
    color: VC_BLUE.phase2,
    icon: TrendingUp,
    tagline: "Develop core leadership skills",
  },
  {
    id: "mastery",
    label: "Leadership Mastery",
    dayStart: 15,
    dayEnd: 21,
    color: VC_BLUE.phase3,
    icon: Crown,
    tagline: "Lead with influence and trust",
  },
]

export type ProgramPhase = (typeof PROGRAM_PHASES)[number]
