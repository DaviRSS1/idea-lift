import { Project } from "../_types/project";
import ProjectCard from "./ProjectCard";

export default async function ProjectsList({
  projects,
}: {
  projects: Project[];
}) {
  return (
    <ul className="flex gap-5 my-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </ul>
  );
}
