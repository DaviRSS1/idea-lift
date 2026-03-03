"use client";

import { useState } from "react";
import { leaveCompanyAction } from "../_lib/actions";

export default function ButtonLeaveCompany({
  userId,
  companyId,
}: {
  userId: number;
  companyId: number;
}) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleLeave() {
    setLoading(true);
    try {
      await leaveCompanyAction(userId, companyId);
    } catch {
      setLoading(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-500">Are you sure?</span>
        <button
          onClick={handleLeave}
          disabled={loading}
          className="px-4 py-2 text-sm font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? "Leaving..." : "Yes, leave"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="h-10 px-4 text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
    >
      Leave company
    </button>
  );
}
