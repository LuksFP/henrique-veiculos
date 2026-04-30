import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Henrique Veículos",
  description:
    "Henrique Veículos - seminovos e usados em Guarujá/SP. Consulte o estoque, destaques da semana e atendimento por WhatsApp.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
