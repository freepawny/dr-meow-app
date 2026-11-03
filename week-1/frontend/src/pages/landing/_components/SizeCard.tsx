/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the SizeCard component.
 */
export interface SizeCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Primary title indicating weight or size tier. */
    sizeTitle: string;
    /** Brief description of target cat type or breed size. */
    description: string;
    /**
     * Whether this size option is currently selected.
     * @defaultValue false
     */
    isSelected?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Selectable card button representing a pet size category option.
 */
export const SizeCard: React.FC<SizeCardProps> = ({
    sizeTitle,
    description,
    isSelected = false,
    className,
    ...props
}) => {
    return (
        <button
            type="button"
            className={cn(
                "inline-flex flex-col items-start gap-[2px] rounded-xl bg-surface-white p-4 shadow-300 transition-all cursor-pointer hover:shadow-400 text-left outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
                isSelected ? "border-[4px] border-primary-400" : "border-[4px] border-transparent",
                className
            )}
            aria-pressed={isSelected}
            {...props}
        >
            <span className="block font-nunito text-s1 font-black text-primary-700 leading-[28px]">
                {sizeTitle}
            </span>
            <span className="block font-nunito text-b3 text-grey-600 leading-[20px]">
                {description}
            </span>
        </button>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default SizeCard;
