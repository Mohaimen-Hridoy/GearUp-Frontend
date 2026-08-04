import * as React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-moss text-ink hover:bg-moss-dark active:bg-moss-dark disabled:bg-moss/50",
  secondary:
    "bg-brass text-canvas hover:bg-brass-dark active:bg-brass-dark disabled:bg-brass/50",
  outline:
    "bg-transparent border border-line text-ink hover:bg-paper-dim disabled:opacity-50",
  ghost: "bg-transparent text-ink hover:bg-paper-dim disabled:opacity-50",
  danger: "bg-rust text-ink hover:bg-rust/85 disabled:bg-rust/50",
};

const sizeClasses = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

/** For rendering button-styled links (e.g. <Link className={buttonVariants(...)}>)
 *  since <a> can't nest inside <button>. */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-150 active:scale-[0.98]",
    variantClasses[variant],
    sizeClasses[size],
    className
  );
}


export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading, disabled, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-all duration-150 active:scale-[0.98]",
          "disabled:cursor-not-allowed disabled:active:scale-100",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
