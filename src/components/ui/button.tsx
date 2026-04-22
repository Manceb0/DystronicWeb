import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** cn utility */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Button variants
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "solid" | "outline" | "ghost" | "cyan" | "green" | "orange";
    size?: "sm" | "md" | "lg";
    className?: string;
    asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "solid", size = "md", ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-medium tracking-wide transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-full";

        const variants = {
            solid: "bg-white text-[#09090b] hover:bg-gray-200",
            outline: "border border-white/20 bg-transparent hover:bg-white/5",
            ghost: "hover:bg-white/5 text-gray-300 hover:text-white",
            cyan: "border border-blue-500/50 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]",
            green: "border border-teal-500/50 text-teal-400 bg-teal-500/10 hover:bg-teal-500/20 hover:shadow-[0_0_20px_rgba(20,184,166,0.3)]",
            orange: "bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:from-indigo-400 hover:to-purple-500 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] border-none"
        };

        const sizes = {
            sm: "h-8 px-4 text-xs",
            md: "h-10 px-6 text-sm",
            lg: "h-12 px-8 text-base",
        };

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
