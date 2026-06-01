"use client";
import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { apiClient } from "@/lib/axios";

interface DownloadPrescriptionProps {
  /** The full pdfUrl stored on the appointment (backend endpoint or cloud URL) */
  pdfUrl: string;
  appointmentId: string;
  className?: string;
  label?: string;
}

/**
 * Downloads a prescription PDF.
 *
 * If the URL is a backend endpoint (/api/v1/doctor/appointments/…/prescription/download)
 * it fetches it via axios (which attaches the Bearer token) and triggers a
 * blob download. For external cloud URLs it opens them directly in a new tab.
 */
export function DownloadPrescription({
  pdfUrl,
  appointmentId,
  className = "",
  label = "Download PDF",
}: DownloadPrescriptionProps) {
  const [loading, setLoading] = useState(false);

  const isBackendUrl =
    pdfUrl.includes("/api/v1/") || pdfUrl.includes("localhost");

  const handleDownload = async () => {
    if (!isBackendUrl) {
      // Cloud URL — open directly
      window.open(pdfUrl, "_blank", "noreferrer");
      return;
    }

    setLoading(true);
    try {
      // Extract the path after /api/v1 so axios uses the configured baseURL
      const urlObj = new URL(pdfUrl);
      const apiPath = urlObj.pathname.replace(/^\/api\/v1/, "");

      const response = await apiClient.get(apiPath, {
        responseType: "blob",
      });

      const blob = new Blob([response.data as BlobPart], {
        type: "application/pdf",
      });
      const objectUrl = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `prescription-${appointmentId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch {
      alert("Failed to download prescription. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition disabled:opacity-60 shrink-0 ${className}`}
    >
      {loading ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <Download className="w-3.5 h-3.5" />
      )}
      {label}
    </button>
  );
}
