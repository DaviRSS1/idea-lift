"use client";

import Notifications from "./Notifications";
import Search from "./Search";
import User from "./User";

export default function Header() {
  return (
    <header className="border-b border-slate-200 min-h-20 py-5 px-12 flex  justify-between ">
      <div className="text-xl flex">
        <p>Welcome Back %%%USER%%%!</p>
      </div>
      <div className="items-center flex gap-8">
        <Search />
        <Notifications />
        <User />
      </div>
    </header>
  );
}
