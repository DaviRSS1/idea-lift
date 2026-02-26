import Link from "next/link";
import Logo from "./Logo";
import { AiOutlineFolder, AiOutlineHome, AiOutlineUser } from "react-icons/ai";
import { HiArrowLeftStartOnRectangle } from "react-icons/hi2";

export default function Sidebar() {
  return (
    <aside className="row-span-2 border-r border-slate-200 py-8 px-10">
      <ul className="flex flex-col justify-between h-full">
        <li className="mb-8">
          <Link href="/">
            <Logo />
          </Link>
        </li>
        <div className="flex flex-col gap-5 ">
          <li>
            <Link
              href="/"
              className="flex gap-2 items-center hover:text-lime-600 text-xl"
            >
              <AiOutlineHome />
              <span className="hover:text-slate-950">Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/projects"
              className="flex gap-2 items-center hover:text-lime-600 text-xl"
            >
              <AiOutlineFolder />
              <span className="hover:text-slate-950">Projects</span>
            </Link>
          </li>
          <li>
            <Link
              href="/user"
              className="flex gap-2 items-center hover:text-lime-600 text-xl"
            >
              <AiOutlineUser />
              <span className="hover:text-slate-950">User</span>
            </Link>
          </li>
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
