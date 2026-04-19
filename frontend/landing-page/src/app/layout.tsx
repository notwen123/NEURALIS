import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import clsx from "clsx";

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NEURALIS — The Agent Economy Appchain",
  description:
    "The first sovereign Minitia where AI agents are full economic citizens — they autonomously earn yield, prove labor on-chain, compete in games, and generate real sequencer revenue.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="relative">
      <body className={clsx(dmSans.className, "antialiased bg-[#05050a]")}>
        {children}
      </body>
    </html>
  );
}
