// components/ui/SizeCard.tsx
/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface SizeCardProps extends React.HTMLAttributes<HTMLDivElement> {
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
        <div
            className={cn(
                "inline-flex flex-col items-start gap-[2px] rounded-xl bg-surface-white p-4 shadow-300 transition-all cursor-pointer hover:shadow-400",
                isSelected ? "border-[4px] border-primary-400" : "border-transparent",
                className
            )}
            {...props}
        >
            <div className="font-nunito text-s1 font-black text-primary-700 leading-[28px]">
                {sizeTitle}
            </div>
            <div className="font-nunito text-b3 text-grey-600 leading-[20px]">{description}</div>
        </div>
    );
};

export default SizeCard;
