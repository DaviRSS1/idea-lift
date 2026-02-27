import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";

const MontserratSans = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "% / IdeaLift",
  description: "Manage your projects with ideas that your employees gave you",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${MontserratSans.className} text-zinc-900 min-h-screen antialiased bg-slate-50 grid grid-cols-[250px_1fr] grid-rows-[auto_1fr]`}
      >
        <Sidebar />
        <Header />
        <main className="p-8">{children}</main>
      </body>
    </html>
  );
}
