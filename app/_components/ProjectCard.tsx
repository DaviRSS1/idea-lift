import Image from "next/image";
import { Project } from "../_types/project";
import Link from "next/link";
import ProjectFeatures from "./ProjectFeatures";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <li className="shrink-0 w-80 flex">
      <Link
        href={`/projects/${project.id}`}
        className={`
          relative
          flex 
          flex-col
          w-full
          border
          rounded-xl
          p-5
          shadow-sm
          hover:shadow-xl
          transition-all
          hover:scale-101
          duration-200
          ${project.status === "implementing" && "border-amber-300"}
          ${project.status === "archived" && "border-gray-400"}
          ${project.status === "planning" && "border-blue-300"}
          ${project.status === "testing" && "border-red-300"}
          ${project.status === "completed" && "border-lime-300"}
        `}
      >
        <span
          className={`absolute top-3 right-3 text-xs font-semibold px-3 py-1 rounded-full 
          ${project.status === "completed" && "bg-lime-100 text-lime-600"}
          ${project.status === "implementing" && "bg-amber-100 text-amber-600"}
          ${project.status === "testing" && "bg-red-100 text-red-600"}
          ${project.status === "planning" && "bg-blue-100 text-blue-600"}
          ${project.status === "archived" && "bg-gray-100 text-gray-600"}
        `}
        >
          {project.status}
        </span>

        <div className="flex items-start gap-3 pr-16 flex-1">
          <div className="shrink-0">
            <Image
              width={40}
              height={40}
              src={project.projectIcon || "/idea_lift_icon.png"}
              alt={`Icon from ${project.title}`}
              className="rounded-md"
            />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-zinc-700 mt-4">
              {project.title}
            </h2>
            <p className="mt-1 text-sm text-zinc-600 line-clamp-3 break-words">
              {project.description}
            </p>
          </div>
        </div>

        <div className="mt-4">
          <ProjectFeatures projectId={project.id} />
        </div>
      </Link>
    </li>
  );
}
