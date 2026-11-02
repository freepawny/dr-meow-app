/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface SizeCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    sizeTitle: string;
    description: string;
    isSelected?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
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

export default SizeCard;
