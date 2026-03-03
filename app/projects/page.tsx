import { Metadata } from "next";
import ProjectsSection from "../_components/ProjectsSection";
import { auth } from "../_lib/auth";
import {
  getPublicProjects,
  getCompanyProjects,
  getUserProjects,
  getUserCompanyRole,
  getUserById,
} from "../_lib/data-service";
import Button from "../_components/Button";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Projects",
};

export default async function Page() {
  const session = await auth();

  const userId = session?.user?.id ? Number(session.user.id) : null;

  const [publicProjects, userProjects, userRole, user] = await Promise.all([
    getPublicProjects(),
    userId ? getUserProjects(userId) : Promise.resolve([]),
    userId ? getUserCompanyRole(userId) : Promise.resolve(null),
    userId ? getUserById(userId) : Promise.resolve([]),
  ]);

  const companyProjects = userRole
    ? await getCompanyProjects(user.companyId)
    : [];

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
