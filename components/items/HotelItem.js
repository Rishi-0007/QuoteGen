
"use client";
import Input from "@/components/ui/input";
import CurrencySelect from "@/components/ui/currency-select";
import { useEffect } from "react";

export default function HotelItem({ index, form }) {
  useEffect(() => {
    const start = form.watch(`items.${index}.startDate`);
    const end = form.watch(`items.${index}.endDate`);
    if (start && end) {
      const ms = (new Date(end) - new Date(start));
      const nights = Math.max(0, Math.round(ms / 86400000));
      form.setValue(`items.${index}.nightsAuto`, nights);
    }
  }, [form, index, form.watch(`items.${index}.startDate`), form.watch(`items.${index}.endDate`)]);

  const recalc = () => {
    const base = Number(form.getValues(`items.${index}.basePrice`) || 0);
    const m = Number(form.getValues(`items.${index}.markupPercent`) || 0);
    const total = base * (1 + m / 100);
    form.setValue(`items.${index}.totalPrice`, +total.toFixed(2));
  };

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div className="md:col-span-2">
        <div className="label">Hotel Name</div>
        <Input {...form.register(`items.${index}.supplierName`)} placeholder="e.g., Crown Beach Hotel" />
      </div>
      <div>
        <div className="label">Room Type</div>
        <Input {...form.register(`items.${index}.roomType`)} placeholder="e.g., Deluxe Sea View" />
      </div>
      <div>
        <div className="label">Room Details</div>
        <Input {...form.register(`items.${index}.description`)} placeholder="2 Adults, 1 Room, BB" />
      </div>

      <div>
        <div className="label">Start</div>
        <Input type="date" {...form.register(`items.${index}.startDate`)} />
      </div>
      <div>
        <div className="label">End</div>
        <Input type="date" {...form.register(`items.${index}.endDate`)} />
      </div>
      <div>
        <div className="label">Nights (auto)</div>
        <Input disabled value={form.watch(`items.${index}.nightsAuto`) || ""} />
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
