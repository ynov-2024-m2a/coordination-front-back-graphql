import type { Metadata } from "next";
import "@/style/globals.scss";

export const metadata: Metadata = {
  title: "Go Drive",
  description: "Explorateur de fichier en ligne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        {children}
      </body>
    </html>
  );
}
