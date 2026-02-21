import { DashboardNav } from "@/components/dashboard-nav";
import { LiveCallTerminal } from "@/components/live-call-terminal";
import { ProtectedRoute } from "@/components/protected-route";

export default function DashboardLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#FDFCF8]">
        <DashboardNav />
        <main className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {children}
        </main>
        <LiveCallTerminal />
      </div>
    </ProtectedRoute>
  );
}
