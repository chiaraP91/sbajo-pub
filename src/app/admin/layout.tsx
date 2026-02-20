import type { Metadata } from "next";
import AdminGate from "@/components/AdminGate";
import Header from "@/components/Header";
import "@/styles/globals.scss";

export const metadata: Metadata = {
  title: "Admin | Sbajo Cocktail Bar",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGate>
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #0b0c0f 0%, #1a1b1f 100%)",
          position: "relative",
        }}
      >
        <Header />
        {children}
      </div>
    </AdminGate>
  );
}
