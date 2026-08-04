import * as React from "react";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  initials?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export function Avatar({ src, alt, initials, size = "md", className, ...props }: AvatarProps) {
  if (src) {
    return (
      <div
        className={`relative overflow-hidden rounded-full bg-paper-dim ${sizeClasses[size]} ${className || ""}`}
        {...props}
      >
        <img
          src={src}
          alt={alt || "Avatar"}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-center rounded-full bg-moss text-ink ${sizeClasses[size]} ${className || ""}`}
      {...props}
    >
      {initials || "?".slice(0, 2)}
    </div>
  );
}
