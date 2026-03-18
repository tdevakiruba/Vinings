"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, CheckCircle2, Loader2, Mail } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)

    const supabase = createClient()
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (resetError) {
      setError(resetError.message)
      setLoading(false)
      return
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-16">
        <div className="w-full max-w-sm text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-blue-100">
            <Mail className="size-8 text-blue-900" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Check your email</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We sent a password reset link to <strong className="text-foreground">{email}</strong>
          </p>
          <p className="mt-4 text-xs text-muted-foreground">
            {"Didn't receive the email? Check your spam folder or "}
            <button
              onClick={() => setSuccess(false)}
              className="font-medium text-blue-900 hover:underline"
            >
              try again
            </button>
          </p>
          <Link href="/signin">
            <Button variant="outline" className="mt-6 rounded-xl">
              <ArrowLeft className="mr-2 size-4" />
              Back to Sign In
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Enter your email and we'll send you a reset link
          </p>
        </div>

        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <form onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-card-foreground">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 rounded-lg"
              />
            </div>

            {error && (
              <p className="mt-3 rounded-lg bg-destructive/10 px-3 py-2 text-xs text-destructive">
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-blue-900 py-5 font-semibold text-white hover:bg-blue-800"
            >
              {loading ? <Loader2 className="size-4 animate-spin" /> : "Send Reset Link"}
            </Button>
          </form>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Remember your password?{" "}
            <Link href="/signin" className="font-medium text-blue-900 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
