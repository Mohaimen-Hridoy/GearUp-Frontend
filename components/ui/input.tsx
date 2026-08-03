import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, invalid, ...props }, ref) => {
    return (
      <input
        ref={ref}
        aria-invalid={invalid}
        className={cn(
          "h-10 w-full rounded-sm border bg-paper px-3 text-sm text-ink placeholder:text-ink-soft/60",
          "border-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
          invalid && "border-rust focus-visible:ring-rust",
          "disabled:cursor-not-allowed disabled:opacity-60",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";
