import { Project } from "../_types/project";
import ProjectsList from "./ProjectsList";

type ProjectsSectionProps = {
  title: string;
  projects: Project[];
};

export default function ProjectsSection({
  title,
  projects,
}: ProjectsSectionProps) {
  if (!projects.length) return null;

  return (
    <section>
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <ProjectsList projects={projects} />
    </section>
  );
}
