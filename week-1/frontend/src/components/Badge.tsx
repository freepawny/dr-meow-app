/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type BadgeSize = "medium" | "small" | "tiny";
export type BadgeState = "default" | "success" | "info" | "warning" | "error";
export type BadgeStyle = "outline" | "filled";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: BadgeSize;
    badgeState?: BadgeState;
    variantStyle?: BadgeStyle;
    label?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    showText?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export const Badge: React.FC<BadgeProps> = ({
    size = "medium",
    badgeState = "default",
    variantStyle = "outline",
    label = "Label",
    leftIcon,
    rightIcon,
    showText = true,
    className,
    ...props
}) => {
    // Mapping ukuran (Size)
    const sizeClasses = {
        medium: "h-6 px-2 gap-2",
        small: "h-6 px-2 gap-2",
        tiny: "h-4 px-2 gap-2"
    };

    const textClasses = {
        medium: "font-quicksand font-bold text-b3 leading-none", // 14px
        small: "font-quicksand font-bold text-c1 leading-none", // 12px
        tiny: "font-quicksand font-bold text-c3 leading-none" // 10px
    };

    // Mapping warna State & Style
    const getStateColors = (state: BadgeState, style: BadgeStyle) => {
        if (style === "filled") {
            const baseFilled = "text-text-primary-white border-transparent";
            switch (state) {
                case "default":
                    return cn("bg-primary-500", baseFilled);
                case "success":
                    return cn("bg-text-success", baseFilled);
                case "info":
                    return cn("bg-text-info", baseFilled);
                case "warning":
                    return cn("bg-text-warning", baseFilled);
                case "error":
                    return cn("bg-text-error", baseFilled);
            }
        } else {
            // Outline style
            const baseOutline = "bg-transparent border";
            switch (state) {
                case "default":
                    return cn("text-primary-700 border-primary-500", baseOutline);
                case "success":
                    return cn("text-text-success border-text-success", baseOutline);
                case "info":
                    return cn("text-text-info border-text-info", baseOutline);
                case "warning":
                    return cn("text-text-warning border-text-warning", baseOutline);
                case "error":
                    return cn("text-text-error border-text-error", baseOutline);
            }
        }
    };

    const colorClasses = getStateColors(badgeState, variantStyle);

    // Karena icon bawaan text color harus menyesuaikan state
    const iconWrapperClasses = variantStyle === "filled" ? "text-white" : "";

    return (
        <div
            className={cn(
                "inline-flex items-center justify-center rounded-full transition-colors",
                sizeClasses[size],
                colorClasses,
                className
            )}
            {...props}
        >
            {leftIcon && (
                <span
                    className={cn(
                        "flex shrink-0 items-center justify-center [&>svg]:size-full",
                        size === "tiny" ? "w-4 h-4" : "w-5 h-5",
                        iconWrapperClasses
                    )}
                >
                    {leftIcon}
                </span>
            )}

            {showText && label && (
                <div className="flex items-center justify-center">
                    <span className={cn(textClasses[size])}>{label}</span>
                </div>
            )}

            {rightIcon && (
                <span
                    className={cn(
                        "flex shrink-0 items-center justify-center [&>svg]:size-full",
                        size === "tiny" ? "w-4 h-4" : "w-6 h-6",
                        iconWrapperClasses
                    )}
                >
                    {rightIcon}
                </span>
            )}
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default Badge;
