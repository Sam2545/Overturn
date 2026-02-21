"use client";

import { useState, useEffect } from "react";
import { Minimize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

type TranscriptEntry = { id: string; role: string; content: string; created_at: string };

export function LiveCallTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(true);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [isLive, setIsLive] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")) {
      return;
    }
    const channel = supabase
      .channel("call_transcripts")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "call_transcripts" },
        (payload) => {
          const row = payload.new as { id: string; role: string; content: string; created_at: string };
          setTranscript((prev) => [...prev, row]);
          setIsLive(true);
          if (!isOpen) setIsOpen(true);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const toggleMinimized = () => {
    setIsMinimized((m) => !m);
    if (!isMinimized) setIsOpen(true);
  };

  return (
    <>
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-[#DED8CF]/50 bg-[#FEFEFA] px-4 py-2.5 font-mono text-xs font-medium uppercase tracking-wider text-[#2C2C24] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] transition-all hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-4px_rgba(93,112,82,0.2)]"
          aria-label="Open live call terminal"
        >
          <span className="h-2 w-2 rounded-full bg-[#78786C]" aria-hidden />
          Live call terminal
        </button>
      )}

      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-40 w-full max-w-lg overflow-hidden rounded-2xl border border-[#DED8CF]/50 bg-[#2C2C24] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.25)] transition-all duration-300"
          role="region"
          aria-label="Live call transcript"
        >
          <div className="flex items-center justify-between border-b border-[#78786C]/30 bg-[#2C2C24] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#A85448] animate-pulse" aria-hidden />
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-[#E6DCCD]">
                Live call
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#E6DCCD] hover:bg-white/10 hover:text-white"
                onClick={toggleMinimized}
                aria-label={isMinimized ? "Expand terminal" : "Minimize terminal"}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-[#E6DCCD] hover:bg-white/10 hover:text-white"
                onClick={() => setIsOpen(false)}
                aria-label="Close terminal"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="max-h-80 overflow-y-auto p-4 font-mono text-sm">
              <div className="space-y-2">
                {transcript.length === 0 && (
                  <p className="text-[#78786C]">Waiting for call transcript…</p>
                )}
                {transcript.map((entry) => (
                  <div key={entry.id} className="flex gap-2">
                    <span
                      className={entry.role === "agent" ? "text-[#5D7052]" : entry.role === "rep" ? "text-[#C18C5D]" : "text-[#78786C]"}
                    >
                      [{entry.role}]
                    </span>
                    <span className="text-[#E6DCCD]">{entry.content}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
