"use client";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-bronze text-ink hover:bg-bronze-dim hover:shadow-[0_0_24px_rgba(212,165,116,0.2)]",
  ghost:
    "border border-surface-raised text-paper hover:border-bronze hover:text-bronze",
  danger: "bg-ember/20 text-ember border border-ember/30 hover:bg-ember/30",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-4 py-2 text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
