import { AGENT_DEFAULT } from "@/lib/constants";
import { BRANDS } from "@/lib/constants";
import { marked } from "marked";
import DOMPurify from "isomorphic-dompurify";

export function escapeHtml(s = "") {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

const fmt = (d) => (d ? new Date(d).toLocaleDateString() : "");
const money = (v, cur = "INR") => `${cur} ${(Number(v || 0)).toFixed(2)}`;
function splitHotelAndLocation(hotelProperty) {
  if (!hotelProperty) return { name: "", location: "" };
  const m = hotelProperty.match(/^(.*?)\s*\((.+)\)\s*$/);
  if (m) return { name: m[1].trim(), location: m[2].trim() };
  return { name: hotelProperty, location: "" };
}
function buildNotesHtml(quote) {
  const md = (quote.notesCustom || "").trim();
  if (!md) return "";
  const html = DOMPurify.sanitize(marked.parse(md));
  return `<div class="md">${html}</div>`;
}

export function quoteToHtml(quote) {
  const agent = {
    name: (quote.agentName || AGENT_DEFAULT.name),
    phone: (quote.agentPhone || AGENT_DEFAULT.phone),
    email: (quote.agentEmail || AGENT_DEFAULT.email),
    subject: (quote.agentSubject || AGENT_DEFAULT.subject),
  };

  const qcur = quote.currency || "INR";
  const subtotal = Number(quote.subtotal || 0);
  const discount = Number(quote.discount || 0);
  const grand = Math.max(0, subtotal - discount);
  const brand = BRANDS[quote.footerBrand] || BRANDS.holidays_seychelle;

  const rows = (quote.items || []).slice().sort((a, b) => {
    const ad = a.startDate ? new Date(a.startDate).getTime() : (a.checkIn ? new Date(a.checkIn).getTime() : 0);
    const bd = b.startDate ? new Date(b.startDate).getTime() : (b.checkIn ? new Date(b.checkIn).getTime() : 0);
    return ad - bd;
  }).map(it => {
    const cur = it.currency || qcur;
    const total = it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0) / 100));
    let name = "", subline = "", details = "", date = "";
    if (it.type === "accommodation") {
      const { name: hotelName, location } = splitHotelAndLocation(it.hotelProperty || "");
      name = hotelName || "Hotel"; subline = location;
      const rn = it.roomCount ? `${it.roomCount} x` : "";
      const pax = [(it.adults || it.adults === 0) ? `${it.adults} Adults` : null, (it.children || it.children === 0) ? `${it.children} Children` : null, (it.guests || it.guests === 0) ? `${it.guests} Guests` : null].filter(Boolean).join(", ");
      details = [rn, it.roomDetails, pax].filter(Boolean).join(" ");
      date = `${fmt(it.checkIn)} - ${fmt(it.checkOut)}`;
    } else if (it.type === "transfer") {
      const label = it.transferType === "ferry" ? "Ferry Transfer" : it.transferType === "intercity" ? "Intercity Transfer" : "Airport Transfer";
      name = `${label}${it.details ? " - " + it.details : ""}`.trim();
      details = `Pickup ${it.from || ""}${it.to ? " to " + it.to : ""}`;
      date = fmt(it.startDate);
    } else if (it.type === "activity") {
      name = it.itemTitle || it.customActivity || "Activity";
      details = it.description || "";
      // If you added startTime/endTime/total hours to your Activity item, append here as you already do
      const fromTo = (it.startTime || it.endTime) ? `From ${it.startTime || "--"} to ${it.endTime || "--"}` : "";
      details = [details, fromTo].filter(Boolean).join(" — ");
      date = fmt(it.startDate);
    } else {
      name = it.itemTitle || "Service"; details = it.description || ""; date = fmt(it.startDate);
    }
    const cancellationNote = it.cancellationBefore ? `Free Cancellation before ${fmt(it.cancellationBefore)}` : "";
    return {
      name: escapeHtml(name),
      subline: escapeHtml(subline),
      details: escapeHtml(details),
      cancel: escapeHtml(cancellationNote),
      date: escapeHtml(date),
      price: escapeHtml(money(total, cur))
    };
  });

  const notesHtml = buildNotesHtml(quote);

  return `<!doctype html><html><head><meta charset="utf-8"/><title>Travel Quotation</title>
  <style>
    :root { --text:#111827; --muted:#6b7280; --line:#e5e7eb; --accent:#0ea5e9; --bg:#ffffff; --bg-soft:#f8fafc; }
    *{box-sizing:border-box} body{margin:0;padding:0;font:12px/1.45 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial;color:var(--text);background:var(--bg)}
    .page{padding:24px 20px}.header{padding:8px 0;border-bottom:1px solid var(--line)}.header h1{margin:0;font-size:20px;color:var(--accent);letter-spacing:.2px}.header .tag{margin-top:4px;font-size:12px;color:var(--muted)}
    .section{margin-top:14px}.title{font-weight:700;margin-bottom:6px}.bookingTitle{font-size:14px;font-weight:700;margin:10px 0 6px}.card{border:1px solid var(--line);background:var(--bg-soft);border-radius:10px;padding:10px 12px}
    .muted{color:var(--muted)}.kv{display:grid;grid-template-columns:180px 1fr;gap:4px 8px}.kv div:nth-child(odd){color:var(--muted)}
    .table{width:100%;border-collapse:separate;border-spacing:0;border:1px solid var(--line);border-radius:10px;overflow:hidden;background:#fff}
    .table thead th{text-align:left;color:#111827;font-weight:700;background:#f3f4f6;padding:10px 12px;font-size:12px;border-bottom:1px solid var(--line)}
    .table th:nth-child(1),.table td:nth-child(1){width:36%}.table th:nth-child(2),.table td:nth-child(2){width:36%}.table th:nth-child(3),.table td:nth-child(3){width:14%;text-align:center}.table th:nth-child(4),.table td:nth-child(4){width:14%;text-align:right}
    .table tbody td{padding:10px 12px;border-bottom:1px solid var(--line);vertical-align:top}.table tbody tr:nth-child(odd) td{background:#fcfdff}
    .subline{display:block;font-size:10px;color:var(--muted);margin-top:2px}.cancel-note{margin-top:4px;font-size:10px;color:var(--muted)}
    .summary{width:100%;margin-top:8px;display:grid;grid-template-columns:1fr 200px;gap:6px}.summary .label{color:var(--muted)}.summary .value{text-align:right}
    .notes{border:1px dashed var(--line);background:#fff;border-radius:10px;padding:10px 12px}.notes ul{margin:6px 0 0 18px;padding:0}.notes li{margin:4px 0}
    .footer{margin-top:12px;display:flex;align-items:center;justify-content:space-between;gap:10px;color:var(--muted)}.footer img{height:28px;width:auto;object-fit:contain}
  
    .notes .md h1,.notes .md h2,.notes .md h3{margin:8px 0 6px;font-weight:700;color:#111827}
    .notes .md h4,.notes .md h5,.notes .md h6{margin:6px 0 4px;font-weight:600;color:#111827}
    .notes .md p{margin:6px 0}
    .notes .md ul,.notes .md ol{margin:6px 0 0 18px;padding:0}
    .notes .md li{margin:4px 0}
    .notes .md em{font-style:italic}
    .notes .md strong{font-weight:700}
    .notes .md table{width:100%;border-collapse:collapse;margin:8px 0}
    .notes .md th,.notes .md td{border:1px solid var(--line);padding:6px 8px;text-align:left}
    .notes .md blockquote{margin:6px 0;padding:6px 10px;border-left:3px solid var(--accent);background:var(--bg-soft)}
</style></head>
  <body><div class="page">
    <div class="header"><h1>Tours and Travel Quotation</h1><div class="tag">Quotation for your travel itinerary</div></div>

    <div class="section card"><div class="title">Agent Details</div><div class="kv">
      <div>Contact Person</div><div>${escapeHtml(agent.name)}</div>
      <div>Mobile Number</div><div>${escapeHtml(agent.phone)}</div>
      <div>E Mail</div><div>${escapeHtml(agent.email)}</div>
      <div>Subject</div><div>${escapeHtml(agent.subject)}</div>
    </div></div>

    <div class="section"><div>Dear Sir/Ma'am,</div><div class="muted">Please find below the details of the prices for the travel items as per your requirements.</div></div>

    <div class="section"><div class="bookingTitle">Booking Details</div>
      <table class="table"><thead><tr><th>Name</th><th>Details</th><th>Date</th><th>Pricing</th></tr></thead><tbody>
        ${rows.map(r => `<tr><td>${r.name}${r.subline ? `<span class="subline">${r.subline}</span>` : ''}</td><td>${r.details}${r.cancel ? `<div class="cancel-note">${r.cancel}</div>` : ''}</td><td style="text-align:center">${r.date}</td><td style="text-align:right">${r.price}</td></tr>`).join("")}
      </tbody></table>
      <div class="summary"><div class="label">Subtotal</div><div class="value">${money(subtotal, qcur)}</div><div class="label">Total Discount</div><div class="value">-${money(discount, qcur)}</div><div class="label" style="font-weight:700">Grand Total</div><div class="value" style="font-weight:700">${money(grand, qcur)}</div></div>
    </div>

    <div class="section notes"><div class="title">Important Notes</div>${buildNotesHtml(quote)}</div>

    <div class="footer"><div><div>The booking is powered by ${escapeHtml(brand.name)}</div><div>Emergency number - ${escapeHtml(brand.emergency)}</div></div>${brand.logo ? `<img src="${brand.logo}" alt="logo" />` : `<div>[logo]</div>`}</div>
  </div></body></html>`;
}
