
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["hotel","transfer","activity","other"], default: "other" },

  // Common / hotel / activity
  supplierName: String, // hotel name or activity name
  itemTitle: String,
  roomType: String,
  description: String, // details
  startDate: Date,
  endDate: Date,

  // Transfer
  transferType: { type: String, enum: ["airport","intercity","ferry"] },
  from: String,
  to: String,
  members: Number,

  // Pricing
  currency: { type: String, default: "INR" },
  basePrice: { type: Number, default: 0 },
  markupPercent: { type: Number },
  totalPrice: { type: Number, default: 0 },

  // Cancellation
  cancellationBefore: Date,
});

const QuotationSchema = new mongoose.Schema({
  currency: { type: String, default: "INR" },
  destination: String,
  travelStart: Date,
  travelEnd: Date,

  items: [ItemSchema],

  subtotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },

  footerBrand: {
    type: String,
    enum: ["holidays_seychelle","oceanic_travel","sunrise_journeys"],
    default: "holidays_seychelle"
  },

  status: { type: String, enum: ["draft","final"], default: "draft" },
  notes: String,
  pdfUrl: String,
}, { timestamps: true });

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
