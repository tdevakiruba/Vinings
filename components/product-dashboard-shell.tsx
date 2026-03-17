"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  ChevronLeft,
  Compass,
  GraduationCap,
  LayoutDashboard,
  FlaskConical,
  Menu,
  Award,
  X,
} from "lucide-react"
import { useState } from "react"

interface ProductDashboardShellProps {
  program: {
    slug: string
    name: string
    tagline: string | null
    badgeColor: string
    signalAcronym: string
  }
  enrollment: {
    id: string
    currentDay: number
    totalDays: number
    progress: number
    startDate: string | null
    endDate: string | null
    planTier: string
  }
  children: React.ReactNode
}

const programIcons: Record<string, string> = {
  "workforce-ready": "/images/workforce-icon.png",
}
const programLogos: Record<string, string> = {
  "workforce-ready": "/images/workforce-logo.png",
}

const sidebarTabs = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "frameworks", label: "Frameworks", icon: BookOpen },
  { id: "journey", label: "Journey", icon: Compass },
  { id: "lab", label: "Lab", icon: FlaskConical },
  { id: "certificates", label: "Certificates", icon: Award },
]

export function ProductDashboardShell({
  program,
  enrollment,
  children,
}: ProductDashboardShellProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const activeTab =
    sidebarTabs.find((tab) =>
      pathname.includes(`/dashboard/${program.slug}/${tab.id}`)
    )?.id ?? "overview"

  const iconSrc = programIcons[program.slug]
  const logoSrc = programLogos[program.slug]

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 border-r bg-card lg:block">
        <div className="sticky top-16 flex h-[calc(100vh-64px)] flex-col">
          {/* Program badge header */}
          <div className="border-b p-4">
            <Link
              href="/dashboard"
              className="mb-3 flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft className="size-3.5" />
              All Programs
            </Link>
            <div className="flex items-center gap-3">
              {iconSrc ? (
                <Image
                  src={iconSrc}
                  alt=""
                  width={40}
                  height={40}
                  className="shrink-0"
                />
              ) : (
                <div
                  className="flex size-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                  style={{ backgroundColor: program.badgeColor }}
                >
                  {program.signalAcronym.slice(0, 3)}
                </div>
              )}
              <div className="min-w-0">
                {logoSrc ? (
                  <Image
                    src={logoSrc}
                    alt={program.name}
                    width={140}
                    height={28}
                    className="h-auto"
                  />
                ) : (
                  <h2 className="truncate text-sm font-bold text-foreground">
                    {program.name}
                  </h2>
                )}
                {!logoSrc && program.tagline && (
                  <p className="truncate text-[11px] text-muted-foreground">
                    {program.tagline}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="border-b px-4 py-3">
            <div className="mb-1.5 flex items-center justify-between text-xs">
              <span className="font-medium text-muted-foreground">
                Day {enrollment.currentDay} of {enrollment.totalDays}
              </span>
              <span
                className="font-bold"
                style={{ color: program.badgeColor }}
              >
                {enrollment.progress}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${enrollment.progress}%`,
                  backgroundColor: program.badgeColor,
                }}
              />
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="flex-1 px-2 py-3">
            <ul className="flex flex-col gap-0.5">
              {sidebarTabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <li key={tab.id}>
                    <Link
                      href={`/dashboard/${program.slug}/${tab.id}`}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                        isActive
                          ? "text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                      }`}
                      style={
                        isActive
                          ? {
                              backgroundColor: `${program.badgeColor}15`,
                              color: program.badgeColor,
                            }
                          : undefined
                      }
                    >
                      <Icon
                        className="size-4"
                        style={isActive ? { color: program.badgeColor } : undefined}
                      />
                      {tab.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Enrollment info footer */}
          <div className="border-t px-4 py-3">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <Calendar className="size-3" />
              {enrollment.startDate && (
                <span>
                  Started{" "}
                  {new Date(enrollment.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
              <GraduationCap className="size-3" />
              <span className="capitalize">{enrollment.planTier} Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-16 z-40 flex items-center justify-between border-b bg-card px-4 py-2 lg:hidden">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-8 items-center justify-center rounded-lg border"
            aria-label="Toggle sidebar"
          >
            {mobileOpen ? (
              <X className="size-4 text-foreground" />
            ) : (
              <Menu className="size-4 text-foreground" />
            )}
          </button>
          {iconSrc ? (
            <Image src={iconSrc} alt="" width={28} height={28} className="shrink-0" />
          ) : (
            <div
              className="flex size-7 items-center justify-center rounded-lg text-[10px] font-bold text-white"
              style={{ backgroundColor: program.badgeColor }}
            >
              {program.signalAcronym.slice(0, 3)}
            </div>
          )}
          {logoSrc ? (
            <Image src={logoSrc} alt={program.name} width={120} height={24} className="h-auto max-w-[100px] xs:max-w-[120px]" />
          ) : (
            <span className="text-sm font-bold text-foreground truncate max-w-[120px] xs:max-w-[180px]">
              {program.name}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <span
            className="font-bold"
            style={{ color: program.badgeColor }}
          >
            {enrollment.progress}%
          </span>
        </div>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 top-[104px] z-30 bg-foreground/30 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 top-[104px] z-40 w-64 border-r bg-card lg:hidden overflow-y-auto">
            <nav className="px-2 py-3">
              <ul className="flex flex-col gap-0.5">
                {sidebarTabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  return (
                    <li key={tab.id}>
                      <Link
                        href={`/dashboard/${program.slug}/${tab.id}`}
                        onClick={() => setMobileOpen(false)}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                        }`}
                        style={
                          isActive
                            ? {
                                backgroundColor: `${program.badgeColor}15`,
                                color: program.badgeColor,
                              }
                            : undefined
                        }
                      >
                        <Icon className="size-4" />
                        {tab.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="border-t px-4 py-3 mt-2">
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="size-3.5" />
                Back to All Programs
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Main content area */}
      <main className="min-w-0 flex-1 pt-12 lg:pt-0">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  )
}
