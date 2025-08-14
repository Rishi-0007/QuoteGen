
"use client";
import Input from "@/components/ui/input";
import CurrencySelect from "@/components/ui/currency-select";

export default function ActivityItem({ index, form }) {
  const recalc = () => {
    const base = Number(form.getValues(`items.${index}.basePrice`) || 0);
    const m = Number(form.getValues(`items.${index}.markupPercent`) || 0);
    const total = base * (1 + m / 100);
    form.setValue(`items.${index}.totalPrice`, +total.toFixed(2));
  };

  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div className="md:col-span-2">
        <div className="label">Activity Name</div>
        <Input {...form.register(`items.${index}.itemTitle`)} placeholder="e.g., Mahe Island Discovery Tour" />
      </div>
      <div className="md:col-span-2">
        <div className="label">Details</div>
        <Input {...form.register(`items.${index}.description`)} placeholder="Seat in coach / timing / add-ons" />
      </div>
      <div>
        <div className="label">Date</div>
        <Input type="date" {...form.register(`items.${index}.startDate`)} />
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
