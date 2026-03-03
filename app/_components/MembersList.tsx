"use client";

import { useState } from "react";
import Image from "next/image";
import { Role } from "../_types/role";
import { User } from "../_types/user";

interface Member {
  id: number;
  userId: number;
  companyId: number;
  role: Role;
  users: User;
}

interface Props {
  members: Member[];
  isOwner: boolean;
  currentUserId: number;
}

const ROLE_LABELS: Record<Role, string> = {
  owner: "Owner",
  manager: "Manager",
  employee: "Employee",
};

const ROLE_STYLES: Record<Role, string> = {
  owner: "bg-lime-100 text-lime-700 border border-lime-200",
  manager: "bg-blue-100 text-blue-700 border border-blue-200",
  employee: "bg-slate-100 text-slate-600 border border-slate-200",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function MembersList({ members, currentUserId }: Props) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");

  const filtered = members.filter((m) => {
    const user = m.users;
    const matchSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "all" || m.role === filterRole;
    return matchSearch && matchRole;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-lime-200"
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value as Role | "all")}
          className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-lime-200 cursor-pointer"
        >
          <option value="all">All roles</option>
          <option value="owner">Owner</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
      </div>

      <p className="text-xs text-slate-400">
        {filtered.length} of {members.length} members
      </p>

      {filtered.length === 0 ? (
        <p className="text-slate-400 italic text-sm py-6">No members found.</p>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {filtered.map((member) => {
            const user = member.users;
            const isCurrentUser = member.userId === currentUserId;

            return (
              <div
                key={member.id}
                className="flex items-center gap-4 px-5 py-4   transition-colors"
              >
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-slate-600 shrink-0 overflow-hidden">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      width={40}
                      height={40}
                      alt={user.name}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    getInitials(user.name)
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-800 truncate">
                      {user.name}
                    </p>
                    {isCurrentUser && (
                      <span className="text-xs text-slate-400">(you)</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 truncate">
                    {user.email}
                  </p>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${ROLE_STYLES[member.role]}`}
                >
                  {ROLE_LABELS[member.role]}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
