import type { Metadata } from "next";
import { Inter, Nunito } from "next/font/google";
import "@/styles/globals.css";
import { AppProvider } from "@/providers/AppProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tripio",
  description:
    "Tripio es un planificador de viajes que te ayuda a organizar tu viaje con tus amigos, familia y compañeros de viaje.",
  openGraph: {
    title: "Tripio",
    description:
      "Tripio es un planificador de viajes que te ayuda a organizar tu viaje con tus amigos, familia y compañeros de viaje.",
    type: "website",
  },
  manifest: "/manifest.json",
  themeColor: "#001523",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Tripio",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${nunito.variable}`}>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
