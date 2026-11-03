/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Supported size variants determining height, typography, and padding. */
export type ButtonSize = "giant" | "large" | "medium" | "small" | "tiny";

/** Visual style variants for surface elevation and border treatment. */
export type ButtonStyle = "filled" | "outline" | "clear";

/**
 * Core configuration options for button appearance, layout, and iconography.
 */
export interface ButtonBaseProps {
    /**
     * Visual hierarchy style variant.
     * @defaultValue "filled"
     */
    variantStyle?: ButtonStyle;

    /**
     * Size scale applied to padding, height, and typography.
     * @defaultValue "medium"
     */
    size?: ButtonSize;

    /**
     * Toggles the default left arrow icon when no custom leftIcon is supplied.
     * @defaultValue false
     */
    showLeftIcon?: boolean;

    /**
     * Toggles the default right arrow icon when no custom rightIcon is supplied.
     * @defaultValue false
     */
    showRightIcon?: boolean;

    /** Custom icon node rendered before the button label. */
    leftIcon?: React.ReactNode;

    /** Custom icon node rendered after the button label. */
    rightIcon?: React.ReactNode;

    /**
     * Renders the button as an equal-width icon container, suppressing labels.
     * @defaultValue false
     */
    iconOnly?: boolean;

    /**
     * Disables interactive states and prevents click/navigation events.
     * @defaultValue false
     */
    disabled?: boolean;

    /** Additional custom class names applied to the container. */
    className?: string;

    /** Content or text label rendered inside the button. */
    children?: React.ReactNode;
}

/**
 * Polymorphic button props discriminating between standard HTML button and anchor attributes.
 */
export type ButtonProps = ButtonBaseProps &
    (
        | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
        | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
    );

/* ==========================================================================
   ATOMIC SUB-COMPONENTS (LUCIDE ICONS WRAPPER)
   ========================================================================== */
/** Props for the atomic icon wrappers. */
interface IconProps {
    /** Additional custom CSS class names. */
    className?: string;
    /** Whether to render using the tiny icon scale. */
    isTiny?: boolean;
}

/**
 * Internal Lucide ArrowLeft wrapper with dynamic sizing based on button scale.
 */
const ArrowLeftIcon: React.FC<IconProps> = ({ className, isTiny }) => {
    return <ArrowLeft className={cn("flex-shrink-0", isTiny ? "w-4 h-4" : "w-6 h-6", className)} />;
};

/**
 * Internal Lucide ArrowRight wrapper with dynamic sizing based on button scale.
 */
const ArrowRightIcon: React.FC<IconProps> = ({ className, isTiny }) => {
    return (
        <ArrowRight className={cn("flex-shrink-0", isTiny ? "w-4 h-4" : "w-6 h-6", className)} />
    );
};

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Polymorphic interactive button component supporting multiple visual treatments,
 * scales, icon placements, and dual semantic rendering (`<button>` vs `<a>`).
 */
export const Button = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
    (
        {
            variantStyle = "filled",
            size = "medium",
            showLeftIcon = false,
            showRightIcon = false,
            leftIcon,
            rightIcon,
            iconOnly = false,
            href,
            disabled = false,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const isTiny = size === "tiny";

        const baseClasses = cn(
            "inline-flex items-center justify-center rounded-lg font-quicksand font-bold transition-all duration-200 outline-none select-none cursor-pointer",
            "focus-visible:ring-2 focus-visible:ring-offset-2",
            disabled && "cursor-not-allowed pointer-events-none"
        );

        const sizeClasses: Record<ButtonSize, string> = {
            giant: cn(
                "h-14 text-[18px] leading-[24px] gap-2",
                iconOnly ? "w-14 p-0" : "px-5 py-3.5"
            ),
            large: cn("h-12 text-[16px] leading-[20px] gap-2", iconOnly ? "w-12 p-0" : "px-4 py-3"),
            medium: cn(
                "h-10 text-[14px] leading-[16px] gap-1.5",
                iconOnly ? "w-10 p-0" : "px-3 py-2.5"
            ),
            small: cn("h-9 text-[12px] leading-[16px] gap-1", iconOnly ? "w-9 p-0" : "px-3 py-2"),
            tiny: cn("h-7 text-[10px] leading-[12px] gap-1", iconOnly ? "w-7 p-0" : "px-2 py-1.5")
        };

        const styleClasses: Record<ButtonStyle, string> = {
            filled: cn(
                "bg-primary-400 text-text-primary-white shadow-sm",
                "hover:bg-primary-300 hover:brightness-105",
                "active:bg-primary-500 active:scale-95",
                "focus-visible:ring-primary-400",
                disabled && "bg-grey-300 text-text-disabled shadow-none [&_svg]:text-grey-400"
            ),
            outline: cn(
                "border border-primary-500 bg-transparent text-primary-700",
                "[&_svg]:text-primary-500",
                "hover:bg-primary-50",
                "active:bg-primary-100 active:scale-95",
                "focus-visible:ring-primary-500",
                disabled && "border-grey-300 text-text-disabled [&_svg]:text-grey-400"
            ),
            clear: cn(
                "bg-transparent text-primary-700",
                "[&_svg]:text-primary-500",
                "hover:bg-primary-50",
                "active:bg-primary-100 active:scale-95",
                "focus-visible:ring-primary-500",
                disabled && "text-text-disabled [&_svg]:text-grey-400"
            )
        };

        const combinedClasses = cn(
            baseClasses,
            sizeClasses[size],
            styleClasses[variantStyle],
            className
        );

        const renderLeftIcon = () => {
            if (leftIcon) return <span className="flex-shrink-0 inline-flex">{leftIcon}</span>;
            if (showLeftIcon) return <ArrowLeftIcon isTiny={isTiny} />;
            return null;
        };

        const renderRightIcon = () => {
            if (rightIcon) return <span className="flex-shrink-0 inline-flex">{rightIcon}</span>;
            if (showRightIcon) return <ArrowRightIcon isTiny={isTiny} />;
            return null;
        };

        const content = iconOnly ? (
            leftIcon || children || <ArrowLeftIcon isTiny={isTiny} />
        ) : (
            <>
                {renderLeftIcon()}
                {children && <span className="px-1 text-center truncate">{children}</span>}
                {renderRightIcon()}
            </>
        );

        if (href) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={disabled ? undefined : href}
                    aria-disabled={disabled}
                    className={combinedClasses}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {content}
                </a>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                type="button"
                disabled={disabled}
                aria-disabled={disabled}
                className={combinedClasses}
                {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            >
                {content}
            </button>
        );
    }
);

Button.displayName = "Button";

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { ArrowLeftIcon, ArrowRightIcon };
export default Button;
