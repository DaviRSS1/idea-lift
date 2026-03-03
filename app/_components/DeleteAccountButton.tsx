"use client";

import { useState } from "react";
import { deleteAccountAction } from "../_lib/actions";

export default function DeleteAccountButton({ userId }: { userId: number }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      await deleteAccountAction(userId);
    } catch {
      setLoading(false);
    }
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs text-slate-500 whitespace-nowrap">
          Are you sure?
        </span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-3 py-1.5 text-xs font-medium bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors disabled:opacity-50 whitespace-nowrap"
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="shrink-0 px-4 py-2 text-sm font-medium border border-red-200 text-red-500 hover:bg-red-50 rounded-lg transition-colors whitespace-nowrap"
    >
      Delete account
    </button>
  );
}
