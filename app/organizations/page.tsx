import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  BarChart3,
  Shield,
  Users,
  Headphones,
  Award,
  Layers,
} from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "For Organizations",
  description:
    "Cohort-based leadership development for teams and enterprises.",
}

const benefits = [
  {
    icon: Users,
    title: "Cohort Management",
    desc: "Run programs for groups of 10 to 10,000. Track enrollment, progress, and completion across your entire organization.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Real-time engagement and completion metrics. Identify top performers and those who need support.",
  },
  {
    icon: Shield,
    title: "Custom Onboarding",
    desc: "White-label the program with your brand, add custom welcome content, and configure the experience for your culture.",
  },
  {
    icon: Headphones,
    title: "Dedicated Support",
    desc: "A named success manager, priority support, and quarterly review sessions to measure ROI.",
  },
  {
    icon: Layers,
    title: "Multi-Program Access",
    desc: "Bundle multiple programs (Workforce Ready, SIGNAL 90-Day, Youth Leadership) at volume pricing.",
  },
  {
    icon: Award,
    title: "Verified Credentials",
    desc: "Every participant earns a shareable digital credential upon completion, verifiable by employers.",
  },
]

const steps = [
  {
    step: "01",
    title: "Discovery Call",
    desc: "Tell us about your team, goals, and timeline. We will recommend the right program and configuration.",
  },
  {
    step: "02",
    title: "Custom Setup",
    desc: "We configure your cohort with custom onboarding, branding, and schedule based on your needs.",
  },
  {
    step: "03",
    title: "Launch & Track",
    desc: "Participants start their journeys. You get real-time dashboards showing engagement and progress.",
  },
  {
    step: "04",
    title: "Measure ROI",
    desc: "Completion reports, credential distribution, and a QBR meeting to discuss outcomes and next steps.",
  },
]

export default function OrganizationsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b bg-wf-dark px-4 py-20 sm:px-6 lg:px-8">
        <Image
          src="/images/p1.jpg"
          alt=""
          fill
          className="object-cover opacity-10"
        />
        <div className="relative mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
            <Building2 className="size-3.5" />
            For Organizations & Teams
          </div>
          <h1 className="text-balance text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            Develop Leaders{" "}
            <span className="text-wf-mint">At Scale</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
            Cohort-based leadership programs with analytics, custom
            onboarding, and verified credentials for your entire
            organization.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-xl bg-wf-mint px-8 text-white hover:bg-wf-mint-light"
            >
              <Link href="mailto:hello@transformerhub.io?subject=Enterprise%20Inquiry">
                Request a Demo
                <ArrowRight className="ml-2 size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="lg"
              asChild
              className="rounded-xl border-white/30 text-white hover:bg-white/10"
            >
              <Link href="/programs">View Programs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Why Teams Choose Us
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Everything you need to run leadership development programs
              at scale.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="rounded-xl border bg-card p-6 transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-wf-mint/10">
                  <b.icon className="size-5 text-wf-mint" />
                </div>
                <h3 className="text-sm font-bold text-card-foreground">
                  {b.title}
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="border-t bg-wf-bg px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {steps.map((s) => (
              <div
                key={s.step}
                className="flex gap-4 rounded-xl border bg-card p-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-wf-mint text-sm font-bold text-white">
                  {s.step}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-card-foreground">
                    {s.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Ready to develop your team?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Get started with a free consultation. We will help you choose
            the right programs and configure them for your organization.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 rounded-xl bg-wf-mint px-10 text-white hover:bg-wf-mint-light"
          >
            <Link href="mailto:hello@transformerhub.io?subject=Enterprise%20Inquiry">
              Contact Sales
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
