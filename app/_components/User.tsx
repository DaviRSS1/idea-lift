import Link from "next/link";
import { auth } from "../_lib/auth";
import Image from "next/image";
import { getUserById } from "../_lib/data-service";

export default async function User() {
  const session = await auth();
  const user = session?.user?.id
    ? await getUserById(Number(session.user.id))
    : null;

  return (
    <div>
      {session?.user?.image ? (
        <Link href="/account">
          <Image
            src={user.avatar}
            height={30}
            width={30}
            alt={`Avatar of ${session?.user.name}`}
            className="rounded-full"
          />
        </Link>
      ) : (
        <span>
          <Link href="/login" className="text-xl hover:text-lime-600">
            Login
          </Link>
        </span>
      )}
    </div>
  );
}
