/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Size scale options for badge height, padding, and font size. */
export type BadgeSize = "medium" | "small" | "tiny";

/** Semantic state variants representing status and intent. */
export type BadgeState = "default" | "success" | "info" | "warning" | "error";

/** Visual fill styles for badge surface and border. */
export type BadgeStyle = "outline" | "filled";

/**
 * Props for the Badge component.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * Size scale variant.
     * @defaultValue "medium"
     */
    size?: BadgeSize;
    /**
     * Semantic status or intent variant.
     * @defaultValue "default"
     */
    badgeState?: BadgeState;
    /**
     * Visual style variant (outline or filled).
     * @defaultValue "outline"
     */
    variantStyle?: BadgeStyle;
    /**
     * Text label displayed inside the badge.
     * @defaultValue "Label"
     */
    label?: string;
    /** Optional icon node rendered before the label. */
    leftIcon?: React.ReactNode;
    /** Optional icon node rendered after the label. */
    rightIcon?: React.ReactNode;
    /**
     * Controls label visibility.
     * @defaultValue true
     */
    showText?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Compact badge component for status indicators, categories, and tags.
 */
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
    const sizeClasses = {
        medium: "h-6 px-2 gap-2",
        small: "h-6 px-2 gap-2",
        tiny: "h-4 px-2 gap-2"
    };

    const textClasses = {
        medium: "font-quicksand font-bold text-b3 leading-none",
        small: "font-quicksand font-bold text-c1 leading-none",
        tiny: "font-quicksand font-bold text-c3 leading-none"
    };

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

    // NOTE: Default text color of icons must align with the current state and style
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
