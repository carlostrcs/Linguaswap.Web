import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {
  const variantClass = variant === "primary" ? "buttonPrimary" : "";

  return (
    <button
      className={`button ${variantClass} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}