import { Rocket, TrendingUp, Crown } from "lucide-react"

/**
 * Vinings brand palette — ink blue + mint green + ink dark.
 * Used consistently across overview, journey, and frameworks pages.
 *
 *  phase1  → ink blue    #1b3a6b  (deep navy — Phase 1 / Foundation)
 *  phase2  → mint green  #3ecf8e  (fresh mint — Phase 2 / Growth)
 *  phase3  → ink dark    #0f172a  (near-black — Phase 3 / Mastery)
 *  accent  → sky blue    #2563eb  (CTA highlights)
 *  streak  → amber       #f59e0b  (streak/fire)
 */
export const VC_BLUE = {
  phase1: "#1b3a6b",   // ink blue — deep navy
  phase2: "#3ecf8e",   // mint green — fresh accent
  phase3: "#0f172a",   // ink dark — near black
  accent:  "#2563eb",  // sky blue — CTA / action
  streak:  "#f59e0b",  // amber — streak only
  trophy:  "#1b3a6b",  // ink blue reuse
} as const

export const PROGRAM_PHASES = [
  {
    id: "foundation",
    label: "Foundation",
    dayStart: 1,
    dayEnd: 7,
    color: VC_BLUE.phase1,   // ink blue
    icon: Rocket,
    tagline: "Build your professional identity",
  },
  {
    id: "growth",
    label: "Growth Strategy",
    dayStart: 8,
    dayEnd: 14,
    color: VC_BLUE.phase2,   // mint green
    icon: TrendingUp,
    tagline: "Develop core leadership skills",
  },
  {
    id: "mastery",
    label: "Leadership Mastery",
    dayStart: 15,
    dayEnd: 21,
    color: VC_BLUE.phase3,   // ink dark
    icon: Crown,
    tagline: "Lead with influence and trust",
  },
]

export type ProgramPhase = (typeof PROGRAM_PHASES)[number]
