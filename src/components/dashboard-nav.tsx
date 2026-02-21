"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Menu, FileText, LayoutGrid, X, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/intake", label: "Intake", icon: FileText },
  { href: "/dashboard/claims", label: "Claims", icon: LayoutGrid },
];

function getInitial(email: string | undefined): string {
  if (!email) return "?";
  const first = email[0];
  return first ? first.toUpperCase() : "?";
}

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user: u } } = await supabase.auth.getUser();
      setUser(u);
    };
    loadUser();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setProfileOpen(false);
    setMobileOpen(false);
    await supabase.auth.signOut();
    router.replace("/");
    router.refresh();
  }

  return (
    <>
      <header className="sticky top-4 z-50 mx-4 md:mx-8">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full border border-[#DED8CF]/50 bg-white/70 px-4 py-2 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.08)] backdrop-blur-md md:px-6",
            "max-w-7xl mx-auto"
          )}
          aria-label="Main navigation"
        >
          <Link href="/" className="flex items-center gap-2">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-[#5D7052] text-white"
              aria-hidden
            >
              <FileText className="h-5 w-5" strokeWidth={2} />
            </span>
            <span className="font-heading text-lg font-semibold text-[#2C2C24]">
              Overturn
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href}>
                <span
                  className={cn(
                    "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors",
                    pathname === href
                      ? "bg-[#5D7052]/10 text-[#5D7052]"
                      : "text-[#78786C] hover:bg-[#5D7052]/5 hover:text-[#2C2C24]"
                  )}
                >
                  <Icon className="h-4 w-4" strokeWidth={2} />
                  {label}
                </span>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2"
                aria-expanded={profileOpen}
                aria-haspopup="true"
                aria-label="Profile menu"
              >
                <span
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#5D7052] text-sm font-medium text-white"
                  aria-hidden
                >
                  {user ? getInitial(user.email) : "…"}
                </span>
              </button>

              {profileOpen && (
                <div
                  className="absolute right-0 top-full z-50 mt-2 min-w-[180px] rounded-2xl border border-[#DED8CF] bg-[#FEFEFA] py-1 shadow-[0_4px_20px_-2px_rgba(93,112,82,0.08)]"
                  role="menu"
                >
                  <Link
                    href="/dashboard"
                    role="menuitem"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-[#2C2C24] transition-colors hover:bg-[#5D7052]/10 hover:text-[#5D7052]"
                  >
                    <User className="h-4 w-4" strokeWidth={2} />
                    Account
                  </Link>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-[#2C2C24] transition-colors hover:bg-[#5D7052]/10 hover:text-[#5D7052]"
                  >
                    <LogOut className="h-4 w-4" strokeWidth={2} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-10 w-10 p-0"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </nav>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#2C2C24]/20 backdrop-blur-sm md:hidden"
          aria-hidden
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-full max-w-sm rounded-l-[2rem] border border-[#DED8CF]/50 bg-[#FEFEFA] p-6 shadow-2xl transition-transform duration-300 md:hidden",
          mobileOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex justify-between items-center mb-8">
          <span className="font-heading text-lg font-semibold text-[#2C2C24]">
            Menu
          </span>
          <Button
            variant="ghost"
            size="sm"
            className="h-10 w-10 p-0"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col gap-2" aria-label="Mobile navigation">
          {navItems.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-2xl px-4 py-3 text-[#2C2C24] font-medium transition-colors",
                pathname === href ? "bg-[#5D7052]/10 text-[#5D7052]" : "hover:bg-[#F0EBE5]"
              )}
            >
              <Icon className="h-5 w-5" strokeWidth={2} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-6 border-t border-[#DED8CF] pt-4">
          <div className="flex items-center gap-3 rounded-2xl px-4 py-3">
            <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-[#5D7052] text-sm font-medium text-white">
              {user ? getInitial(user.email) : "…"}
            </span>
            <span className="truncate text-sm text-[#78786C]">{user?.email ?? "Loading…"}</span>
          </div>
          <Link
            href="/dashboard"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 rounded-2xl px-4 py-3 text-[#2C2C24] font-medium transition-colors hover:bg-[#5D7052]/10 hover:text-[#5D7052]"
          >
            <User className="h-5 w-5" strokeWidth={2} />
            Account
          </Link>
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              handleSignOut();
            }}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-[#2C2C24] font-medium transition-colors hover:bg-[#5D7052]/10 hover:text-[#5D7052]"
          >
            <LogOut className="h-5 w-5" strokeWidth={2} />
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}
