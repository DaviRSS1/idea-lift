"use client";

import { useState, useTransition } from "react";
import Button from "@/app/_components/Button";
import { createProject, updateProject } from "@/app/_lib/actions";
import { FeatureInput } from "@/app/_types/projectsFeatures";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { ProjectFull } from "../_types/projectFull";
import SpinnerMini from "./SpinnerMini";

const colors = [
  "green",
  "blue",
  "purple",
  "red",
  "orange",
  "pink",
  "teal",
  "yellow",
  "gray",
] as const;

type ProjectFormProps = {
  initialData?: ProjectFull;
  mode: "create" | "edit";
};

export default function ProjectForm({ initialData, mode }: ProjectFormProps) {
  const [isPending, startTransition] = useTransition();
  const [features, setFeatures] = useState<FeatureInput[]>(
    initialData?.features ?? [],
  );
  const [members, setMembers] = useState(
    initialData?.members?.map((m) => m.user.email) ?? [],
  );
  const [memberEmail, setMemberEmail] = useState("");

  function addFeature() {
    setFeatures((prev) => [
      ...prev,
      { title: "", description: "", color: "green" },
    ]);
  }

  function removeFeature(index: number) {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }

  function updateFeature(
    index: number,
    field: keyof FeatureInput,
    value: string,
  ) {
    setFeatures((prev) =>
      prev.map((feature, i) =>
        i === index ? { ...feature, [field]: value } : feature,
      ),
    );
  }

  function addMember() {
    if (!memberEmail) return;

    setMembers((prev) => [...prev, memberEmail]);
    setMemberEmail("");
  }

  function removeMember(email: string) {
    setMembers((prev) => prev.filter((m) => m !== email));
  }

  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    if (features.length === 0) {
      toast.error("Add at least one feature before submitting");
      return;
    }

    startTransition(async () => {
      try {
        let result;

        if (mode === "edit" && initialData) {
          result = await updateProject(
            initialData.id,
            formData,
            features,
            members,
          );
          toast.success("Project updated successfully");
        } else {
          result = await createProject(formData, features, members);
          toast.success("Project created successfully");
        }

        router.push(`/projects/${result.id}`);
      } catch (error) {
        toast.error("Something went wrong");
        console.error(error);
      }
    });
  }

  return (
    <div className="space-y-8 ">
      <h1 className="text-3xl font-bold tracking-tight">
        {mode === "edit" ? "Edit project" : "Add new project"}
      </h1>

      <form className="space-y-6" action={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Project title
          </label>
          <input
            name="title"
            required
            defaultValue={initialData?.title ?? ""}
            placeholder="Ex: Employee Feedback System"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-lime-200 focus:border-lime-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Description
          </label>
          <textarea
            name="description"
            required
            defaultValue={initialData?.description ?? ""}
            rows={4}
            placeholder="Describe the purpose of this project..."
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-lime-200 focus:border-lime-200"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Visibility
          </label>
          <select
            name="visibility"
            defaultValue={initialData?.visibility ?? "private"}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-lime-200 focus:border-lime-200"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">Status</label>
          <select
            name="status"
            defaultValue={initialData?.status ?? "planning"}
            required
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-lime-200 focus:border-lime-200"
          >
            <option value="planning">Planning</option>
            <option value="implementing">Implementing</option>
            <option value="testing">Testing</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-medium">Members</h2>

          <div className="flex gap-2">
            <input
              type="email"
              value={memberEmail}
              onChange={(e) => setMemberEmail(e.target.value)}
              placeholder="member@email.com"
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:outline-none focus:ring-lime-200 focus:border-lime-200"
            />
            <button
              type="button"
              onClick={addMember}
              className="px-3 py-2 bg-lime-200 text-lime-800 rounded-md hover:bg-lime-300 text-sm"
            >
              Add
            </button>
          </div>

          <div className="space-y-2">
            {members.map((email) => (
              <div
                key={email}
                className="flex justify-between items-center bg-zinc-100 px-3 py-2 rounded-md text-sm"
              >
                {email}
                <button
                  type="button"
                  onClick={() => removeMember(email)}
                  className="text-red-500 hover:underline"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Features</h2>
            <button
              type="button"
              onClick={addFeature}
              className="px-3 py-2 bg-lime-200 text-lime-800 rounded-md hover:bg-lime-300 text-sm"
            >
              + Add Feature
            </button>
          </div>

          {features.map((feature, index) => (
            <div
              key={index}
              className="border border-zinc-200 rounded-xl p-4 space-y-4 "
            >
              <div>
                <label className="block text-sm font-medium mb-1">
                  Feature Title
                </label>
                <input
                  type="text"
                  value={feature.title}
                  onChange={(e) =>
                    updateFeature(index, "title", e.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={feature.description}
                  onChange={(e) =>
                    updateFeature(index, "description", e.target.value)
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-lime-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Color</label>
                <select
                  value={feature.color}
                  onChange={(e) =>
                    updateFeature(
                      index,
                      "color",
                      e.target.value as FeatureInput["color"],
                    )
                  }
                  className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-lime-400"
                >
                  {colors.map((color) => (
                    <option key={color} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-sm text-red-500 hover:underline cursor-pointer"
              >
                Remove feature
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-700">
            Project Icon
          </label>
          <input
            name="projectIcon"
            type="file"
            accept="image/*"
            className="block w-full text-sm text-zinc-600
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-medium
              file:bg-lime-200 file:text-lime-800
              file:cursor-pointer
              hover:file:bg-lime-300"
          />
        </div>

        <div className="pt-4 flex justify-end">
          <Button type="submit">
            {isPending ? (
              <SpinnerMini />
            ) : mode === "edit" ? (
              "Update project"
            ) : (
              "Create project"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
