"use client";

import { useState } from "react";
import Button from "@/app/_components/Button";
import { deleteCompanyAction, updateCompany } from "../_lib/actions";

interface Company {
  id: number;
  name: string;
  domain?: string;
  description?: string;
  logo?: string;
  website?: string;
  location?: string;
}

export default function ButtonEditCompany({ company }: { company: Company }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    await updateCompany(company.id, formData);
    setLoading(false);
    setOpen(false);
  }

  const fields = [
    { key: "name" as keyof Company, label: "Name", required: true },
    { key: "domain" as keyof Company, label: "Domain" },
    { key: "website" as keyof Company, label: "Website" },
    { key: "location" as keyof Company, label: "Location" },
  ];

  return (
    <>
      <Button className="h-10" onClick={() => setOpen(true)}>
        Edit Company
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">
                Edit Company
              </h2>
              <button
                onClick={() => setOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xl leading-none"
              >
                x
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
              {fields.map(({ key, label, required }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                    {label}
                  </label>
                  <input
                    name={key}
                    defaultValue={(company[key] as string) ?? ""}
                    required={required}
                    className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300"
                    placeholder={`Enter ${label.toLowerCase()}...`}
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wide mb-1.5">
                  Description
                </label>
                <textarea
                  name="description"
                  defaultValue={company.description ?? ""}
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300 resize-none"
                  placeholder="Enter description..."
                />
              </div>

              <div className="px-6 pb-4 border-t border-slate-100 pt-4">
                <button
                  type="button"
                  onClick={async () => {
                    if (
                      confirm(
                        "Are you sure you want to delete this company? This action cannot be undone.",
                      )
                    ) {
                      await deleteCompanyAction(company.id);
                    }
                  }}
                  className="text-sm text-red-500 hover:text-red-700 transition-colors"
                >
                  Delete company
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm text-slate-500 hover:text-slate-700"
                >
                  Cancel
                </button>
                <Button type="submit" className="h-10" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
