import Link from "next/link";
import { IoMdNotificationsOutline } from "react-icons/io";

export default function Notifications() {
  return (
    <div
      className="
      flex 
      items-center 
      justify-center
    "
    >
      <Link href="/notifications" className="hover:text-lime-600">
        <IoMdNotificationsOutline size={30} />
      </Link>
    </div>
  );
}
