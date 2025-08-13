
# QuoteGen – Client-side PDF Edition

- Next.js 15 (App Router), Tailwind (dark), JWT login (middleware protected), MongoDB/Mongoose
- Hotels + Transfers + Activities with dynamic fields
- Currency combobox (searchable, defaults to INR)
- Price + markup% -> total (auto), live subtotal/discount/grand total
- **PDF: generated entirely on the client via html2pdf.js** (no uploads) with 4 columns (Name | Details | Date | Pricing)
- Header/tagline, agent block, booking table with Subtotal/Discount/Grand Total, and free cancellation note in smaller muted text when present
- Footer brand selectable in form (Holidays Seychelle + 2 dummy brands)
- Dashboard "Edit" opens `/quotes/:id/edit` and restores the exact saved state

## Quick Start
```bash
npm install
cp .env.local.example .env.local  # fill MONGO_URI, JWT_SECRET, ADMIN_*
npm run dev
# Visit /login (use ADMIN_EMAIL/ADMIN_PASSWORD)
```

Open a quote → click **Download PDF** to save locally.
