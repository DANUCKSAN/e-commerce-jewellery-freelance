import type { Metadata, Viewport } from "next";

import "../globals.css";

export const metadata: Metadata = {
  title: { default: "Store administration", template: "%s | Aurelle Admin" },
  description: "Aurelle product and inventory administration.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#171411" };

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full bg-[#f4f1ec] antialiased">
      <body className="min-h-full overflow-x-clip bg-[#f4f1ec] text-[#171411]">{children}</body>
    </html>
  );
}
