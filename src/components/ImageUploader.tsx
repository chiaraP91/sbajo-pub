"use client";

import { useState } from "react";
import Image from "next/image";

type ImageUploaderProps = {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
};

// Cloudinary config (free tier: 25GB storage + 25GB bandwidth/month)
const CLOUDINARY_CLOUD_NAME =
  process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dkoqtcyvi";
const CLOUDINARY_UPLOAD_PRESET =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "sbajo_eventi";

export default function ImageUploader({
  currentImageUrl,
  onImageUploaded,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validazione
    if (!file.type.startsWith("image/")) {
      setError("Per favore, seleziona un'immagine (JPG, PNG, WebP, ecc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("L'immagine è troppo grande. Max 10MB.");
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(30);

    try {
      // Crea FormData per Cloudinary
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "eventi");

      setProgress(50);

      // Upload a Cloudinary (unsigned - no auth required)
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error?.message || "Errore durante l'upload");
      }

      const data = await response.json();

      // URL ottimizzato con trasformazione Cloudinary
      // f_auto = formato automatico (WebP/AVIF), q_auto = qualità automatica
      const optimizedUrl = data.secure_url.replace(
        "/upload/",
        "/upload/f_auto,q_auto,w_1200/",
      );

      setProgress(100);
      setPreviewUrl(optimizedUrl);
      onImageUploaded(optimizedUrl);
      setUploading(false);

      // Reset progresso dopo un breve delay
      setTimeout(() => setProgress(0), 500);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Cloudinary upload error:", err);
      setError(err?.message || "Errore durante l'upload");
      setUploading(false);
      setProgress(0);
    }
  };

  const displayUrl = previewUrl || currentImageUrl;

  return (
    <div style={{ marginTop: 8 }}>
      <label
        style={{
          display: "inline-block",
          padding: "10px 20px",
          backgroundColor: uploading ? "#ccc" : "#ddbb79",
          color: uploading ? "#666" : "#1a1a1a",
          borderRadius: 8,
          cursor: uploading ? "not-allowed" : "pointer",
          fontWeight: 500,
          transition: "all 0.2s",
        }}
      >
        {uploading ? `Caricamento... ${progress}%` : "📷 Carica Immagine"}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          style={{ display: "none" }}
        />
      </label>

      {error && (
        <div
          style={{
            marginTop: 8,
            padding: 12,
            backgroundColor: "rgba(255,0,0,0.1)",
            borderRadius: 8,
            color: "#d00",
          }}
        >
          {error}
        </div>
      )}

      {uploading && (
        <div
          style={{
            marginTop: 12,
            width: "100%",
            maxWidth: 420,
            height: 4,
            backgroundColor: "rgba(221,187,121,0.2)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: "#ddbb79",
              transition: "width 0.3s",
            }}
          />
        </div>
      )}

      {displayUrl && !uploading && (
        <div style={{ marginTop: 12, maxWidth: 420 }}>
          <Image
            src={displayUrl}
            alt="Anteprima immagine"
            width={420}
            height={560}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: 12,
              border: "1px solid rgba(221,187,121,.3)",
            }}
          />
          <p
            style={{
              marginTop: 8,
              fontSize: 12,
              color: "#666",
              wordBreak: "break-all",
            }}
          >
            {displayUrl}
          </p>
        </div>
      )}
    </div>
  );
}
