import { Project } from "../_types/project";
import ProjectsList from "./ProjectsList";
import Link from "next/link";

type ProjectsSectionProps = {
  title: string;
  projects: Project[];
  userId: string | undefined;
};

export default function ProjectsSection({
  title,
  projects,
  userId,
}: ProjectsSectionProps) {
  const isPrivateSection = title !== "All projects";

  return (
    <section className="">
      <h2 className="text-2xl font-bold text-zinc-700 uppercase tracking-wide">
        {title}
      </h2>

      {isPrivateSection && !userId ? (
        <div className="p-6 rounded-xl  text-center space-y-3">
          <p className="text-zinc-600">
            You need to be logged in to see this section.
          </p>
          <Link
            href="/login"
            className="inline-block px-4 py-2 rounded-lg bg-zinc-700 text-white text-sm font-medium hover:bg-zinc-800 transition"
          >
            Sign in
          </Link>
        </div>
      ) : projects.length ? (
        <ProjectsList projects={projects} />
      ) : (
        <p className="text-zinc-500 text-sm">No projects found.</p>
      )}
    </section>
  );
}
