
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["accommodation", "transfer", "activity", "other"], default: "other" },

  island: String,
  hotelProperty: String,
  roomCount: Number,
  roomDetails: String,
  adults: Number,
  children: Number,
  guests: Number,
  checkIn: Date,
  checkOut: Date,

  transferType: { type: String, enum: ["airport", "intercity", "ferry"] },
  from: String,
  to: String,
  details: String,
  members: Number,

  itemTitle: String,
  description: String,
  startDate: Date,

  currency: { type: String, default: "INR" },
  basePrice: { type: Number, default: 0 },
  markupPercent: { type: Number },
  totalPrice: { type: Number, default: 0 },

  cancellationBefore: Date,
});

const QuotationSchema = new mongoose.Schema({
  currency: { type: String, default: "INR" },
  agentName: String,
  agentPhone: String,
  agentEmail: String,
  agentSubject: String,
  items: [ItemSchema],
  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  footerBrand: { type: String, enum: ["holidays_seychelle", "oceanic_travel", "sunrise_journeys"], default: "holidays_seychelle" },
  notesPreset: { type: String, enum: ["default", "custom"], default: "default" },
  notesCustom: { type: String, default: "" },
  status: { type: String, enum: ["draft", "final"], default: "draft" },
}, { timestamps: true });

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
