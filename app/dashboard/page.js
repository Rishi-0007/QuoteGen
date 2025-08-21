
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";
export default async function Dashboard() {
  await dbConnect();
  const quotes = await Quotation.find().sort({ createdAt: -1 }).limit(50).lean();
  const rows = quotes.map((q) => ({
    id: q._id?.toString(),
    createdAt: q.createdAt ? new Date(q.createdAt).toISOString() : "",
    status: q.status,
  }));
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/quotes/new" className="btn btn-primary">New Quotation</Link>
      </div>
      <div className="card p-6 overflow-hidden">
        <table className="table">
          <thead><tr><th>Created</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : ""}</td>
                <td className="capitalize">{r.status}</td>
                <td className="text-right">
                  <Link href={`/quotes/${r.id}`} className="btn btn-ghost mr-2">View</Link>
                  <Link href={`/quotes/${r.id}/edit`} className="btn btn-ghost">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
