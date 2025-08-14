
"use client";
import Input from "@/components/ui/input";
import { useMemo } from "react";
import { ISLANDS } from "@/lib/properties";

export default function ActivityItem({ index, form }) {
  const island = form.watch(`items.${index}.island`) || "mahe";
  const activities = {
    mahe: [
      "Private Charter - Zephir", "Group Outing", "Tour Guiding", "Sunset on the Rocks at Cap Lazare Nature Reserve", "Visit Craft Village", "Gallery Domaine",
      "Mahe Island Discovery Shared Tour", "Island tour", "Ste Anne Marine Park (Day trip)", "Private Charter Zekler", "Nature Trail - Copolia", "Sunseekers Tours", 
      "Private Full Day Island Tours", "Discovery Tour of Mahe - Without Guide (Full Day)", "Discovery Tour of Mahe - Without Guide (Half Day)", "Sun Strokes Art Tour"
    ],
    praslin: [
      "Vallee De Mai (World Heritage site)", "La Digue Island Boat & Bike", "Curieuse and St Pierre Islands", "Nature Trail - Fond Ferdinand", 
      "Discovery Tour of Praslin Island - Without Guide (Half Day)", "Discovery Tour of Praslin Island - Without Guide (Full Day)", "Private Charter Catamaran Oplezir",
      "Curieuse & St Pierre Glass Bottom Boat trip and Snorkeling", "Praslin Island Discovery Shared Tour"
    ],
    ladigue: [
      "La Digue Island Boat & Bike (From Mahe Island)", "La Digue Island Boat & Bike (From Praslin Island)", "Coco, Sister & Felicite islands", 
      "Coco & Felicite Islands (From La Digue)", "Curieuse and St Pierre Islands", "La Digue Island Discovery Shared Tour", "Gesima Combo", "Ile de Palmes Discovery", 
      "Just Married", "Discovery of Turtle Island", "Reef Classico"
    ]
  };
  const options = activities[island] || [];
  return (
    <div className="grid md:grid-cols-4 gap-3">
      <div><div className="label">Island</div>
        <select className="input" {...form.register(`items.${index}.island`)} onChange={(e) => form.setValue(`items.${index}.island`, e.target.value)} >
          {ISLANDS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>
      </div>
      <div><div className="label">Activity</div>
        <select className="input" {...form.register(`items.${index}.itemTitle`)} >
          <option value="">Select an activity</option>
          {options.map(activity => <option key={activity} value={activity}>{activity}</option>)}
        </select>
      </div>
      <div><div className="label">Details</div><Input {...form.register(`items.${index}.description`)} placeholder="e.g., Sunset tour at Cap Lazare" /></div>
      <div><div className="label">From (time)</div><Input type="time" {...form.register(`items.${index}.startTime`)} /></div>
      <div><div className="label">To (time)</div><Input type="time" {...form.register(`items.${index}.endTime`)} /></div>
      <div><div className="label">Date</div><Input type="date" {...form.register(`items.${index}.startDate`)} /></div>
      <div><div className="label">Price</div><Input type="number" step="0.01" {...form.register(`items.${index}.basePrice`)} /></div>
      <div><div className="label">Markup %</div><Input type="number" step="0.01" {...form.register(`items.${index}.markupPercent`)} /></div>
      <div><div className="label">Total (auto)</div><Input type="number" step="0.01" {...form.register(`items.${index}.totalPrice`)} /></div>
      <div className="md:col-span-2"><div className="label">Cancellation Policy</div>
        <div className="grid grid-cols-2 gap-2">
          <Input disabled value="Free Cancellation before" />
          <Input type="date" {...form.register(`items.${index}.cancellationBefore`)} />
        </div>
      </div>
    </div>
  );
}
