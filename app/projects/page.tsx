import ProjectsSection from "../_components/ProjectsSection";
import { auth } from "../_lib/auth";
import {
  getPublicProjects,
  getCompanyProjects,
  getUserProjects,
} from "../_lib/data-service";

export default async function Page() {
  const session = await auth();

  const [publicProjects, companyProjects, userProjects] = await Promise.all([
    getPublicProjects(),
    getCompanyProjects(1),
    session?.user?.id
      ? getUserProjects(Number(session.user.id))
      : Promise.resolve([]),
  ]);

  return (
    <>
      <ProjectsSection title="All projects" projects={publicProjects} />

      <ProjectsSection
        title="Your company projects"
        projects={companyProjects}
      />

      <ProjectsSection
        title="Projects that you are in"
        projects={userProjects}
      />
    </>
  );
}
