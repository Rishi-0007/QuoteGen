
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
import QuoteForm from "@/components/quote-form";

export default async function EditQuotePage({ params }){
  const { id } = await params;
  await dbConnect();
  const q = await Quotation.findById(id).lean();
  if(!q) return <div>Not found</div>;
  // Normalize dates to yyyy-mm-dd for inputs
  const toDate = (d) => d ? new Date(d).toISOString().slice(0,10) : "";
  const initial = JSON.parse(JSON.stringify(q));
  initial.travelStart = toDate(initial.travelStart);
  initial.travelEnd = toDate(initial.travelEnd);
  initial.items = (initial.items||[]).map(it => ({ ...it, startDate: toDate(it.startDate), endDate: toDate(it.endDate), cancellationBefore: toDate(it.cancellationBefore) }));
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Quotation</h1>
      <QuoteForm initial={initial} />
    </div>
  );
}
