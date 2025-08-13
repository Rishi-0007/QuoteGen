
"use client";
import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { quoteToHtml } from "@/lib/pdf-template-client";

// html2pdf.js cannot be SSR'd; load dynamically
const useHtml2Pdf = () => {
  const [lib, setLib] = useState(null);
  const load = useCallback(async () => {
    if (!lib) {
      const mod = await import("html2pdf.js");
      setLib(mod.default);
      return mod.default;
    }
    return lib;
  }, [lib]);
  return load;
};

export default function GeneratePdfButton({ quote }){
  const [loading,setLoading]=useState(false);
  const loadHtml2Pdf = useHtml2Pdf();

  async function generate(){
    setLoading(true);
    try{
      const html2pdf = await loadHtml2Pdf();
      const html = quoteToHtml(quote);
      const opt = {
        margin:       [10, 8, 10, 8],
        filename:     `quote_${quote._id || "draft"}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      await html2pdf().from(html).set(opt).save();
    } finally {
      setLoading(false);
    }
  }
  return (
    <button className="btn btn-ghost" type="button" onClick={generate} disabled={loading}>
      {loading ? "Generating…" : "Download PDF"}
    </button>
  );
}
