"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Role } from "../_types/role";
import { User } from "../_types/user";
import { removeMemberAction, updateMemberRoleAction } from "../_lib/actions";

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

export default function MembersList({
  members,
  isOwner,
  currentUserId,
}: Props) {
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState<Role | "all">("all");
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleRoleChange(memberId: number, role: Role) {
    setLoadingId(memberId);
    await updateMemberRoleAction(memberId, role);
    setOpenMenu(null);
    setLoadingId(null);
  }

  async function handleRemove(memberId: number) {
    setLoadingId(memberId);
    await removeMemberAction(memberId);
    setOpenMenu(null);
    setLoadingId(null);
  }

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
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl">
          {filtered.map((member) => {
            const user = member.users;
            const isCurrentUser = member.userId === currentUserId;
            const canManage = isOwner && !isCurrentUser;
            const isLoading = loadingId === member.id;

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
                {canManage && (
                  <div
                    className="relative"
                    ref={openMenu === member.id ? menuRef : null}
                  >
                    <button
                      onClick={() =>
                        setOpenMenu(openMenu === member.id ? null : member.id)
                      }
                      disabled={isLoading}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-40"
                    >
                      {isLoading ? (
                        <span className="block w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
                      ) : (
                        <span className="flex flex-col gap-0.75 items-center">
                          <span className="w-1 h-1 rounded-full bg-current" />
                          <span className="w-1 h-1 rounded-full bg-current" />
                          <span className="w-1 h-1 rounded-full bg-current" />
                        </span>
                      )}
                    </button>

                    {openMenu === member.id && (
                      <div className="absolute right-0 top-9 z-20 bg-white border border-slate-200 rounded-xl shadow-lg py-1 w-44">
                        <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wide">
                          Set role
                        </p>
                        {(["owner", "manager", "employee"] as Role[]).map(
                          (role) => (
                            <button
                              key={role}
                              onClick={() => handleRoleChange(member.id, role)}
                              className={`w-full text-left px-3 py-2 text-sm transition-colors hover:bg-slate-50 flex items-center justify-between ${
                                member.role === role
                                  ? "text-lime-600 font-medium"
                                  : "text-slate-700"
                              }`}
                            >
                              {ROLE_LABELS[role]}
                              {member.role === role && (
                                <span className="text-lime-600">✓</span>
                              )}
                            </button>
                          ),
                        )}
                        <div className="border-t border-slate-100 mt-1 pt-1">
                          <button
                            onClick={() => handleRemove(member.id)}
                            className="w-full text-left px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                          >
                            Remove member
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
