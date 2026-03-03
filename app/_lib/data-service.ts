import { Project } from "../_types/project";
import { supabase } from "./supabase";

///////// GET

export async function getProjects() {
  const { data, error } = await supabase.from("projects").select("*");

  if (error) {
    throw new Error("Projects could not be loaded");
  }

  return data;
}

export async function getProject(projectId: number) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();

  if (error) {
    throw new Error("Project could not be loaded");
  }

  return data;
}

export async function getProjectFeatures(projectId: number) {
  const { data, error } = await supabase
    .from("projects_features")
    .select("*")
    .eq("projectId", projectId);

  if (error) {
    throw new Error("Project features could not be loaded");
  }

  return data;
}

export async function getProjectFull(projectId: number) {
  const project = await getProject(projectId);
  const features = await getProjectFeatures(projectId);

  const { data: members, error } = await supabase
    .from("project_members")
    .select(
      `
      id,
      projectId,
      user:users (
        id,
        email
      )
    `,
    )
    .eq("projectId", projectId);

  if (error) {
    throw new Error("Project members could not be loaded");
  }

  return {
    ...project,
    features,
    members,
  };
}

export async function getPublicProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("visibility", "public")
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Public projects could not be loaded");
  }

  return data;
}

export async function getCompanyProjects(companyId: number) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("companyId", companyId)
    .order("updated_at", { ascending: false, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error("Company projects could not be loaded");
  }

  return data;
}

export async function getUserProjects(userId: number): Promise<Project[]> {
  const { data, error } = await supabase
    .from("user_projects_view")
    .select("*")
    .eq("userId", userId)
    .order("last_activity", { ascending: false });

  if (error) throw new Error("User projects could not be loaded");

  return data ?? [];
}

export async function getUser(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error("User could not be loaded");
  }

  return data;
}

export async function getUserById(id: number) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error("User could not be loaded");
  }

  return data;
}

export async function getProjectSuggestions(projectId: number) {
  const { data, error } = await supabase
    .from("suggestions")
    .select("*")
    .eq("projectId", projectId)
    .order("upvotesCount", { ascending: false });

  if (error) {
    throw new Error("suggestions could not be loaded");
  }

  return data;
}

//////// CREATE

export async function createUser(newUser: object) {
  const { data, error } = await supabase.from("users").insert([newUser]);

  if (error) {
    console.error(error);
    throw new Error("User could not be created");
  }

  return data;
}

export async function createSuggestion(
  projectID: number,
  content: string,
  authorId: number,
) {
  const { error } = await supabase.from("suggestions").insert([
    {
      projectId: projectID,
      content,
      authorId,
      upvotesCount: 0,
    },
  ]);

  if (error) {
    console.error(error);
    throw new Error("Failed to create suggestion");
  }
}

//////// UPDATE

export type VoteValue = 1 | -1 | 0;

export async function voteSuggestion(
  suggestionId: number,
  userId: number,
  vote: VoteValue,
) {
  if (vote === 0) {
    await supabase
      .from("suggestion_votes")
      .delete()
      .eq("suggestion_id", suggestionId)
      .eq("user_id", userId);
  } else {
    await supabase
      .from("suggestion_votes")
      .upsert(
        { suggestion_id: suggestionId, user_id: userId, vote },
        { onConflict: "suggestion_id,user_id" },
      );
  }

  const { data: voteData, error: sumError } = await supabase
    .from("suggestion_votes")
    .select("vote")
    .eq("suggestion_id", suggestionId);

  if (sumError) throw new Error("Erro ao calcular votos");

  const newScore = voteData?.reduce((acc, curr) => acc + curr.vote, 0) ?? 0;

  const { error: updateError } = await supabase
    .from("suggestions")
    .update({ upvotesCount: newScore })
    .eq("id", suggestionId);

  if (updateError) throw new Error("Erro ao atualizar saldo");

  return { newScore };
}

//////// DELETE

export async function deleteProject(projectID: number) {
  // 1. Delete members
  let { error } = await supabase
    .from("project_members")
    .delete()
    .eq("projectId", projectID);
  if (error) throw error;

  // 2. Delete features
  error = (
    await supabase.from("projects_features").delete().eq("projectId", projectID)
  ).error;
  if (error) throw error;

  // 3. Delete project
  error = (await supabase.from("projects").delete().eq("id", projectID)).error;
  if (error) throw error;
}
