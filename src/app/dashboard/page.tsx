import Link from "next/link";
import { FileText, LayoutGrid, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <section>
        <h1 className="font-heading text-4xl font-semibold tracking-tight text-[#2C2C24] md:text-5xl">
          Command center
        </h1>
        <p className="mt-2 max-w-2xl text-[#78786C]">
          Upload denials, manage appeals, and watch live calls—all in one place.
        </p>
      </section>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/intake">
          <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(93,112,82,0.15)]">
            <CardHeader>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5D7052]/10 text-[#5D7052] transition-colors group-hover:bg-[#5D7052] group-hover:text-white">
                <FileText className="h-7 w-7" strokeWidth={2} />
              </span>
              <CardTitle>Intake</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#78786C]">
                Three-step wizard: upload denial PDF, review extracted text, then edit and approve the appeal letter.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#5D7052] group-hover:underline">
                Open intake <ArrowRight className="h-4 w-4" />
              </span>
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/claims">
          <Card className="group h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-10px_rgba(93,112,82,0.15)]">
            <CardHeader>
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#5D7052]/10 text-[#5D7052] transition-colors group-hover:bg-[#5D7052] group-hover:text-white">
                <LayoutGrid className="h-7 w-7" strokeWidth={2} />
              </span>
              <CardTitle>Claims</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-[#78786C]">
                Submitted Claims → Voice AI → In Review → Result. Move claims through the pipeline.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#5D7052] group-hover:underline">
                View board <ArrowRight className="h-4 w-4" />
              </span>
            </CardContent>
          </Card>
        </Link>

        <Card className="h-full border-[#DED8CF]/50 bg-[#F0EBE5]/50">
          <CardHeader>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C18C5D]/20 text-[#C18C5D]">
              <Phone className="h-7 w-7" strokeWidth={2} />
            </span>
            <CardTitle>Live call terminal</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#78786C]">
              When the Voice AI is on a call, the live transcript streams here—phone tree navigation and rep conversations in real time.
            </p>
            <p className="mt-3 text-xs text-[#78786C]">
              Open from the bottom-right widget when a call is active.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
