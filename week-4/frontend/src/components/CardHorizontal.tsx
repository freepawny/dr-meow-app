/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the CardHorizontal component.
 */
export interface CardHorizontalProps extends React.HTMLAttributes<HTMLDivElement> {
    /** URL of the card background image displayed in the side/top media section. */
    imageSrc?: string;

    /** Primary heading text rendered inside the card body. */
    title: string;

    /** Optional secondary descriptive copy rendered below the title. */
    description?: string;

    /**
     * Toggles elevation shadow styling versus a static bordered appearance.
     * @defaultValue true
     */
    withShadow?: boolean;

    /** Slot for rendering supplementary widgets or status badges alongside the header text. */
    optionalContent?: React.ReactNode;

    /** Nested elements or action buttons appended to the bottom of the card body. */
    children?: React.ReactNode;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Horizontal card layout displaying a side-by-side media banner and text block on desktop,
 * transitioning to a stacked vertical layout on smaller screen sizes.
 */
export const CardHorizontal: React.FC<CardHorizontalProps> = ({
    imageSrc,
    title,
    description,
    withShadow = true,
    optionalContent,
    children,
    className,
    ...props
}) => {
    return (
        <div
            className={cn(
                "flex w-full flex-col overflow-hidden rounded-xl bg-surface-white transition-shadow md:flex-row",
                withShadow ? "shadow-300 border border-transparent" : "border border-grey-200",
                className
            )}
            {...props}
        >
            {imageSrc && (
                <div
                    className="h-48 w-full shrink-0 bg-grey-200 bg-cover bg-center bg-no-repeat md:h-auto md:w-[202px]"
                    style={{ backgroundImage: `url(${imageSrc})` }}
                    role="img"
                    aria-label={title}
                />
            )}

            <div className="flex flex-1 flex-col justify-center gap-6 p-6">
                <div className="flex items-center justify-between gap-6">
                    <div className="flex flex-1 flex-col items-start gap-1">
                        <h3 className="font-nunito text-h5 font-black text-primary-700">{title}</h3>
                        {description && (
                            <p className="font-nunito text-b3 text-grey-600">{description}</p>
                        )}
                    </div>

                    {optionalContent && (
                        <div className="flex shrink-0 items-start justify-center">
                            {optionalContent}
                        </div>
                    )}
                </div>

                {children && (
                    <div className="flex w-full flex-col items-start gap-4">{children}</div>
                )}
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default CardHorizontal;
