"use client";

import { useState, useEffect, useRef } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import Link from "next/link";
import { markAllNotificationsReadAction } from "../_lib/actions";

type Notification = {
  id: number;
  type: string;
  message: string;
  link?: string;
  read: boolean;
  created_at: string;
};

const TYPE_ICONS: Record<string, string> = {
  new_suggestion: "💡",
  join_request: "🙋",
  new_project: "📁",
  added_to_project: "➕",
  request_approved: "✅",
};

export default function NotificationsClient({
  unreadCount,
  userId,
}: {
  unreadCount: number;
  userId: number;
}) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [count, setCount] = useState(unreadCount);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    if (!open) {
      setLoading(true);
      const res = await fetch(`/api/notifications?userId=${userId}`);
      const data = await res.json();
      setNotifications(data);
      setLoading(false);

      if (count > 0) {
        await markAllNotificationsReadAction(userId);
        setCount(0);
      }
    }
    setOpen((prev) => !prev);
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={handleOpen}
        className="relative flex items-center justify-center hover:text-lime-600 transition-colors"
      >
        <IoMdNotificationsOutline size={30} />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-lime-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 z-50 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
            <p className="text-sm font-semibold text-slate-800">
              Notifications
            </p>
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-xs text-lime-600 hover:underline"
            >
              See all
            </Link>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {loading && (
              <p className="text-sm text-slate-400 text-center py-6">
                Loading...
              </p>
            )}
            {!loading && notifications.length === 0 && (
              <p className="text-sm text-slate-400 italic text-center py-6">
                No notifications yet.
              </p>
            )}
            {!loading &&
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={n.link ?? "#"}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 transition-colors ${!n.read ? "bg-lime-50/60" : ""}`}
                >
                  <span className="text-lg mt-0.5 shrink-0">
                    {TYPE_ICONS[n.type] ?? "🔔"}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">
                      {n.message}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {new Date(n.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <span className="w-2 h-2 rounded-full bg-lime-500 shrink-0 mt-1.5" />
                  )}
                </Link>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
