"use client";

import { useState } from "react";
import Image from "next/image";
import { approveRequestAction, rejectRequestAction } from "../_lib/actions";

type RequestUser = { id: number; name: string; email: string; avatar?: string };
type Request = {
  id: number;
  userId: number;
  companyId: number;
  users: RequestUser;
};

export default function CompanyRequests({
  requests,
  companyId,
}: {
  requests: Request[];
  companyId: number;
}) {
  const [loading, setLoading] = useState<number | null>(null);

  if (requests.length === 0) return null;

  async function handleApprove(request: Request) {
    setLoading(request.id);
    try {
      await approveRequestAction(request.id, request.userId, companyId);
    } finally {
      setLoading(null);
    }
  }

  async function handleReject(requestId: number) {
    setLoading(requestId);
    try {
      await rejectRequestAction(requestId);
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Pending requests
        </h3>
        <span className="text-xs font-medium bg-lime-100 text-lime-700 px-2 py-0.5 rounded-full">
          {requests.length}
        </span>
      </div>

      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
        {requests.map((request) => {
          const user = request.users;
          const isThis = loading === request.id;

          return (
            <div
              key={request.id}
              className="flex items-center gap-4 px-5 py-4 bg-white hover:bg-slate-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0 overflow-hidden">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    width={40}
                    height={40}
                    alt={user.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  user.name?.[0]?.toUpperCase()
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {user.name}
                </p>
                <p className="text-xs text-slate-400 truncate">{user.email}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  disabled={isThis}
                  onClick={() => handleApprove(request)}
                  className="px-3 py-1.5 text-xs font-medium bg-lime-500 hover:bg-lime-600 text-white rounded-lg transition-colors disabled:opacity-50"
                >
                  {isThis ? "..." : "Approve"}
                </button>
                <button
                  disabled={isThis}
                  onClick={() => handleReject(request.id)}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
