"use server";

import { revalidatePath } from "next/cache";
import { auth } from "../_lib/auth";
import { FeatureInput } from "../_types/projectsFeatures";
import { supabase } from "./supabase";

export async function createProject(
  formData: FormData,
  features: FeatureInput[],
  members: string[],
) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in.");

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", Number(session.user?.id))
    .single();

  if (!user) throw new Error("User not found.");

  if (user.role !== "owner" && user.role !== "manager") {
    throw new Error("You do not have permission.");
  }

  const image = formData.get("projectIcon") as File;

  const newProject = {
    title: formData.get("title"),
    description: formData.get("description"),
    visibility: formData.get("visibility"),
    status: formData.get("status"),
    companyId: user.companyId,
    createdBy: user.id,
    projectIcon: null,
  };

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert([newProject])
    .select()
    .single();

  if (projectError || !project) {
    console.error(projectError);
    throw new Error("Project could not be created.");
  }

  if (image && image.size > 0) {
    const imageName = `${Date.now()}-${image.name.replaceAll(" ", "-")}`;

    const { error: storageError } = await supabase.storage
      .from("projects-icon")
      .upload(imageName, image);

    if (storageError) {
      await supabase.from("projects").delete().eq("id", project.id);
      console.error(storageError);
      throw new Error("Project icon could not be uploaded.");
    }

    const { error: updateError } = await supabase
      .from("projects")
      .update({
        projectIcon: `https://abulhbcdlpdnicszsgzs.supabase.co/storage/v1/object/public/projects-icon/${imageName}`,
      })
      .eq("id", project.id);

    if (updateError) {
      await supabase.from("projects").delete().eq("id", project.id);
      throw new Error("Project could not be updated with icon.");
    }
  }

  if (features.length > 0) {
    const featuresToInsert = features.map((feature) => ({
      ...feature,
      projectId: project.id,
      userId: user.id,
    }));

    const { error: featuresError } = await supabase
      .from("projects_features")
      .insert(featuresToInsert);

    if (featuresError) {
      await supabase.from("projects").delete().eq("id", project.id);
      throw new Error("Features could not be created.");
    }
  }

  const filteredMembers = members.filter(
    (email) => email !== session.user?.email,
  );

  const { error: memberError } = await supabase.from("project_members").insert({
    projectId: project.id,
    userId: user.id,
  });

  if (memberError) {
    await supabase.from("projects").delete().eq("id", project.id);
    throw new Error("Project member could not be created.");
  }

  if (filteredMembers.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email")
      .in("email", filteredMembers);

    if (!usersError && users.length > 0) {
      const membersToInsert = users.map((u) => ({
        projectId: project.id,
        userId: u.id,
      }));
      await supabase.from("project_members").insert(membersToInsert);
    }
  }

  revalidatePath("/projects");
  return { id: project.id, project };
}

export async function updateProject(
  projectId: number,
  formData: FormData,
  features: FeatureInput[],
  members: string[],
) {
  const session = await auth();

  if (!session) throw new Error("You must be logged in.");

  const { data: user } = await supabase
    .from("users")
    .select("*")
    .eq("id", Number(session.user?.id))
    .single();

  if (!user) throw new Error("User not found.");

  if (user.role !== "owner" && user.role !== "manager") {
    throw new Error("You do not have permission.");
  }

  const image = formData.get("projectIcon") as File;

  const { data: project, error: updateError } = await supabase
    .from("projects")
    .update({
      title: formData.get("title"),
      description: formData.get("description"),
      visibility: formData.get("visibility"),
      status: formData.get("status"),
      updated_at: new Date().toISOString(),
    })
    .eq("id", projectId)
    .select()
    .single();

  if (updateError || !project) {
    console.error(updateError);
    throw new Error("Project could not be updated.");
  }

  if (image && image.size > 0) {
    const imageName = `${Date.now()}-${image.name.replaceAll(" ", "-")}`;

    const { error: storageError } = await supabase.storage
      .from("projects-icon")
      .upload(imageName, image);

    if (storageError) {
      console.error(storageError);
      throw new Error("Project icon could not be uploaded.");
    }

    const { error: iconUpdateError } = await supabase
      .from("projects")
      .update({
        projectIcon: `https://abulhbcdlpdnicszsgzs.supabase.co/storage/v1/object/public/projects-icon/${imageName}`,
      })
      .eq("id", projectId);

    if (iconUpdateError) {
      throw new Error("Project icon could not be updated.");
    }
  }

  await supabase.from("projects_features").delete().eq("projectId", projectId);

  if (features.length > 0) {
    const featuresToInsert = features.map((feature) => ({
      ...feature,
      projectId,
      userId: user.id,
    }));

    const { error: featuresError } = await supabase
      .from("projects_features")
      .insert(featuresToInsert);

    if (featuresError) {
      throw new Error("Features could not be updated.");
    }
  }

  await supabase.from("project_members").delete().eq("projectId", projectId);

  const { error: ownerMemberError } = await supabase
    .from("project_members")
    .insert({
      projectId,
      userId: user.id,
    });

  if (ownerMemberError) {
    throw new Error("Project owner could not be re-added.");
  }
  const filteredMembers = members.filter((email) => email !== user.email);

  if (filteredMembers.length > 0) {
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, email")
      .in("email", filteredMembers); // Usa a lista filtrada aqui

    if (usersError) throw new Error("Members could not be found.");

    if (users && users.length > 0) {
      const membersToInsert = users.map((u) => ({
        projectId,
        userId: u.id,
      }));

      const { error: membersError } = await supabase
        .from("project_members")
        .insert(membersToInsert);

      if (membersError) throw new Error("Members could not be updated.");
    }
  }

  revalidatePath("/projects");

  return { id: projectId, project };
}
