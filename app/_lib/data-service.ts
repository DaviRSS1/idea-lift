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
    .eq("project_id", projectId);

  if (error) {
    throw new Error("Project features could not be loaded");
  }

  return data;
}

export async function getPublicProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("visibility", "public");

  if (error) {
    throw new Error("Public projects could not be loaded");
  }

  return data;
}

export async function getCompanyProjects(companyId: number) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("companyId", companyId);

  if (error) {
    throw new Error("Company rojects could not be loaded");
  }

  return data;
}

export async function getUserProjects(userId: number): Promise<Project[]> {
  const { data, error } = await supabase
    .from("project_members")
    .select(`project:projects (*)`)
    .eq("userId", userId);

  if (error) throw new Error("User projects could not be loaded");

  return data?.map((item) => item.project).flat() ?? [];
}

export async function getUser(email: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) {
    throw new Error("Users projects could not be loaded");
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
