"use client";

import Link from "next/link";
import Logo from "./Logo";
import { AiOutlineFolder, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Project } from "../_types/project";

const navLinks = [
  {
    name: "Dashboard",
    href: "/",
    icon: <AiOutlineHome />,
  },
  {
    name: "Projects",
    href: "/projects",
    icon: <AiOutlineFolder />,
  },
  {
    name: "User",
    href: "/user",
    icon: <AiOutlineUser />,
  },
];

export default function Sidebar({ userProjects }: { userProjects: Project[] }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const lastFive = userProjects.slice(0, 5);
  const hasMore = userProjects.length > 5;

  return (
    <aside className="row-span-2 border-r border-slate-200 py-8 px-10">
      <ul className="flex flex-col justify-between h-full">
        <li className="mb-8">
          <Link href="/">
            <Logo />
          </Link>
        </li>
        <div className="flex flex-col gap-5 ">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`${
                  pathname === link.href ? "text-lime-600" : ""
                } flex gap-2 items-center hover:text-lime-600 text-xl`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>

              {link.href === "/projects" && userProjects.length > 0 && (
                <div className="ml-6 mt-2 flex flex-col gap-2 text-sm">
                  {(isOpen ? userProjects : lastFive).map((project) => (
                    <Link
                      key={project.id}
                      href={`/projects/${project.id}`}
                      className="text-slate-500 hover:text-lime-600 truncate"
                    >
                      {project.title}
                    </Link>
                  ))}

                  {hasMore && (
                    <button
                      onClick={() => setIsOpen((prev) => !prev)}
                      className="text-xs text-lime-600 hover:underline text-left"
                    >
                      {isOpen ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              )}
            </li>
          ))}
        </div>
        <li className="mt-auto">
          <Link
            href="/user"
            className="flex gap-2 items-center hover:text-lime-600 text-xl"
          >
            <HiArrowLeftStartOnRectangle />
            <span className="hover:text-slate-950">Logout</span>
          </Link>
        </li>
      </ul>
    </aside>
  );
}
