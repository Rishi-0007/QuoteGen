
"use client";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import HotelItem from "@/components/items/HotelItem";
import TransferItem from "@/components/items/TransferItem";
import ActivityItem from "@/components/items/ActivityItem";
import CurrencySelect from "@/components/ui/currency-select";
import { useEffect } from "react";

const ItemSchema = z.object({
  type: z.string().optional(),
  transferType: z.string().optional(),
  supplierName: z.string().optional(),
  roomType: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
  members: z.coerce.number().optional(),
  currency: z.string().optional(),
  basePrice: z.coerce.number().optional(),
  markupPercent: z.coerce.number().optional(),
  totalPrice: z.coerce.number().optional(),
  cancellationBefore: z.string().optional(),
});

const QuoteSchema = z.object({
  destination: z.string().optional(),
  travelStart: z.string().optional(),
  travelEnd: z.string().optional(),
  currency: z.string().optional().default("INR"),
  items: z.array(ItemSchema).optional(),
  subtotal: z.coerce.number().optional(),
  discount: z.coerce.number().optional(),
  grandTotal: z.coerce.number().optional(),
  notes: z.string().optional(),
  status: z.string().optional(),
  footerBrand: z.string().optional(),
});

export default function QuoteForm({ initial }){
  const form = useForm({ resolver: zodResolver(QuoteSchema), defaultValues: initial || { currency: "INR", items: [], footerBrand: "holidays_seychelle", status: "draft" } });
  const { fields, append, remove } = useFieldArray({ control: form.control, name: "items" });

  function addHotel(){ append({ type: "hotel", currency: form.getValues("currency") || "INR" }); }
  function addTransfer(){ append({ type: "transfer", transferType: "airport", currency: form.getValues("currency") || "INR" }); }
  function addActivity(){ append({ type: "activity", currency: form.getValues("currency") || "INR" }); }

  function computeTotals(){
    const items = form.getValues("items") || [];
    const subtotal = items.reduce((sum, it) => {
      const t = Number(it.totalPrice ?? (Number(it.basePrice || 0) * (1 + Number(it.markupPercent || 0)/100)));
      return sum + (isFinite(t) ? t : 0);
    }, 0);
    form.setValue("subtotal", +subtotal.toFixed(2));
    const discount = Number(form.getValues("discount") || 0);
    form.setValue("grandTotal", Math.max(0, subtotal - discount));
  }

  useEffect(()=>{ computeTotals(); }, [form.watch("items"), form.watch("discount")]);

  async function onSubmit(values){
    computeTotals();
    const res = await fetch(initial? `/api/quotes/${initial._id}` : "/api/quotes", {
      method: initial ? "PATCH" : "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(values),
    });
    const data = await res.json();
    if(res.ok){ window.location.href = `/quotes/${data._id}`; } else { alert(data.error || "Error"); }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <div><div className="label">Destination</div><Input {...form.register("destination")} placeholder="e.g., Seychelles / Oman" /></div>
          <div><div className="label">Start</div><Input type="date" {...form.register("travelStart")} /></div>
          <div><div className="label">End</div><Input type="date" {...form.register("travelEnd")} /></div>
          <CurrencySelect value={form.watch("currency")} onChange={(v)=> form.setValue("currency", v)} />
          <div className="md:col-span-2">
            <div className="label">Footer / Brand</div>
            <select className="input" {...form.register("footerBrand")}>
              <option value="holidays_seychelle">Holidays Seychelle</option>
              <option value="oceanic_travel">Oceanic Travel Co. (dummy)</option>
              <option value="sunrise_journeys">Sunrise Journeys (dummy)</option>
            </select>
          </div>
          <div>
            <div className="label">Status</div>
            <select className="input" {...form.register("status")}>
              <option value="draft">Draft</option>
              <option value="final">Final</option>
            </select>
          </div>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Hotels</div>
          <Button type="button" onClick={addHotel}>Add Hotel</Button>
        </div>
        <div className="space-y-4">
          {fields.map((f, i) => f.type === "hotel" && (
            <div key={f.id} className="border border-white/10 rounded-2xl p-4">
              <HotelItem index={i} form={form} />
              <div className="flex justify-between mt-3">
                <div className="text-white/60">Item #{i+1}</div>
                <Button type="button" variant="ghost" onClick={()=> remove(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Transfers</div>
          <Button type="button" onClick={addTransfer}>Add Transfer</Button>
        </div>
        <div className="space-y-4">
          {fields.map((f, i) => f.type === "transfer" && (
            <div key={f.id} className="border border-white/10 rounded-2xl p-4">
              <TransferItem index={i} form={form} />
              <div className="flex justify-between mt-3">
                <div className="text-white/60">Item #{i+1}</div>
                <Button type="button" variant="ghost" onClick={()=> remove(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">Activities</div>
          <Button type="button" onClick={addActivity}>Add Activity</Button>
        </div>
        <div className="space-y-4">
          {fields.map((f, i) => f.type === "activity" && (
            <div key={f.id} className="border border-white/10 rounded-2xl p-4">
              <ActivityItem index={i} form={form} />
              <div className="flex justify-between mt-3">
                <div className="text-white/60">Item #{i+1}</div>
                <Button type="button" variant="ghost" onClick={()=> remove(i)}>Remove</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="grid md:grid-cols-4 gap-4">
          <div><div className="label">Subtotal</div><Input type="number" step="0.01" {...form.register("subtotal")} /></div>
          <div><div className="label">Discount</div><Input type="number" step="0.01" {...form.register("discount", { onChange: computeTotals })} /></div>
          <div><div className="label">Grand Total</div><Input type="number" step="0.01" {...form.register("grandTotal")} /></div>
          <div className="md:col-span-4">
            <div className="label">Notes</div>
            <Input {...form.register("notes")} placeholder="Any general notes…" />
          </div>
        </div>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" onClick={computeTotals}>Save</Button>
      </div>
    </form>
  );
}
