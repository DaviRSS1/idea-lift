import { auth } from "../_lib/auth";
import { getUserById } from "../_lib/data-service";
import Notifications from "./Notifications";
import Search from "./Search";
import User from "./User";

export default async function Header() {
  const session = await auth();
  const user = session?.user?.id
    ? await getUserById(Number(session.user.id))
    : null;

  return (
    <header className="border-b border-slate-200 min-h-20 py-5 px-8 flex  justify-between ">
      <div className="text-xl flex items-center">
        {user && <p>Welcome back, {user.name}!</p>}
      </div>
      <div className="items-center flex gap-8">
        <Search />
        <Notifications />
        <User />
      </div>
    </header>
  );
}
