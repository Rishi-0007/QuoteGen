
import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  type: { type: String, enum: ["accommodation","transfer","activity","other"], default: "other" },

  // Accommodation
  island: String,                   // mahe | praslin | ladigue
  hotelProperty: String,            // full string from PROPERTIES list
  roomCount: Number,
  roomDetails: String,              // e.g., Deluxe Room with Sea View
  adults: Number,
  children: Number,
  guests: Number,
  checkIn: Date,                    // startDate alias
  checkOut: Date,                   // endDate alias

  // Transfer
  transferType: { type: String, enum: ["airport","intercity","ferry"] },
  from: String,
  to: String,
  details: String,
  members: Number,

  // Activity
  itemTitle: String,
  description: String,
  startDate: Date,

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
}, { timestamps: true });

export default mongoose.models.Quotation || mongoose.model("Quotation", QuotationSchema);
