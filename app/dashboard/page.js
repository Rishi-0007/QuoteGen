
import Link from "next/link";
import { dbConnect } from "@/lib/db";
import Quotation from "@/models/Quotation";

export default async function Dashboard(){
  await dbConnect();
  const quotes = await Quotation.find().sort({ createdAt: -1 }).limit(100).lean();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/quotes/new" className="btn btn-primary">New Quotation</Link>
      </div>
      <div className="card p-0 overflow-hidden">
        <table className="table">
          <thead><tr><th>Destination</th><th>Created</th><th>Status</th><th>PDF</th><th className="text-right pr-4">Actions</th></tr></thead>
          <tbody>
            {quotes.map(q=>(
              <tr key={q._id}>
                <td>{q.destination || "-"}</td>
                <td>{new Date(q.createdAt).toLocaleString()}</td>
                <td><span className="badge capitalize">{q.status}</span></td>
                <td>{q.pdfUrl ? <a href={q.pdfUrl} target="_blank" className="text-accent underline">Open</a> : "—"}</td>
                <td className="text-right space-x-2 pr-4">
                  <Link href={`/quotes/${q._id}`} className="btn btn-ghost">View</Link>
                  <Link href={`/quotes/${q._id}/edit`} className="btn btn-ghost">Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
