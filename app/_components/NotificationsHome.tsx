import Link from "next/link";

const TYPE_ICONS: Record<string, string> = {
  new_suggestion: "💡",
  join_request: "🙋",
  new_project: "📁",
  added_to_project: "➕",
  request_approved: "✅",
};

type Notification = {
  id: number;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationsHome({
  unreadCount,
  recentNotifications,
}: {
  unreadCount: number;
  recentNotifications: Notification[];
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Notifications
        </h3>
        {unreadCount > 0 && (
          <span className="text-xs font-medium bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">
            {unreadCount} new
          </span>
        )}
      </div>

      {recentNotifications.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center">
          <p className="text-sm text-slate-400 italic">No notifications yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {recentNotifications.map((n) => (
            <Link
              key={n.id}
              href={n.link ?? "#"}
              className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${!n.read ? "bg-lime-50/50" : ""}`}
            >
              <span className="text-base shrink-0 mt-0.5">
                {TYPE_ICONS[n.type] ?? "🔔"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                  {n.message}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {timeAgo(n.created_at)}
                </p>
              </div>
              {!n.read && (
                <span className="w-1.5 h-1.5 rounded-full bg-lime-500 shrink-0 mt-1.5" />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
