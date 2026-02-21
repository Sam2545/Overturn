import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FDFCF8] px-4">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="font-heading text-5xl font-semibold tracking-tight text-[#5D7052] md:text-7xl">
          Overturn
        </h1>
        <p className="mt-4 text-lg text-[#78786C]">
          AI-powered medical billing appeals in minutes.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="rounded-full hover:scale-105">
              Sign up
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="rounded-full hover:scale-105">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
