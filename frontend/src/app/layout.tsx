import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SentinelSight",
  description: "SentinelSight network intelligence dashboard for ICMP probe and traceroute analysis.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
