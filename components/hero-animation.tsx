"use client"

export function HeroAnimation() {
  return (
    <>
      {/* Radial gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,200,146,0.12),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(0,165,255,0.08),transparent)]" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      {/* Animated orbs */}
      <div className="absolute left-1/4 top-1/4 size-96 animate-pulse rounded-full bg-[#00c892]/5 blur-3xl" />
      <div className="absolute right-1/4 bottom-1/4 size-80 animate-pulse rounded-full bg-[#00a5ff]/5 blur-3xl [animation-delay:1s]" />

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0e14] to-transparent" />
    </>
  )
}
