
import "./globals.css";
import Sidebar from "@/components/sidebar";

export const metadata = { title: "QuoteGen", description: "High-speed travel quotation generator" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6 container">{children}</main>
        </div>
      </body>
    </html>
  );
}
