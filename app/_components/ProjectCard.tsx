import Image from "next/image";
import { Project } from "../_types/project";
import ProjectFeatures from "./ProjectFeatures";
import Link from "next/link";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className={`
        relative
        border
        rounded-xl
        p-5
        max-w-2xs
        shadow-sm
        hover:shadow-xl
        transition-all
        hover:scale-102
        duration-200
        ${project.status === "active" && "border-lime-300"}
        ${project.status === "archived" && "border-amber-300"}
        ${project.status === "completed" && "border-blue-300"}
      `}
    >
      <li>
        <span
          className={`
          absolute
          top-3
          right-3
          text-xs
          font-semibold
          px-3
          py-1
          rounded-full
          
        ${project.status === "active" && "bg-lime-100 text-lime-600"}
        ${project.status === "archived" && "bg-amber-100 text-amber-600"}
        ${project.status === "completed" && "bg-blue-100 text-blue-600"}
          
        `}
        >
          {project.status}
        </span>
        <div className="flex items-start gap-3 pr-16">
          {project.projectIcon ? (
            <Image
              width={40}
              height={40}
              src={project.projectIcon}
              alt={`Icon from ${project.title}`}
              className="rounded-md"
            />
          ) : (
            <Image
              width={40}
              height={40}
              src="/idea_lift_icon.png"
              alt={`Icon from ${project.title}`}
              className="rounded-md"
            />
          )}

          <div>
            <h2 className="text-lg font-semibold text-zinc-800 ">
              {project.title}
            </h2>

            <p className="mt-1 text-sm text-zinc-600 line-clamp-3">
              {project.description}
            </p>
          </div>
        </div>
        <ProjectFeatures projectId={project.id} />
      </li>
    </Link>
  );
}
