"use client";

import { useState, useTransition } from "react";
import { toast } from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { createSuggestionAction } from "../_lib/actions";

type AddSuggestionFormProps = {
  projectID: number;
  authorId: number;
  onAdded?: () => void;
};

export default function AddSuggestionForm({
  projectID,
  onAdded,
  authorId,
}: AddSuggestionFormProps) {
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!content.trim()) return toast.error("Suggestion cannot be empty");

    startTransition(async () => {
      try {
        await createSuggestionAction(projectID, content, authorId);
        setContent("");
        toast.success("Suggestion added!");
        if (onAdded) onAdded();
      } catch (error) {
        console.error(error);
        toast.error("Failed to add suggestion");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add your suggestion..."
        rows={3}
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:ring-2 focus:ring-lime-200 focus:outline-none focus:border-lime-200"
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-lime-200 text-lime-800 hover:bg-lime-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? <SpinnerMini /> : "Submit Suggestion"}
      </button>
    </form>
  );
}
