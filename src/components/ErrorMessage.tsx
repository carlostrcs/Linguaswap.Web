import type { HTMLAttributes } from "react";

type ErrorMessageProps = {
  message: string | null | undefined;
  prefix?: string;
} & HTMLAttributes<HTMLParagraphElement>;

export function ErrorMessage({
  message,
  prefix = "Error:",
  className = "",
  ...props
}: ErrorMessageProps) {
  if (!message) return null;

  return (
    <p className={`errorText ${className}`.trim()} {...props}>
      {prefix} {message}
    </p>
  );
}