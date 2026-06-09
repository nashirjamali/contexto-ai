"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface UploadZoneProps {
  onUpload: (file: File, title: string) => Promise<void>;
  disabled?: boolean;
}

export function UploadZone({ onUpload, disabled }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const title = file.name.replace(/\.[^/.]+$/, "");
      await onUpload(file, title);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    if (disabled || uploading) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      className={cn(
        "rounded-sm border-2 border-dashed p-10 text-center transition-colors",
        dragging ? "border-bronze bg-bronze/5" : "border-surface-raised",
        disabled && "opacity-50 pointer-events-none",
      )}
    >
      <p className="font-display text-lg text-paper">
        {uploading ? "Uploading…" : "Drop a document here"}
      </p>
      <p className="mt-1 text-sm text-paper-muted">PDF, DOC, DOCX supported</p>
      <label className="mt-4 inline-block cursor-pointer">
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,application/pdf"
          disabled={disabled || uploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
        />
        <span className="inline-flex items-center justify-center rounded-sm border border-surface-raised px-4 py-2 text-sm font-medium text-paper transition-all hover:border-bronze hover:text-bronze">
          Browse files
        </span>
      </label>
      {error && <p className="mt-3 text-sm text-ember">{error}</p>}
    </div>
  );
}
