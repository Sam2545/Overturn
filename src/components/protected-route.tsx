"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.replace("/");
        return;
      }
    };

    check();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/");
    });

    return () => subscription.unsubscribe();
  }, [mounted, router, supabase.auth]);

  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FDFCF8]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#5D7052] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
