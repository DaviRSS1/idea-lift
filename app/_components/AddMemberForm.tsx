"use client";

import { useState } from "react";
import { addCompanyMember } from "@/app/_lib/actions";
import Button from "./Button";

export default function AddMemberForm({ companyId }: { companyId: number }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData(e.currentTarget);
      await addCompanyMember(companyId, formData);
      setSuccess(true);
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5">
            Email
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="user@email.com"
            className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm  focus:outline-none focus:ring-2 focus:ring-lime-200 placeholder-slate-400"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide mb-1.5">
            Role
          </label>
          <select
            name="role"
            required
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm  focus:outline-none focus:ring-2 focus:ring-lime-200  cursor-pointer"
          >
            <option value="employee">Employee</option>
            <option value="manager">Manager</option>
            <option value="owner">Owner</option>
          </select>
        </div>

        <Button type="submit" className="h-10" disabled={loading}>
          {loading ? "Adding..." : "Add member"}
        </Button>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && (
        <p className="text-sm text-green-600">Member added successfully.</p>
      )}
    </form>
  );
}
