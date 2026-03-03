import { auth } from "@/app/_lib/auth";
import {
  getUserById,
  getUserProjects,
  getNotifications,
  getCompanyData,
} from "@/app/_lib/data-service";
import { supabase } from "@/app/_lib/supabase";
import Welcome from "./_components/Welcome";
import RecentProjectsHome from "./_components/RecentProjectsHome";
import CompanyHome from "./_components/CompanyHome";
import NotificationsHome from "./_components/NotificationsHome";

export default async function Page() {
  const session = await auth();

  if (!session?.user?.id) {
    return <Welcome />;
  }

  const userId = Number(session.user.id);

  const user = await getUserById(userId);

  const [userProjects, notifications] = await Promise.all([
    getUserProjects(userId),
    getNotifications(userId),
  ]);

  const company = user?.companyId
    ? await supabase
        .from("companies")
        .select("*")
        .eq("id", user.companyId)
        .single()
        .then((r) => r.data)
    : null;

  const { members } = user?.companyId
    ? await getCompanyData(user.companyId, userId)
    : { members: [] };

  const recentProjects = userProjects.slice(0, 4);
  const recentNotifications = notifications.slice(0, 5);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const activeProjects = userProjects.filter(
    (p) => p.status === "implementing",
  ).length;

  return (
    <div className="space-y-10 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">
            Good{" "}
            {new Date().getHours() < 12
              ? "morning"
              : new Date().getHours() < 18
                ? "afternoon"
                : "evening"}
            , {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening across your workspace.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Projects you're in",
            value: userProjects.length,
            sub: `${activeProjects} active`,
          },
          {
            label: "Team members",
            value: members?.length ?? 0,
            sub: company?.name ?? "No company",
          },
          {
            label: "Notifications",
            value: unreadCount,
            sub: unreadCount === 0 ? "All caught up" : "unread",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className="border border-slate-200 rounded-xl p-5"
          >
            <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-2">
              {stat.label}
            </p>
            <p className="text-3xl font-semibold text-slate-800">
              {stat.value}
            </p>
            <p className="text-xs text-slate-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-5 gap-8">
        <RecentProjectsHome recentProjects={recentProjects} />

        <div className="col-span-2 space-y-8">
          <CompanyHome company={company} members={members} />
          <NotificationsHome
            unreadCount={unreadCount}
            recentNotifications={recentNotifications}
          />
        </div>
      </div>
    </div>
  );
}
