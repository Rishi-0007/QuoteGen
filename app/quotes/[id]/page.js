
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import Link from "next/link";
import GeneratePdfButton from "@/components/GeneratePdfButton";

function formatMoney(v, cur="INR"){ const n=Number(v||0); return `${cur} ${n.toFixed(2)}`; }

export default async function QuoteView({ params }){
  const { id } = await params; // Next.js 15
  await dbConnect();
  const doc = await Quotation.findById(id).lean();
  if(!doc) return <div>Not found</div>;
  const quote = JSON.parse(JSON.stringify(doc)); // serialize for client

  const items = (quote.items || []).map((it) => {
    const cur = it.currency || quote.currency || "INR";
    const total = it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0)/100));
    let name = it.itemTitle || it.supplierName || it.type || "";
    if (it.type === "transfer") {
      const label = it.transferType === "ferry" ? "Ferry Transfer" :
                    it.transferType === "intercity" ? "Intercity Transfer" : "Airport Transfer";
      name = `${label}${it.description ? " - " + it.description : ""}`.trim();
    } else if (it.type === "hotel") {
      if (it.roomType) name = `${it.supplierName || "Hotel"} ${it.roomType}`.trim();
    } else if (it.type === "activity") {
      name = it.supplierName || "Activity";
    }
    const details = it.type === "transfer"
      ? `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`
      : (it.description || "");
    const date = it.type === "hotel"
      ? `${it.startDate ? new Date(it.startDate).toLocaleDateString() : ""} - ${it.endDate ? new Date(it.endDate).toLocaleDateString() : ""}`
      : (it.startDate ? new Date(it.startDate).toLocaleDateString() : "");
    return { name, details, date, price: formatMoney(total, cur), cancel: it.cancellationBefore ? `Free Cancellation before ${new Date(it.cancellationBefore).toLocaleDateString()}` : "" };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quotation</h1>
        <div className="flex gap-2">
          <GeneratePdfButton quote={quote} />
          <Link className="btn btn-primary" href={`/quotes/${quote._id}/edit`}>Edit</Link>
        </div>
      </div>

      <div className="card p-0 overflow-hidden">
        <table className="table">
          <thead><tr><th>Name</th><th>Details</th><th>Date</th><th className="text-right">Pricing</th></tr></thead>
          <tbody>
            {items.map((r, idx)=>(
              <tr key={idx}>
                <td>{r.name}</td>
                <td className="text-white/80">
                  <div>{r.details}</div>
                  {r.cancel && <div className="text-white/50 text-xs mt-1">{r.cancel}</div>}
                </td>
                <td>{r.date}</td>
                <td className="text-right">{r.price}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="text-right">Subtotal</td>
              <td className="text-right">{formatMoney(quote.subtotal, quote.currency || "INR")}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right">Total Discount</td>
              <td className="text-right">-{formatMoney(quote.discount, quote.currency || "INR")}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right font-semibold">Grand Total</td>
              <td className="text-right font-semibold">{formatMoney(quote.grandTotal, quote.currency || "INR")}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
