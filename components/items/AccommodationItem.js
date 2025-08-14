
"use client";
import Input from "@/components/ui/input";
import CurrencySelect from "@/components/ui/currency-select";
import { ISLANDS, PROPERTIES } from "@/lib/properties";
import { useMemo } from "react";

export default function AccommodationItem({ index, form }) {
  const island = form.watch(`items.${index}.island`) || "mahe";
  const options = useMemo(()=> PROPERTIES[island] || [], [island]);

  const recalc = () => {
    const base = Number(form.getValues(`items.${index}.basePrice`) || 0);
    const m = Number(form.getValues(`items.${index}.markupPercent`) || 0);
    const total = base * (1 + m / 100);
    form.setValue(`items.${index}.totalPrice`, +total.toFixed(2));
  };

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div>
        <div className="label">Island</div>
        <select className="input" {...form.register(`items.${index}.island`)} defaultValue="mahe"
          onChange={(e)=>{ form.setValue(`items.${index}.island`, e.target.value); form.setValue(`items.${index}.hotelProperty`, ""); }}>
          {ISLANDS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>
      </div>

      <div className="md:col-span-2">
        <div className="label">Hotel / Property</div>
        <select className="input" {...form.register(`items.${index}.hotelProperty`)}>
          <option value="">Select a property</option>
          {options.map((p)=> <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <div>
        <div className="label">Room(s)</div>
        <Input type="number" step="1" min="1" {...form.register(`items.${index}.roomCount`)} placeholder="e.g., 1" />
      </div>

      <div className="md:col-span-2">
        <div className="label">Room Details</div>
        <Input {...form.register(`items.${index}.roomDetails`)} placeholder="e.g., Deluxe Room with Sea View" />
      </div>

      <div>
        <div className="label">Adults</div>
        <Input type="number" step="1" {...form.register(`items.${index}.adults`)} placeholder="2" />
      </div>
      <div>
        <div className="label">Children</div>
        <Input type="number" step="1" {...form.register(`items.${index}.children`)} placeholder="0" />
      </div>
      <div>
        <div className="label">Guests (total)</div>
        <Input type="number" step="1" {...form.register(`items.${index}.guests`)} placeholder="2" />
      </div>

      <div>
        <div className="label">Check In</div>
        <Input type="date" {...form.register(`items.${index}.checkIn`)} />
      </div>
      <div>
        <div className="label">Check Out</div>
        <Input type="date" {...form.register(`items.${index}.checkOut`)} />
      </div>

      <div>
        <CurrencySelect value={form.watch(`items.${index}.currency`)}
                        onChange={(v)=> form.setValue(`items.${index}.currency`, v)} />
      </div>
      <div>
        <div className="label">Price</div>
        <Input type="number" step="0.01" {...form.register(`items.${index}.basePrice`, { onChange: recalc })} />
      </div>
      <div>
        <div className="label">Markup %</div>
        <Input type="number" step="0.01" {...form.register(`items.${index}.markupPercent`, { onChange: recalc })} />
      </div>
      <div>
        <div className="label">Total (auto)</div>
        <Input type="number" step="0.01" {...form.register(`items.${index}.totalPrice`)} />
      </div>

      <div className="md:col-span-2">
        <div className="label">Cancellation Policy</div>
        <div className="grid grid-cols-2 gap-2">
          <Input disabled value="Free Cancellation before" />
          <Input type="date" {...form.register(`items.${index}.cancellationBefore`)} />
        </div>
      </div>
    </div>
  );
}
