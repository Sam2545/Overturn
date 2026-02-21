"use client";

import { useState, useCallback } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const STORAGE_BUCKET = "denials";

export interface UploadStepProps {
  onComplete: (file: File, publicUrl: string) => void;
}

export function UploadStep({ onComplete }: UploadStepProps) {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const uploadToStorage = useCallback(async (selectedFile: File) => {
    setError(null);
    setUploading(true);
    const supabase = createClient();

    const ext = selectedFile.name.split(".").pop() ?? "pdf";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, selectedFile, { contentType: selectedFile.type, upsert: false });

    setUploading(false);

    if (uploadError) {
      const isBucketMissing =
        uploadError.message?.toLowerCase().includes("bucket") &&
        (uploadError.message?.toLowerCase().includes("not found") || uploadError.message?.toLowerCase().includes("does not exist"));
      setError(
        isBucketMissing
          ? "Storage bucket \"denials\" doesn't exist. Create it in Supabase: Storage → New bucket → name: denials → Create."
          : uploadError.message
      );
      return;
    }

    const { data: urlData } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);
    onComplete(selectedFile, urlData.publicUrl);
  }, [onComplete]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected?.type === "application/pdf") {
      setFile(selected);
      setError(null);
    } else if (selected) {
      setError("Please select a PDF file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped?.type === "application/pdf") {
      setFile(dropped);
      setError(null);
    } else if (dropped) {
      setError("Please drop a PDF file.");
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleContinue = () => {
    if (file) uploadToStorage(file);
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Top: square PDF dropzone */}
      <div className="flex flex-col items-center text-center">
        <h2 className="font-heading text-4xl font-semibold text-[#2C2C24] md:text-5xl">
          Upload denial PDF
        </h2>
        <p className="mt-4 max-w-xl text-[#78786C]">
          &ldquo;Drag and drop your denial letter&rdquo; or click to browse. We&apos;ll extract the key details next.
        </p>
        <label
          className={cn(
            "mt-8 flex aspect-square max-h-[320px] w-full max-w-md cursor-pointer flex-col items-center justify-center self-center rounded-3xl border-2 border-dashed p-8 transition-all duration-300",
            "border-[#DED8CF] bg-[#E6DCCD]/30 hover:border-[#5D7052]/40 hover:bg-[#5D7052]/5",
            "focus-within:ring-2 focus-within:ring-[#5D7052]/30 focus-within:ring-offset-2",
            isDragging && "border-[#5D7052]/50 bg-[#5D7052]/10"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            accept=".pdf,application/pdf"
            className="sr-only"
            onChange={handleFileChange}
            aria-label="Choose PDF file"
          />
          <span
            className={cn(
              "flex h-16 w-16 items-center justify-center rounded-full bg-[#5D7052]/10 text-[#5D7052] transition-colors",
              isDragging && "bg-[#5D7052]/20"
            )}
          >
            <Upload className="h-8 w-8" strokeWidth={2} aria-hidden />
          </span>
          {file ? (
            <span className="mt-4 font-medium text-[#2C2C24]">{file.name}</span>
          ) : (
            <span className="mt-4 text-center text-[#78786C]">
              Drop your PDF here or click to browse
            </span>
          )}
        </label>
      </div>

      {/* Bottom: file name text + single continue button */}
      <div className="flex flex-col items-center gap-3">
        {error && (
          <p className="text-sm text-[#A85448]" role="alert">
            {error}
          </p>
        )}
        {file && (
          <p className="text-center font-medium text-[#2C2C24]">
            {file.name}
          </p>
        )}
        <Button
          onClick={handleContinue}
          disabled={!file || uploading}
          className={cn(
            "w-full max-w-xs rounded-full px-8 transition-all duration-300",
            file
              ? "bg-[#5D7052] text-[#F3F4F1] shadow-[0_4px_20px_-2px_rgba(93,112,82,0.15)] hover:scale-105 hover:shadow-[0_6px_24px_-4px_rgba(93,112,82,0.25)]"
              : "cursor-not-allowed bg-[#DED8CF] text-[#78786C] hover:scale-100"
          )}
        >
          {!file
            ? "Select a file above"
            : uploading
              ? "Uploading…"
              : "Upload and continue"}
        </Button>
      </div>
    </div>
  );
}
