"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineFolder } from "react-icons/ai";

type Result = {
  id: number;
  title: string;
  description?: string;
  projectIcon?: string;
  status?: string;
};

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();
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

  useEffect(() => {
    if (query.length < 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResults([]);
      setOpen(false);
      return;
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data);
      setOpen(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timeout);
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && query.length >= 2) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
    if (e.key === "Escape") setOpen(false);
  }

  return (
    <div className="relative" ref={ref}>
      <input
        className="border border-zinc-300 rounded-xl py-2 px-3 w-70 focus:outline-none focus:border-lime-200 focus:ring-1 focus:ring-lime-200 text-sm"
        type="search"
        placeholder="Search for projects..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => results.length > 0 && setOpen(true)}
      />

      {open && (
        <div className="absolute top-11 left-0 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          {loading && (
            <p className="text-xs text-slate-400 text-center py-4">
              Searching...
            </p>
          )}
          {!loading && results.length === 0 && (
            <p className="text-xs text-slate-400 italic text-center py-4">
              No results found.
            </p>
          )}
          {!loading &&
            results.map((r) => (
              <Link
                key={r.id}
                href={`/projects/${r.id}`}
                onClick={() => {
                  setOpen(false);
                  setQuery("");
                }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 transition-colors"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">
                  {r.projectIcon ? (
                    <Image
                      src={r.projectIcon}
                      width={28}
                      height={28}
                      alt={r.title}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <AiOutlineFolder size={14} className="text-slate-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-700 truncate">{r.title}</p>
                  {r.description && (
                    <p className="text-xs text-slate-400 truncate">
                      {r.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          {!loading && results.length > 0 && (
            <button
              onClick={() => {
                setOpen(false);
                router.push(`/search?q=${encodeURIComponent(query)}`);
              }}
              className="w-full text-center text-xs text-lime-600 hover:underline py-2.5 border-t border-slate-100"
            >
              See all results for &quot;{query}&quot;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
