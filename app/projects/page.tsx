import { Metadata } from "next";
import ProjectsSection from "../_components/ProjectsSection";
import { auth } from "../_lib/auth";
import {
  getPublicProjects,
  getCompanyProjects,
  getUserProjects,
  getUserCompanyRole,
} from "../_lib/data-service";
import Button from "../_components/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Page() {
  const session = await auth();

  const publicProjectsPromise = getPublicProjects();
  const companyProjectsPromise = getCompanyProjects(1);

  const userProjectsPromise = session?.user?.id
    ? getUserProjects(Number(session.user.id))
    : Promise.resolve([]);

  const userRolePromise = session?.user?.id
    ? getUserCompanyRole(Number(session.user.id))
    : Promise.resolve(null);

  const [publicProjects, companyProjects, userProjects, userRole] =
    await Promise.all([
      publicProjectsPromise,
      companyProjectsPromise,
      userProjectsPromise,
      userRolePromise,
    ]);

  return (
    <div className="relative">
      {(userRole === "manager" || userRole === "owner") && (
        <div className="absolute top-0 right-0">
          <Link href="/projects/new">
            <Button>Add new project</Button>
          </Link>
        </div>
      )}

      <div>
        <ProjectsSection
          title="All projects"
          projects={publicProjects}
          userId={undefined}
        />

        <ProjectsSection
          title="Your company projects"
          projects={companyProjects}
          userId={session?.user?.id}
        />

        <ProjectsSection
          title="Projects that you are in"
          projects={userProjects}
          userId={session?.user?.id}
        />
      </div>
    </div>
  );
}
