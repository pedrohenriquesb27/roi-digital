import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ROI DIGITAL — Dashboard de Métricas de Vendas & Meta Ads',
  description: 'Painel inteligente de controle de vendas, webhooks Green e otimização Meta Ads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-cyan-500 selection:text-slate-950">
        {children}
      </body>
    </html>
  );
}
