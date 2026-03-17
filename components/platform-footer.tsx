import Link from "next/link"
import { TrendingUp } from "lucide-react"

const footerLinks = {
  Programs: [
    { href: "/programs?category=executive", label: "Executive Leadership" },
    { href: "/programs?category=workforce", label: "Workforce Ready" },
    { href: "/programs?category=faith", label: "Faith & Leadership" },
    { href: "/programs?category=youth", label: "Youth Leadership" },
    { href: "/programs?category=enterprise", label: "Enterprise" },
  ],
  Company: [
    { href: "/organizations", label: "Organizations" },
  ],
}

export function PlatformFooter() {
  return (
    <footer className="border-t bg-card px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-wf-mint">
                <TrendingUp className="size-4 text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold text-foreground">
                  Transformer Hub
                </span>
                <span className="text-[9px] font-semibold tracking-wider text-wf-mint uppercase">
                  Institute
                </span>
              </div>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
              Structured, research-backed leadership programs that turn ambition
              into professional excellence.
            </p>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="font-serif text-sm font-bold uppercase tracking-wider text-foreground">
                {heading}
              </h4>
              <ul className="mt-3 flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t pt-6 text-center">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Transformer Hub Institute. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
