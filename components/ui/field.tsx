import * as React from "react";
import { cn } from "@/lib/utils";

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("mb-1.5 block text-sm font-medium text-ink", className)}
      {...props}
    />
  );
}

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { invalid?: boolean }
>(({ className, invalid, children, ...props }, ref) => (
  <select
    ref={ref}
    aria-invalid={invalid}
    className={cn(
      "h-10 w-full rounded-sm border bg-paper px-3 text-sm text-ink",
      "border-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
      invalid && "border-rust focus-visible:ring-rust",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
>(({ className, invalid, ...props }, ref) => (
  <textarea
    ref={ref}
    aria-invalid={invalid}
    className={cn(
      "w-full min-h-[100px] rounded-sm border bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60",
      "border-line focus:outline-none focus-visible:ring-2 focus-visible:ring-brass",
      invalid && "border-rust focus-visible:ring-rust",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="mt-1 text-xs text-rust">{children}</p>;
}

export function FormField({
  label,
  htmlFor,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      <FieldError>{error}</FieldError>
    </div>
  );
}
