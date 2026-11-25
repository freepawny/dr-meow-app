/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the ListItem component.
 */
export interface ListItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Primary label text of the list item. */
    title: string;
    /** Optional secondary details text displayed on the right. */
    details?: string;
    /** Optional leading icon element rendered before the title. */
    icon?: React.ReactNode;
    /** Optional trailing icon element rendered at the far right. */
    rightIcon?: React.ReactNode;
    /**
     * Whether the item is currently selected or highlighted.
     * @defaultValue false
     */
    selected?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Interactive list row item supporting leading/trailing icons and active selection states.
 */
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
