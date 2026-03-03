import { supabase } from "@/app/_lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { AiOutlineFolder } from "react-icons/ai";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: rawQ } = await searchParams;
  const q = rawQ ?? "";

  const { data: results } =
    q.length >= 2
      ? await supabase
          .from("projects")
          .select("id, title, description, projectIcon, status")
          .or(`title.ilike.%${q}%,description.ilike.%${q}%`)
          .eq("visibility", "public")
      : { data: [] };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-semibold">Search</h1>
        {q && (
          <p className="text-sm text-slate-500 mt-1">
            {results?.length ?? 0} results for &quot;{q}&quot;
          </p>
        )}
      </div>

      {!q && (
        <p className="text-slate-400 italic text-sm">
          Type something to search.
        </p>
      )}

      {q && results?.length === 0 && (
        <p className="text-slate-400 italic text-sm">
          No projects found for &quot;{q}&quot;.
        </p>
      )}

      {results && results.length > 0 && (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {results.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">
                {project.projectIcon ? (
                  <Image
                    src={project.projectIcon}
                    width={36}
                    height={36}
                    alt={project.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <AiOutlineFolder size={18} className="text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 truncate">
                  {project.title}
                </p>
                {project.description && (
                  <p className="text-xs text-slate-400 truncate mt-0.5">
                    {project.description}
                  </p>
                )}
              </div>
              {project.status && (
                <span
                  className={`text-xs font-semibold px-3 py-1 rounded-full capitalize 
                    ${project.status === "completed" && "bg-lime-100 text-lime-600"}
                    ${project.status === "implementing" && "bg-amber-100 text-amber-600"}
                    ${project.status === "testing" && "bg-red-100 text-red-600"}
                    ${project.status === "planning" && "bg-blue-100 text-blue-600"}
                    ${project.status === "archived" && "bg-gray-100 text-gray-600"}
                    `}
                >
                  {project.status}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
