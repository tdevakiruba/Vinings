import { createClient } from "@/lib/supabase/server"
import { PlatformHeader } from "./platform-header"
import { PlatformFooter } from "./platform-footer"

export async function PlatformShell({
  children,
}: {
  children: React.ReactNode
}) {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data.user
  } catch {
    // Supabase not configured yet – render shell without auth
  }

  return (
    <>
      <PlatformHeader user={user ? { email: user.email } : null} />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <PlatformFooter />
    </>
  )
}
