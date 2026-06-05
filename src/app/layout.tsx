import type { Metadata } from "next";
import { Inter, Roboto_Mono, Bebas_Neue } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { ClientProviders } from "@/components/providers/ClientProviders";

const inter = Inter({
  variable: "--font-sans-family",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono-family",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Dystronic | Laboratorio y Tienda de Componentes",
  description: "La plataforma para aprender, construir y comprar proyectos electrónicos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${robotoMono.variable} ${bebasNeue.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#09090b] text-gray-100 selection:bg-purple-500/30 selection:text-purple-100 relative overflow-x-hidden">
        <ClientProviders>
          {/* Modern glassmorphic background with blurred ambient orbs */}
          <div className="fixed inset-0 pointer-events-none z-[-1]">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] mix-blend-screen"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] mix-blend-screen"></div>
            <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] rounded-full bg-teal-900/10 blur-[100px] mix-blend-screen"></div>
          </div>

          <Navbar />
          <main className="flex-1 flex flex-col w-full relative z-0 mt-16">{children}</main>
          <Footer />
        </ClientProviders>
      </body>
    </html>
  );
}
