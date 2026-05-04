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
      <body>{children}</body>
    </html>
  );
}
