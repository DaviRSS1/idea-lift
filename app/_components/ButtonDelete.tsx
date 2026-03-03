"use client";
import { ButtonHTMLAttributes } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";
import SpinnerMini from "./SpinnerMini";
import { deleteProjectAction } from "../_lib/actions";

type ButtonDeleteProps = {
  projectID: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function ButtonDelete({
  projectID,
  className,
  ...props
}: ButtonDeleteProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);

  async function handleClick() {
    const confirmed = confirm(
      "Are you sure you want to delete this project? This action cannot be undone.",
    );
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      await deleteProjectAction(Number(projectID));
      toast.success("Project deleted successfully");
      router.push("/projects");
    } catch (error) {
      toast.error("Something went wrong while deleting");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      className={`
        inline-flex items-center justify-center
        px-4 py-2
        rounded-lg
        text-sm font-medium
        bg-red-200 text-red-800
        hover:bg-red-300
        transition-colors
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className ?? ""}
      `}
      onClick={handleClick}
      disabled={isDeleting}
      {...props}
    >
      {isDeleting ? <SpinnerMini /> : "Delete"}
    </button>
  );
}
