import { auth } from "../_lib/auth";
import { Project } from "../_types/project";
import { getUserProjects } from "../_lib/data-service";
import SidebarClient from "./SidebarClient";

export default async function Sidebar() {
  const session = await auth();

  const userProjects: Project[] = session?.user?.id
    ? await getUserProjects(Number(session.user.id))
    : [];

  return <SidebarClient userProjects={userProjects} session={session} />;
}
