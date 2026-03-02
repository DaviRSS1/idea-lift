import { Project } from "../_types/project";
import ProjectCard from "./ProjectCard";

export default async function ProjectsList({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <ul className="flex gap-5 mb-5 overflow-x-auto w-full pb-4 custom-scrollbar py-3 px-2">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
