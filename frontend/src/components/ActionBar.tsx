"use client";

import { Copy, Download } from "lucide-react";
import type { ScanResponse } from "@/lib/types";

interface ActionBarProps {
  data: ScanResponse;
}

export function ActionBar({ data }: ActionBarProps) {
  const copyResult = async () => {
    const payload = JSON.stringify(data, null, 2);
    await navigator.clipboard.writeText(payload);
    window.alert("Scan results copied to clipboard.");
  };

  const downloadJson = () => {
    const payload = JSON.stringify(data, null, 2);
    const file = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sentinelsight-scan-${data.target ?? "result"}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={copyResult}
        className="inline-flex items-center gap-2 rounded-full border border-[#2ee3a4]/30 bg-[#031217] px-4 py-3 text-sm font-semibold text-[#2ee3a4] transition hover:border-[#2ee3a4] hover:bg-[#062523]"
      >
        <Copy size={16} /> Copy
      </button>
      <button
        type="button"
        onClick={downloadJson}
        className="inline-flex items-center gap-2 rounded-full border border-[#2ee3a4]/30 bg-[#031217] px-4 py-3 text-sm font-semibold text-[#8be4ff] transition hover:border-[#8be4ff] hover:bg-[#062533]"
      >
        <Download size={16} /> Download JSON
      </button>
    </div>
  );
}
