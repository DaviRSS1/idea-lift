import Image from "next/image";
import Link from "next/link";
import { AiOutlineFolder } from "react-icons/ai";
import { FiArrowRight } from "react-icons/fi";
import { Project } from "../_types/project";

const STATUS_STYLES: Record<string, string> = {
  implementing: "bg-amber-100 text-amber-600",
  testing: "bg-red-100 text-red-600",
  completed: "bg-lime-100 text-lime-600",
  archived: "bg-gray-100 text-gray-600",
  planning: "bg-blue-100 text-blue-600",
};

export default function RecentProjectsHome({
  recentProjects,
}: {
  recentProjects: Project[];
}) {
  return (
    <div className="col-span-3 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide">
          Recent projects
        </h3>
        <Link
          href="/projects"
          className="text-xs text-lime-600 hover:underline flex items-center gap-1"
        >
          See all <FiArrowRight size={11} />
        </Link>
      </div>

      {recentProjects.length === 0 ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center">
          <AiOutlineFolder size={28} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-400 italic">
            You&apos;re not in any projects yet.
          </p>
          <Link
            href="/projects"
            className="text-xs text-lime-600 hover:underline mt-1 inline-block"
          >
            Browse projects
          </Link>
        </div>
      ) : (
        <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
          {recentProjects.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-lg  flex items-center justify-center shrink-0 overflow-hidden bg-slate-50">
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
                  className={`text-xs font-medium px-2.5 py-1 rounded-full shrink-0 capitalize ${STATUS_STYLES[project.status] ?? "bg-slate-100 text-slate-500"}`}
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
