import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Inter:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
