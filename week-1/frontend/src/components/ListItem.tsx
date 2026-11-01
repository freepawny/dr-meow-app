/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface ListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    title: string;
    details?: string;
    icon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    selected?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
export const ListItem: React.FC<ListItemProps> = ({
    title,
    details,
    icon,
    rightIcon,
    selected = false,
    className,
    ...props
}) => {
    return (
        <button
            type="button"
            className={cn(
                "flex w-full items-center py-1 text-left transition-colors outline-none rounded-lg",
                "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:z-10",
                selected ? "bg-primary-50" : "bg-grey-50 hover:bg-blue-50 active:bg-blue-100",
                className
            )}
            aria-pressed={selected}
            {...props}
        >
            <div className="flex flex-1 items-center gap-3 p-3">
                {icon}
                <span className="flex-1 font-nunito text-s2 text-primary-700">{title}</span>
            </div>
            <div className="flex shrink-0 min-w-[124px] items-center justify-end gap-3 py-3 pl-3 pr-4">
                {details && (
                    <span className="text-right font-nunito text-s2 text-grey-600">{details}</span>
                )}
                {rightIcon}
            </div>
        </button>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ListItem;
