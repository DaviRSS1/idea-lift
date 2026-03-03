import { auth } from "@/app/_lib/auth";
import { getUserById } from "@/app/_lib/data-service";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import UpdateProfileForm from "../_components/UpdateProfileForm";
import DeleteAccountButton from "../_components/DeleteAccountButton";

export const metadata: Metadata = { title: "Account" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await getUserById(Number(session.user.id));
  if (!user) redirect("/login");

  return (
    <div className="space-y-10 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold">Account</h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage your profile and preferences.
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="w-16 h-16 rounded-full overflow-hidden border border-slate-200 shrink-0">
          {user.avatar ? (
            <Image
              src={user.avatar}
              width={64}
              height={64}
              alt={user.name}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center text-xl font-semibold text-slate-500">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-800">{user.name}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Profile info
        </h3>
        <UpdateProfileForm user={user} />
      </section>

      <section className="space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-red-400">
          Danger zone
        </h3>
        <div className="border border-red-200 rounded-xl p-5 flex items-center justify-between gap-6">
          <div>
            <p className="text-sm font-medium">Delete account</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Permanently delete your account and all associated data. This
              cannot be undone.
            </p>
          </div>
          <DeleteAccountButton userId={user.id} />
        </div>
      </section>
    </div>
  );
}
