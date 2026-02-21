"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.replace("/dashboard");
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.toLowerCase().includes("fetch") || message.toLowerCase().includes("network")) {
        setError(
          "Could not reach the server. If this is your live site, add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel → Project → Settings → Environment Variables, then redeploy."
        );
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }

  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCF8] px-4">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-semibold tracking-tight text-[#2C2C24]">
            Sign in
          </h1>
          <p className="mt-2 text-sm text-[#78786C]">
            Enter your email and password to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="login-email"
              className="mb-1.5 block text-sm font-medium text-[#2C2C24]"
            >
              Email
            </label>
            <Input
              id="login-email"
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
              htmlFor="login-password"
              className="mb-1.5 block text-sm font-medium text-[#2C2C24]"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
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
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <p className="text-center text-sm text-[#78786C]">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-medium text-[#5D7052] underline underline-offset-2 hover:no-underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
