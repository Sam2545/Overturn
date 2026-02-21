"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCF8] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#2C2C24]">
            Create an account
          </h1>
          <p className="mt-2 text-sm text-[#78786C]">
            Enter your email and choose a password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="signup-email"
              className="mb-1.5 block text-sm font-medium text-[#2C2C24]"
            >
              Email
            </label>
            <Input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="rounded-full"
            />
          </div>
          <div>
            <label
              htmlFor="signup-password"
              className="mb-1.5 block text-sm font-medium text-[#2C2C24]"
            >
              Password
            </label>
            <Input
              id="signup-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              className="rounded-full"
            />
          </div>
          <div>
            <label
              htmlFor="signup-confirm-password"
              className="mb-1.5 block text-sm font-medium text-[#2C2C24]"
            >
              Confirm password
            </label>
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              autoComplete="new-password"
              minLength={6}
              className="rounded-full"
            />
          </div>

          {error && (
            <p className="text-sm text-[#a85448]" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="default"
            className="w-full rounded-full hover:scale-105"
            disabled={loading}
          >
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#78786C]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-[#5D7052] underline underline-offset-2 hover:no-underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
