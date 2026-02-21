"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function IntakePage() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [extracted, setExtracted] = useState({
    patientName: "",
    memberId: "",
    denialDate: "",
    insurer: "",
    denialReason: "",
  });
  const [letter, setLetter] = useState("");
  const appealLetterPlaceholder =
    "Dear Appeals Department,\n\nWe are writing to formally appeal the denial of coverage for [Patient Name], Member ID [Member ID], for the service date [Date]. We believe this denial was made in error for the following reasons…\n\n[Generated appeal letter content would appear here after PDF processing.]";
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApproveAndAdd = async () => {
    setError(null);
    setApproving(true);
    const supabase = createClient();

    const { error: insertError } = await supabase.from("claims").insert({
      status: "drafted",
      patient_name: extracted.patientName || null,
      denial_date: extracted.denialDate || null,
      insurer: extracted.insurer || null,
      extracted_data: {
        memberId: extracted.memberId,
        denialReason: extracted.denialReason,
      },
      appeal_letter: letter || null,
      pdf_url: null,
    });

    setApproving(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    router.push("/dashboard/claims");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#2C2C24] md:text-5xl">
          Intake
        </h1>
        <p className="mt-2 text-[#78786C]">
          Upload a denial PDF. Left: highlighted document. Right: extracted data and appeal letter.
        </p>
      </div>

      {/* Split screen */}
      <div className="grid min-h-[70vh] gap-6 lg:grid-cols-2">
        {/* Left: PDF / upload */}
        <Card className="overflow-hidden rounded-tl-[4rem] rounded-[2rem]">
          <CardHeader className="border-b border-[#DED8CF]/50">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#5D7052]" strokeWidth={2} />
              Document
            </CardTitle>
          </CardHeader>
          <CardContent className="flex min-h-[400px] flex-col items-center justify-center p-8">
            {!file ? (
              <label className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-[#DED8CF] bg-[#F0EBE5]/30 p-12 transition-colors hover:border-[#5D7052]/50 hover:bg-[#5D7052]/5">
                <input
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
                />
                <Upload className="h-12 w-12 text-[#5D7052]" strokeWidth={2} />
                <span className="text-center text-sm font-medium text-[#2C2C24]">
                  Drop denial PDF here or click to upload
                </span>
              </label>
            ) : (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between rounded-2xl bg-[#5D7052]/10 px-4 py-3">
                  <span className="truncate text-sm font-medium text-[#2C2C24]">{file.name}</span>
                  <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                    Clear
                  </Button>
                </div>
                <div className="rounded-2xl border border-[#DED8CF]/50 bg-[#FEFEFA] p-8 text-center text-[#78786C]">
                  PDF viewer / highlighted denial would render here (e.g. via react-pdf or iframe).
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right: Extracted data + letter */}
        <div className="flex flex-col gap-6">
          <Card className="rounded-tr-[4rem] rounded-[2rem]">
            <CardHeader>
              <CardTitle>Extracted data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#78786C]">Patient name</label>
                <Input
                  value={extracted.patientName}
                  onChange={(e) => setExtracted((p) => ({ ...p, patientName: e.target.value }))}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#78786C]">Member ID</label>
                <Input
                  value={extracted.memberId}
                  onChange={(e) => setExtracted((p) => ({ ...p, memberId: e.target.value }))}
                  placeholder="MEM-8821"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#78786C]">Denial date</label>
                <Input
                  type="date"
                  value={extracted.denialDate}
                  onChange={(e) => setExtracted((p) => ({ ...p, denialDate: e.target.value }))}
                  placeholder="01/15/2025"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#78786C]">Insurer</label>
                <Input
                  value={extracted.insurer}
                  onChange={(e) => setExtracted((p) => ({ ...p, insurer: e.target.value }))}
                  placeholder="Acme Health"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#78786C]">Denial reason</label>
                <Input
                  value={extracted.denialReason}
                  onChange={(e) => setExtracted((p) => ({ ...p, denialReason: e.target.value }))}
                  placeholder="Medical necessity"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem]">
            <CardHeader>
              <CardTitle>Appeal letter</CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                className="h-48 w-full resize-y rounded-2xl border border-[#DED8CF] bg-white/50 px-4 py-3 text-sm text-[#2C2C24] placeholder:text-[#78786C] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5D7052]/30 focus-visible:ring-offset-2"
                value={letter}
                onChange={(e) => setLetter(e.target.value)}
                placeholder={appealLetterPlaceholder}
              />
              {error && (
                <p className="mt-2 text-sm text-[#A85448]">{error}</p>
              )}
              <div className="mt-4 flex gap-2">
                <Button disabled>Generate letter</Button>
                <Button
                  variant="outline"
                  onClick={handleApproveAndAdd}
                  disabled={approving}
                >
                  {approving ? "Adding…" : "Approve & add to board"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
