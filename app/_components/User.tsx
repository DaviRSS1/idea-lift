import Link from "next/link";

export default function User() {
  return (
    <div>
      <span>
        <Link href="/login" className="text-xl hover:text-lime-600">
          Login
        </Link>
      </span>
    </div>
  );
}
