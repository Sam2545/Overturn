"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { Claim, ClaimStatus } from "@/types/database";
import { claimRowToClaim } from "@/types/database";

const COLUMNS = [
  { id: "drafted", label: "Submitted Claims", color: "bg-[#E6DCCD]/50 border-[#C18C5D]/30" },
  {
    id: "agent_calling",
    label: "Voice AI",
    description: "We're calling the insurance company to get the claim overturned.",
    color: "bg-[#5D7052]/10 border-[#5D7052]/30",
  },
  { id: "in_review", label: "In review", color: "bg-[#F0EBE5] border-[#DED8CF]" },
  { id: "overturned", label: "Result", color: "bg-emerald-50 border-emerald-200", resultStyle: "success" as const },
] as const;

const STATUS_IDS = COLUMNS.map((c) => c.id);

export default function ClaimsPage() {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClaims() {
      setLoading(true);
      const supabase = createClient();
      const { data, error } = await supabase
        .from("claims")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to fetch claims:", error);
        setClaims([]);
      } else {
        setClaims((data ?? []).map(claimRowToClaim));
      }
      setLoading(false);
    }

    fetchClaims();
  }, []);

  const moveClaim = async (claimId: string, newStatus: ClaimStatus) => {
    if (!STATUS_IDS.includes(newStatus)) return;
    setUpdatingId(claimId);
    const supabase = createClient();
    const { error } = await supabase
      .from("claims")
      .update({ status: newStatus })
      .eq("id", claimId);

    if (error) {
      console.error("Failed to update claim:", error);
    } else {
      setClaims((prev) =>
        prev.map((c) => (c.id === claimId ? { ...c, status: newStatus } : c))
      );
    }
    setUpdatingId(null);
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, columnId: ClaimStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (id) moveClaim(id, columnId);
    setDraggedId(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#2C2C24] md:text-5xl">
          Claims
        </h1>
        <p className="mt-2 text-[#78786C]">
          Move claims through Submitted Claims → Voice AI → In Review → Result.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-2xl border-2 border-dashed border-[#DED8CF] bg-[#F0EBE5]/30">
          <Loader2 className="h-10 w-10 animate-spin text-[#5D7052]" strokeWidth={2} />
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {COLUMNS.map((col) => {
            const columnClaims = claims.filter((c) => c.status === col.id);
            return (
              <div
                key={col.id}
                className={cn(
                  "min-h-[320px] rounded-2xl border-2 border-dashed p-4 transition-colors",
                  col.color
                )}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                <div className="mb-4">
                  <h2
                    className={cn(
                      "font-heading text-lg font-semibold",
                      col.resultStyle === "success" && "text-emerald-700",
                      col.resultStyle === "rejected" && "text-red-700"
                    )}
                  >
                    {col.label}
                  </h2>
                  {"description" in col && col.description && (
                    <p className="mt-1 text-sm text-[#78786C]">{col.description}</p>
                  )}
                </div>
                <div className="space-y-3">
                  {columnClaims.map((claim) => (
                    <Card
                      key={claim.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, claim.id)}
                      className={cn(
                        "cursor-grab active:cursor-grabbing transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(93,112,82,0.12)]",
                        draggedId === claim.id && "opacity-50",
                        updatingId === claim.id && "opacity-70"
                      )}
                    >
                      <CardHeader className="p-4 pb-0">
                        <CardTitle className="flex items-center justify-between text-sm">
                          <span className="truncate">{claim.patientName}</span>
                          {claim.status === "agent_calling" && (
                            <Phone className="h-4 w-4 shrink-0 text-[#5D7052]" strokeWidth={2} />
                          )}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-2">
                        <p className="text-xs text-[#78786C]">{claim.insurer}</p>
                        <p className="text-xs text-[#78786C]">{claim.denialDate}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
