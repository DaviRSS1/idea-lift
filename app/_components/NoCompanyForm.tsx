"use client";

import { useState } from "react";
import { createCompanyAction, requestJoinCompanyAction } from "../_lib/actions";
import Button from "./Button";
import toast from "react-hot-toast";

type Company = { id: number; name: string; domain?: string };
type Tab = "create" | "join";

export default function NoCompanyForm({ companies }: { companies: Company[] }) {
  const [tab, setTab] = useState<Tab>("create");
  const [loading, setLoading] = useState(false);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      await createCompanyAction(formData);
      toast.success("Company created successfully!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleJoin(companyId: number) {
    setLoading(true);
    try {
      await requestJoinCompanyAction(companyId);
      toast.success("Request sent! Wait for the owner to approve.");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-10 space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">
          You&apos;re not in a company yet
        </h2>
        <p className="text-slate-500 text-sm mt-1">
          Create your own or request to join an existing one.
        </p>
      </div>

      <div className="flex border-b border-slate-200">
        {(["create", "join"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
            }}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? "border-lime-600 text-lime-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {t === "create" ? "Create company" : "Join a company"}
          </button>
        ))}
      </div>

      {tab === "create" && (
        <form onSubmit={handleCreate} className="space-y-4">
          {[
            { name: "name", label: "Company name", required: true },
            { name: "domain", label: "Domain", placeholder: "acme.com" },
            { name: "description", label: "Description" },
          ].map(({ name, label, placeholder, required }) => (
            <div key={name}>
              <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                {label}
              </label>
              {name === "description" ? (
                <textarea
                  name={name}
                  rows={3}
                  placeholder={`Enter ${label.toLowerCase()}...`}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none placeholder-slate-400"
                />
              ) : (
                <input
                  name={name}
                  required={required}
                  placeholder={placeholder ?? `Enter ${label.toLowerCase()}...`}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 placeholder-slate-400"
                />
              )}
            </div>
          ))}
          <Button type="submit" className="h-10 w-full" disabled={loading}>
            {loading ? "Creating..." : "Create company"}
          </Button>
        </form>
      )}

      {tab === "join" && (
        <div className="space-y-3">
          {companies.length === 0 && (
            <p className="text-slate-400 italic text-sm">
              No companies available.
            </p>
          )}
          {companies.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-between border border-slate-200 rounded-xl px-5 py-4"
            >
              <div>
                <p className="text-sm font-medium text-slate-800">
                  {company.name}
                </p>
                {company.domain && (
                  <p className="text-xs text-slate-400">{company.domain}</p>
                )}
              </div>
              <Button
                className="h-9 text-sm"
                disabled={loading}
                onClick={() => handleJoin(company.id)}
              >
                Request to join
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
