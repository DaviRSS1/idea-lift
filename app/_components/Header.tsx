import { auth } from "../_lib/auth";
import Notifications from "./Notifications";
import Search from "./Search";
import User from "./User";

export default async function Header() {
  const session = await auth();

  return (
    <header className="border-b border-slate-200 min-h-20 py-5 px-8 flex  justify-between ">
      <div className="text-xl flex items-center">
        {!session ? "" : <p>Welcome back {session?.user?.name}!</p>}
      </div>
      <div className="items-center flex gap-8">
        <Search />
        <Notifications />
        <User />
      </div>
    </header>
  );
}
