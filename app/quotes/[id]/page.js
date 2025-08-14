
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import Link from "next/link";
import GeneratePdfButton from "@/components/GeneratePdfButton";

function formatMoney(v, cur = "INR") { const n = Number(v || 0); return `${cur} ${n.toFixed(2)}`; }

function splitHotelAndLocation(hotelProperty) {
  if (!hotelProperty) return { name: "", location: "" };
  const m = hotelProperty.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (m) return { name: m[1].trim(), location: m[2].trim() };
  return { name: hotelProperty, location: "" };
}

export default async function QuoteView({ params }) {
  const { id } = await params; // Next.js 15
  await dbConnect();
  const quote = await Quotation.findById(id).lean();
  if (!quote) return <div>Not found</div>;

  const items = (quote.items || []).map((it) => {
    const cur = it.currency || quote.currency || "INR";
    const total = it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100));
    if (it.type === "accommodation") {
      const { name, location } = splitHotelAndLocation(it.hotelProperty || "");
      const rn = it.roomCount ? `${it.roomCount} x` : "";
      const pax = [(it.adults || it.adults === 0) ? `${it.adults} Adults` : null, (it.children || it.children === 0) ? `${it.children} Children` : null, (it.guests || it.guests === 0) ? `${it.guests} Guests` : null].filter(Boolean).join(", ");
      return {
        name: name || "Hotel",
        details: [location ? `(${location})` : "", [rn, it.roomDetails].filter(Boolean).join(" "), pax].filter(Boolean).join(" — "),
        date: `${it.checkIn ? new Date(it.checkIn).toLocaleDateString() : ""} - ${it.checkOut ? new Date(it.checkOut).toLocaleDateString() : ""}`,
        price: formatMoney(total, cur),
      };
    } else if (it.type === "transfer") {
      const label = it.transferType === "ferry" ? "Ferry Transfer" : it.transferType === "intercity" ? "Intercity Transfer" : "Airport Transfer";
      return {
        name: `${label}${it.details ? " - " + it.details : ""}`.trim(),
        details: `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`,
        date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "",
        price: formatMoney(total, cur),
      };
    } else if (it.type === "activity") {
      return { name: it.itemTitle || "Activity", details: it.description || "", date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "", price: formatMoney(total, cur) };
    } else {
      return { name: it.itemTitle || "Service", details: it.description || "", date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "", price: formatMoney(total, cur) };
    }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Quotation</h1>
        <div className="flex gap-2">
          <GeneratePdfButton id={quote._id.toString()} />
          <Link className="btn btn-primary" href={`/quotes/${quote._id}/edit`}>Edit</Link>
        </div>
      </div>

      <div className="card p-6 overflow-hidden">
        <table className="table">
          <thead><tr><th>Name</th><th>Details</th><th>Date</th><th className="text-right">Pricing</th></tr></thead>
          <tbody>
            {items.map((r, idx) => (
              <tr key={idx}>
                <td>{r.name}</td>
                <td className="text-white/80">{r.details}</td>
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
