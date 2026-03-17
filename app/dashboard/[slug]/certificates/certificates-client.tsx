"use client"

import { Award, Lock, Download, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Certificate {
  id: string
  title: string
  description: string
  isEarned: boolean
  earnedDate: string | null
  phaseNumber: number
}

interface CertificatesClientProps {
  program: {
    slug: string
    name: string
    badgeColor: string
    signalAcronym: string
    totalDays: number
  }
  currentDay: number
  certificates: Certificate[]
  userName: string
}

export function CertificatesClient({
  program,
  currentDay,
  certificates,
  userName,
}: CertificatesClientProps) {
  const earnedCount = certificates.filter((c) => c.isEarned).length

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold text-foreground">
          Digital Certificates
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Earn certificates as you progress through {program.name}. Complete
          each phase to unlock its credential.
        </p>
      </div>

      {/* Progress summary */}
      <div className="mb-6 flex items-center gap-4 rounded-2xl border bg-card p-5">
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `${program.badgeColor}15` }}
        >
          <Award className="size-6" style={{ color: program.badgeColor }} />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-card-foreground">
            {earnedCount} of {certificates.length} Certificates Earned
          </h3>
          <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{
                width: `${(earnedCount / certificates.length) * 100}%`,
                backgroundColor: program.badgeColor,
              }}
            />
          </div>
        </div>
      </div>

      {/* Certificate cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className={`relative flex flex-col overflow-hidden rounded-2xl border transition-all ${
              cert.isEarned ? "bg-card shadow-sm" : "bg-muted/30 opacity-70"
            }`}
          >
            {/* Certificate visual */}
            <div
              className="relative flex items-center justify-center py-10"
              style={{
                backgroundColor: cert.isEarned
                  ? `${program.badgeColor}10`
                  : undefined,
              }}
            >
              {cert.isEarned ? (
                <div className="flex flex-col items-center">
                  <div
                    className="flex size-16 items-center justify-center rounded-2xl shadow-lg"
                    style={{ backgroundColor: program.badgeColor }}
                  >
                    <Award className="size-8 text-white" />
                  </div>
                  <div className="mt-3 flex items-center gap-1.5">
                    <CheckCircle2
                      className="size-3.5"
                      style={{ color: program.badgeColor }}
                    />
                    <span
                      className="text-[10px] font-bold"
                      style={{ color: program.badgeColor }}
                    >
                      EARNED
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex size-16 items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/50">
                    <Lock className="size-6 text-muted-foreground/40" />
                  </div>
                  <span className="mt-3 text-[10px] font-bold text-muted-foreground">
                    LOCKED
                  </span>
                </div>
              )}
            </div>

            {/* Certificate info */}
            <div className="flex flex-1 flex-col border-t p-4">
              <h3 className="text-sm font-bold text-card-foreground">
                {cert.title}
              </h3>
              <p className="mt-1 flex-1 text-xs leading-relaxed text-muted-foreground">
                {cert.description}
              </p>

              {cert.isEarned ? (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground">
                    Issued to {userName}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 rounded-lg text-xs"
                    onClick={() => {
                      // Future: generate PDF
                      alert("Certificate download will be available soon.")
                    }}
                  >
                    <Download className="mr-1 size-3" />
                    Download
                  </Button>
                </div>
              ) : (
                <p className="mt-3 text-[10px] text-muted-foreground">
                  Complete the phase to unlock this certificate
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
