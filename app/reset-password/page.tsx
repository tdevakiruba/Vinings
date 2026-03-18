"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    const code = searchParams.get("code")
    if (!code) {
      setError("Invalid reset link. Please request a new password reset.")
      setInitialized(true)
      return
    }

    // Exchange the code for a session
    const setupSession = async () => {
      const supabase = createClient()
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)

      if (sessionError) {
        setError(
          sessionError.message || "Invalid or expired reset link. Please request a new password reset."
        )
      }

      setInitialized(true)
    }

    setupSession()
  }, [searchParams])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)

    // Redirect to signin after 3 seconds
    setTimeout(() => {
      router.push("/signin")
    }, 3000)
  }

  if (!initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-wf-bg px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <Loader2 className="mx-auto size-8 animate-spin text-wf-mint" />
          <p className="mt-4 text-sm text-muted-foreground">
            Verifying your reset link...
          </p>
        </div>
      </div>
    )
  }

  if (error && !initialized) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-wf-bg px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold text-foreground">Link invalid or expired</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {error}
          </p>
          <Link href="/forgot-password">
            <Button className="mt-6 rounded-xl bg-wf-mint text-white hover:bg-wf-mint-light">
              Request new reset link
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-wf-bg px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-wf-mint/10">
            <CheckCircle2 className="size-8 text-wf-mint" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Password updated</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your password has been successfully reset. Redirecting you to sign in...
          </p>
          <Link href="/signin">
            <Button className="mt-6 rounded-xl bg-wf-mint text-white hover:bg-wf-mint-light">
              Sign In Now
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-wf-bg px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Create new password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password" className="text-sm font-medium text-card-foreground">
                  New Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="mt-1.5 rounded-lg"
                />
              </div>
              <div>
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-card-foreground">
                  Confirm Password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="mt-1.5 rounded-lg"
                />
              </div>
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-wf-mint py-5 font-semibold text-white hover:bg-wf-mint-light"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Update Password"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center bg-wf-bg px-4 py-16">
          <div className="w-full max-w-sm text-center">
            <Loader2 className="mx-auto size-8 animate-spin text-wf-mint" />
            <p className="mt-4 text-sm text-muted-foreground">
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
