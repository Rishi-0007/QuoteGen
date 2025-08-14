
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import QuoteForm from "@/components/quote-form";
export default async function EditQuote({ params }){
  const { id } = await params; await dbConnect(); const q = await Quotation.findById(id).lean(); if(!q) return <div>Not found</div>;
  q._id = q._id.toString();
  q.items = (q.items||[]).map((it)=> ({ ...it, checkIn: it.checkIn ? new Date(it.checkIn).toISOString().slice(0,10) : "", checkOut: it.checkOut ? new Date(it.checkOut).toISOString().slice(0,10) : "", startDate: it.startDate ? new Date(it.startDate).toISOString().slice(0,10) : "", cancellationBefore: it.cancellationBefore ? new Date(it.cancellationBefore).toISOString().slice(0,10) : "", }));
  return (<div><h1 className="text-2xl font-semibold mb-4">Edit Quotation</h1><QuoteForm initial={q} /></div>);
}
