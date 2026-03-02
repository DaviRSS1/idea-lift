import Button from "@/app/_components/Button";
import CardFeatures from "@/app/_components/CardFeatures";
import ProjectProgress from "@/app/_components/ProjectProgress";
import Spinner from "@/app/_components/Spinner";
import Suggestions from "@/app/_components/Suggestions";
import { auth } from "@/app/_lib/auth";
import { getProject } from "@/app/_lib/data-service";
import { supabase } from "@/app/_lib/supabase";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

type Props = {
  params: { projectID: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { projectID } = await params;
  const project = await getProject(Number(projectID));

  return {
    title: project?.title ?? "Project",
  };
}

export default async function Page({ params }: Props) {
  const { projectID } = await params;

  const [project] = await Promise.all([getProject(Number(projectID))]);

  const session = await auth();

  let canEdit = false;

  if (session) {
    const { data: user } = await supabase
      .from("users")
      .select("id, role, companyId")
      .eq("id", Number(session.user?.id))
      .single();

    if (
      user &&
      user.companyId === project.companyId &&
      (user.role === "owner" || user.role === "manager")
    ) {
      canEdit = true;
    }
  }

  if (!project) return <div className="p-10">Project not found</div>;

  return (
    <div className="space-y-10">
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
      >
        ← Go back
      </Link>
      <ProjectProgress current={project.status} />
      <div className="flex justify-between">
        <div className="flex items-center gap-4 ">
          {project.projectIcon && (
            <span>
              <Image
                src={project.projectIcon}
                width={40}
                height={40}
                alt={project.title}
              />
            </span>
          )}

          <div>
            <h1 className="text-3xl font-semibold">{project.title}</h1>
          </div>
        </div>
        {canEdit && (
          <Button>
            <Link href={`/projects/${projectID}/edit`}>Edit</Link>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-5 gap-10">
        <div className="col-span-3">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 uppercase tracking-wide">
            Description
          </h3>

          {project.description ? (
            <p className="text-slate-700 leading-relaxed whitespace-pre-line">
              {project.description}
            </p>
          ) : (
            <p className="text-slate-400 italic">No description provided.</p>
          )}
        </div>

        <div className="col-span-2 space-y-4">
          <h3 className="mb-3 text-sm font-semibold text-zinc-700 uppercase tracking-wide">
            Features
          </h3>
          <Suspense fallback={<Spinner />}>
            <CardFeatures projectID={projectID} />
          </Suspense>
        </div>
      </div>

      <section className="mt-12">
        <h3 className="mb-3 text-sm font-semibold text-zinc-700 uppercase tracking-wide">
          Suggestions
        </h3>
        <Suspense fallback={<Spinner />}>
          <Suggestions projectID={projectID} />
        </Suspense>
      </section>
    </div>
  );
}
