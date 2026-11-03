/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Alignment options for the section header text and container. */
export type SectionHeaderAlign = "left" | "center" | "right";

/** Heading level HTML element tag. */
export type SectionHeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

/**
 * Props for the SectionHeader component.
 */
export interface SectionHeaderProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    /**
     * Primary section headline text or node.
     */
    headline?: React.ReactNode;
    /**
     * Alias for headline.
     */
    title?: React.ReactNode;
    /**
     * Supporting sub-headline descriptive copy text or node.
     */
    subHeadline?: React.ReactNode;
    /**
     * Alias for subHeadline.
     */
    subtitle?: React.ReactNode;
    /**
     * Alias for subHeadline.
     */
    description?: React.ReactNode;
    /**
     * Text alignment layout.
     * @defaultValue "center"
     */
    align?: SectionHeaderAlign;
    /**
     * Semantic HTML heading element.
     * @defaultValue "h2"
     */
    as?: SectionHeadingTag;
    /**
     * Additional CSS class name for the wrapper container.
     */
    className?: string;
    /**
     * Additional CSS class name for the headline element.
     */
    headlineClassName?: string;
    /**
     * Additional CSS class name for the sub-headline element.
     */
    subHeadlineClassName?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Shared section header component rendering headline and supporting sub-headline copy.
 */
export const SectionHeader: React.FC<SectionHeaderProps> = ({
    headline,
    title,
    subHeadline,
    subtitle,
    description,
    align = "center",
    as: Tag = "h2",
    className,
    headlineClassName,
    subHeadlineClassName,
    ...props
}) => {
    const finalHeadline = headline ?? title;
    const finalSubHeadline = subHeadline ?? subtitle ?? description;

    const alignContainerClasses: Record<SectionHeaderAlign, string> = {
        left: "items-start text-left",
        center: "items-center text-center",
        right: "items-end text-right"
    };

    return (
        <div
            className={cn(
                "flex flex-col gap-4",
                alignContainerClasses[align],
                className
            )}
            {...props}
        >
            {finalHeadline && (
                <Tag
                    className={cn(
                        "font-nunito font-black text-3xl md:text-h2 text-primary-700 leading-tight whitespace-pre-line",
                        headlineClassName
                    )}
                >
                    {finalHeadline}
                </Tag>
            )}
            {finalSubHeadline && (
                <p
                    className={cn(
                        "font-nunito font-normal text-b1 text-primary-700 leading-6",
                        align === "center" && "max-w-[618px]",
                        subHeadlineClassName
                    )}
                >
                    {finalSubHeadline}
                </p>
            )}
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { SectionHeader as SectionHeading };
export default SectionHeader;
