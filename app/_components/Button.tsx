import { ButtonHTMLAttributes } from "react";

type ButtonProps = {
  children: React.ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center
        px-4 py-2
        rounded-lg
        text-sm font-medium
        bg-lime-200 text-lime-800
        hover:bg-lime-300
        transition-colors
        cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className ?? ""}
      `}
      {...props}
    >
      {children}
    </button>
  );
}
