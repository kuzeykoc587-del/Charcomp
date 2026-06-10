import { useState, useRef } from "react";
import { Upload, X, Loader2, AlertCircle } from "lucide-react";
import { uploadImage, isCloudinaryConfigured } from "../lib/cloudinary";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  className?: string;
  shape?: "square" | "portrait";
}

export function ImageUpload({ value, onChange, className = "", shape = "square" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploadError(null);

    if (!isCloudinaryConfigured()) {
      setUploadError("Cloudinary is not configured. Paste an image URL instead.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setUploadError("Selected file is not an image. Please choose a valid image file.");
      return;
    }

    setUploading(true);
    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (err: any) {
      setUploadError(err?.message ?? "Upload failed. Please try again or paste an image URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const aspectClass = shape === "portrait" ? "aspect-[2/3]" : "aspect-square";

  return (
    <div className={`space-y-2 ${className}`}>
      {/* Preview / Drop Zone */}
      <div
        className={`relative ${aspectClass} rounded-xl overflow-hidden border-2 border-dashed border-border bg-muted/40 flex items-center justify-center cursor-pointer hover:border-primary/60 transition-colors group`}
        onClick={() => !value && !uploading && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {value ? (
          <>
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                className="gap-1"
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
              >
                <Upload size={14} /> Change
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={(e) => { e.stopPropagation(); onChange(""); setUploadError(null); }}
              >
                <X size={14} />
              </Button>
            </div>
          </>
        ) : uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-xs">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground p-4 text-center pointer-events-none">
            <Upload size={24} />
            <span className="text-xs font-medium">
              {isCloudinaryConfigured() ? "Click or drop image" : "Paste image URL below"}
            </span>
          </div>
        )}
      </div>

      {/* Inline upload error */}
      {uploadError && (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          <AlertCircle size={14} className="mt-0.5 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {/* URL fallback */}
      <div className="flex gap-2">
        <Input
          placeholder="Or paste image URL..."
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
          className="text-xs h-8"
        />
        <Button
          size="sm"
          variant="outline"
          className="h-8 shrink-0"
          onClick={() => {
            if (urlInput) {
              onChange(urlInput);
              setUrlInput("");
              setUploadError(null);
            }
          }}
          disabled={!urlInput}
        >
          Use URL
        </Button>
      </div>
    </div>
  );
}
