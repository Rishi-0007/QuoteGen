import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import Link from "next/link";
import GeneratePdfButton from "@/components/GeneratePdfButton";
import { AGENT_DEFAULT } from "@/lib/constants";

function formatMoney(v, cur = "INR") { const n = Number(v || 0); return `${cur} ${n.toFixed(2)}`; }
function splitHotelAndLocation(hotelProperty) { if (!hotelProperty) return { name: "", location: "" }; const m = hotelProperty.match(/^(.*?)\\s*\\((.+)\\)\\s*$/); if (m) return { name: m[1].trim(), location: m[2].trim() }; return { name: hotelProperty, location: "" }; }

export default async function QuoteView({ params }) {
  const { id } = await params;
  await dbConnect();
  const quote = await Quotation.findById(id).lean();
  if (!quote) return <div>Not found</div>;

  // Fallbacks for preview
  const agent = {
    name: quote.agentName || AGENT_DEFAULT.name,
    phone: quote.agentPhone || AGENT_DEFAULT.phone,
    email: quote.agentEmail || AGENT_DEFAULT.email,
    subject: quote.agentSubject || AGENT_DEFAULT.subject,
  };

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
      return { name: `${label}${it.details ? " - " + it.details : ""}`.trim(), details: `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`, date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "", price: formatMoney(total, cur) };
    } else if (it.type === "activity") {
      const fromTo = (it.startTime || it.endTime) ? `From ${it.startTime || "--"} to ${it.endTime || "--"}` : "";
      const mergedDetails = [it.description || "", fromTo].filter(Boolean).join(" — ");
      return { name: it.itemTitle || it.customActivity || "Activity", details: mergedDetails, date: it.startDate ? new Date(it.startDate).toLocaleDateString() : "", price: formatMoney(total, cur) };
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

      {/* NEW: Agent Details preview */}
      <div className="card p-6">
        <div className="text-lg font-semibold mb-2">Agent Details</div>
        <div className="grid md:grid-cols-4 gap-2 text-sm">
          <div className="text-white/70">Contact Person</div><div>{agent.name}</div>
          <div className="text-white/70">Mobile Number</div><div>{agent.phone}</div>
          <div className="text-white/70">E Mail</div><div>{agent.email}</div>
          <div className="text-white/70">Subject</div><div className="md:col-span-3">{agent.subject}</div>
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
