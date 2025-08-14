
# QuoteGen – Client PDF with Accommodation

- Next.js 15 (App Router), Tailwind (dark), JWT login, MongoDB/Mongoose
- New **Accommodation** section with **Island → Hotel** filtering, room details, pax, check-in/out, pricing
- **Transfers** and **Activities**
- Price + markup% → total (auto), subtotal/discount/grand total
- **Client-side PDF** via html2pdf.js with minimal header, booking details, muted cancellation notes

## Run
```bash
npm install
cp .env.local.example .env.local  # fill MONGO_URI, JWT_SECRET, ADMIN_*
npm run dev
# Visit /login
```
