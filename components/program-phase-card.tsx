"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Zap } from "lucide-react"

interface Phase {
  id: string
  label: string
  dayStart: number
  dayEnd: number
  color: string
  tagline: string
}

interface ProgramPhaseCardProps {
  phase: Phase
  isActive?: boolean
  isCompleted?: boolean
  progress?: number
  programSlug: string
}

export function ProgramPhaseCard({
  phase,
  isActive = false,
  isCompleted = false,
  progress = 0,
  programSlug,
}: ProgramPhaseCardProps) {
  const [expandedDays, setExpandedDays] = useState(false)
  const totalDays = phase.dayEnd - phase.dayStart + 1
  const daysArray = Array.from(
    { length: totalDays },
    (_, i) => phase.dayStart + i
  )

  return (
    <Link
      href={`/dashboard/${programSlug}/journey`}
      className={`group flex flex-col rounded-2xl border-2 transition-all hover:shadow-lg overflow-hidden ${
        isActive
          ? "shadow-md border-blue-300 bg-blue-50/50"
          : isCompleted
            ? "border-slate-200 bg-white opacity-75"
            : "border-slate-200 bg-white opacity-50"
      }`}
    >
      {/* Header: Label + Status */}
      <div className="flex items-center justify-between p-5">
        <div className="flex-1">
          <div className="flex items-center gap-2.5 mb-1">
            <h3 className="text-base font-bold text-slate-900">
              {phase.label}
            </h3>
            {isActive && (
              <span
                className="rounded-full px-2 py-0.5 text-xs font-bold text-white whitespace-nowrap"
                style={{ backgroundColor: phase.color }}
              >
                Current
              </span>
            )}
          </div>
          <p className="text-xs text-slate-600">{phase.tagline}</p>
        </div>

        {/* Progress Indicator */}
        {isActive && progress !== undefined && (
          <div className="text-right ml-4 shrink-0">
            <div
              className="text-sm font-bold"
              style={{ color: phase.color }}
            >
              {progress}%
            </div>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-slate-100" />

      {/* Day Selector - Compact Side Layout */}
      <div className="p-5">
        {/* Header Row */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
            Days {phase.dayStart}-{phase.dayEnd}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault()
              setExpandedDays(!expandedDays)
            }}
            className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
          >
            {expandedDays ? "Hide" : "Show"} Days
            <ChevronDown
              className={`size-3.5 transition-transform ${
                expandedDays ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Compact Day Grid - Only show when expanded */}
        {expandedDays ? (
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7">
            {daysArray.map((day) => (
              <div
                key={day}
                className="flex items-center justify-center rounded-lg py-2 text-xs font-semibold transition-colors"
                style={{
                  backgroundColor: `${phase.color}12`,
                  color: phase.color,
                  border: `1px solid ${phase.color}30`,
                }}
              >
                {day}
              </div>
            ))}
          </div>
        ) : (
          // Collapsed view - Show first few days as preview
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              {daysArray.slice(0, 3).map((day) => (
                <div
                  key={day}
                  className="flex items-center justify-center rounded-md w-7 h-7 text-xs font-semibold"
                  style={{
                    backgroundColor: `${phase.color}20`,
                    color: phase.color,
                  }}
                >
                  {day}
                </div>
              ))}
            </div>
            {totalDays > 3 && (
              <span className="text-xs font-medium text-slate-500">
                +{totalDays - 3}
              </span>
            )}
          </div>
        )}

        {/* Progress Bar - Only show if active/completed */}
        {(isActive || isCompleted) && (
          <div className="mt-3 pt-3 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${progress || 0}%`,
                    backgroundColor: phase.color,
                  }}
                />
              </div>
              <span className="text-xs font-semibold whitespace-nowrap" style={{ color: phase.color }}>
                {progress || 0}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CTA Footer */}
      <div className="px-5 pb-5 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {isCompleted ? "Completed" : "Learn more"}
        </span>
        <ChevronRight className="size-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
      </div>
    </Link>
  )
}
