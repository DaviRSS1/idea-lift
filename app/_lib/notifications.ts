import { supabase } from "./supabase";

export async function notifyNewSuggestion(
  projectId: number,
  authorName: string,
) {
  // busca todos os membros do projeto
  const { data: members } = await supabase
    .from("project_members")
    .select("userId")
    .eq("projectId", projectId);

  if (!members?.length) return;

  const notifications = members.map((m) => ({
    userId: m.userId,
    type: "new_suggestion",
    message: `${authorName} submitted a new suggestion on a project you're in.`,
    link: `/projects/${projectId}`,
  }));

  await supabase.from("notifications").insert(notifications);
}

export async function notifyJoinRequest(
  companyId: number,
  requesterName: string,
) {
  // notifica owners e managers da company
  const { data: members } = await supabase
    .from("company_members")
    .select("userId, role")
    .eq("companyId", companyId)
    .in("role", ["owner", "manager"]);

  if (!members?.length) return;

  const notifications = members.map((m) => ({
    userId: m.userId,
    type: "join_request",
    message: `${requesterName} requested to join your company.`,
    link: `/company`,
  }));

  await supabase.from("notifications").insert(notifications);
}

export async function notifyNewProject(
  companyId: number,
  projectTitle: string,
  projectId: number,
  creatorId: number,
) {
  // notifica todos da company exceto quem criou
  const { data: members } = await supabase
    .from("company_members")
    .select("userId")
    .eq("companyId", companyId)
    .neq("userId", creatorId);

  if (!members?.length) return;

  const notifications = members.map((m) => ({
    userId: m.userId,
    type: "new_project",
    message: `A new project "${projectTitle}" was created in your company.`,
    link: `/projects/${projectId}`,
  }));

  await supabase.from("notifications").insert(notifications);
}

export async function notifyAddedToProject(
  userId: number,
  projectTitle: string,
  projectId: number,
) {
  await supabase.from("notifications").insert([
    {
      userId,
      type: "added_to_project",
      message: `You were added to the project "${projectTitle}".`,
      link: `/projects/${projectId}`,
    },
  ]);
}

export async function notifyRequestApproved(
  userId: number,
  companyName: string,
) {
  await supabase.from("notifications").insert([
    {
      userId,
      type: "request_approved",
      message: `Your request to join "${companyName}" was approved!`,
      link: `/company`,
    },
  ]);
}
