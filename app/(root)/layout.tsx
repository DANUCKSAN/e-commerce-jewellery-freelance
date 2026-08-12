import type { Metadata, Viewport } from "next";

import "../globals.css";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { getSiteUrl } from "../../lib/site-url";

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
  title: {
    default: "AURELLE | Modern fine jewellery",
    template: "%s | AURELLE",
  },
  description:
    "Discover modern heirlooms in diamond, gold, silver and platinum, thoughtfully designed by AURELLE in Australia.",
  keywords: [
    "fine jewellery",
    "diamond jewellery",
    "gold jewellery",
    "silver jewellery",
    "platinum jewellery",
    "Australian jewellery",
  ],
};

export const viewport: Viewport = {
  themeColor: "#171411",
};

export default function StorefrontLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full bg-light-100 antialiased"
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full overflow-x-clip bg-light-100 font-sans text-dark-900">
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
