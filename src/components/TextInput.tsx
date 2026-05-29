import { forwardRef, type InputHTMLAttributes } from "react";

type TextInputProps = {
  value: string;
  onValueChange: (value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  function TextInput(
    {
      value,
      onValueChange,
      className = "",
      type = "text",
      ...props
    },
    ref
  ) {
    return (
      <input
        {...props}
        ref={ref}
        type={type}
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        className={`input ${className}`.trim()}
      />
    );
  }
);