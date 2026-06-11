import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  variant?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function Button({
  children,
  variant = "secondary",
  className = "",
  ...props
}: ButtonProps) {

  return (
    <button
      className={`button ${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </button>
  );
}