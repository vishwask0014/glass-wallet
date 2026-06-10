"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import classNames from "classnames";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary: "theme-button-primary",
  secondary: "theme-button-secondary",
  ghost: "theme-button-ghost border border-transparent bg-transparent",
};

export default function Button({
  children,
  className,
  type = "button",
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={classNames(
        "inline-flex min-h-[3.25rem] items-center justify-center rounded-full px-5 py-3 text-[0.98rem] font-semibold tracking-[-0.015em] backdrop-blur-xl disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
