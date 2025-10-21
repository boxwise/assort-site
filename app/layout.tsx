import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ASSORT Standard Products",
  description: "ASSORT humanitarian aid standard products",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
