import ProjectForm from "@/app/_components/ProjectForm";
import { getProjectFull } from "@/app/_lib/data-service";

type Props = {
  params: { projectID: string };
};

export default async function Page({ params }: Props) {
  const { projectID } = await params;
  const project = await getProjectFull(Number(projectID));

  if (!project) return <div>Not found</div>;

  return <ProjectForm mode="edit" initialData={project} />;
}
