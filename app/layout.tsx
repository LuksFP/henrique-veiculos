import type { Metadata } from "next";
import { Archivo, Barlow, Yellowtail } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "900"],
  variable: "--display",
  display: "swap",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--body",
  display: "swap",
});

const yellowtail = Yellowtail({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--script",
  display: "swap",
});

const BASE_URL = "https://www.henriqueveiculos.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "Henrique Veículos | Seminovos em Guarujá/SP",
  description:
    "Seminovos e usados selecionados em Guarujá/SP. Avaliação na loja, consignação e financiamento. Atendimento por WhatsApp.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Henrique Veículos",
    title: "Henrique Veículos | Seminovos em Guarujá/SP",
    description:
      "Seminovos e usados selecionados em Guarujá/SP. Avaliação na loja, consignação e financiamento. Atendimento por WhatsApp.",
  },
  twitter: {
    card: "summary",
    title: "Henrique Veículos | Seminovos em Guarujá/SP",
    description:
      "Seminovos e usados selecionados em Guarujá/SP. Avaliação na loja, consignação e financiamento. Atendimento por WhatsApp.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning data-scroll-behavior="smooth">
      <body suppressHydrationWarning className={`${archivo.variable} ${barlow.variable} ${yellowtail.variable}`}>
        {children}
      </body>
    </html>
  );
}
