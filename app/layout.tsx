import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import Sidebar from "./_components/Sidebar";
import Header from "./_components/Header";
import { getUserProjects } from "./_lib/data-service";
import { auth } from "./_lib/auth";
import { Project } from "./_types/project";
import { Toaster } from "react-hot-toast";

const MontserratSans = Montserrat({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "IdeaLift",
    template: "%s | IdeaLift",
  },
  description: "Manage your projects with ideas that your employees gave you",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  const userProjects: Project[] = session?.user?.id
    ? await getUserProjects(Number(session.user.id))
    : [];
  return (
    <html lang="en">
      <body
        className={`${MontserratSans.className} text-zinc-700 min-h-screen antialiased bg-slate-50 grid grid-cols-[250px_1fr] grid-rows-[auto_1fr] w-full max-w-full overflow-x-hidden`}
      >
        <Toaster />
        <Sidebar userProjects={userProjects} />
        <Header />
        <main className="p-8 min-w-0">{children}</main>
      </body>
    </html>
  );
}
