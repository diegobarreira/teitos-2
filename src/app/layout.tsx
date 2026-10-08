import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import { StoreProvider } from "@/lib/store";

export const metadata: Metadata = {
  title: "Venta Huevos",
  description: "Gestión de venta de huevos a granjas (demo mock)",
};
//coment
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <StoreProvider>
          <div className="flex">
            <Nav />
            <main className="flex-1 p-8">{children}</main>
          </div>
        </StoreProvider>
      </body>
    </html>
  );
}
