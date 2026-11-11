/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import ListItem from "@/components/ListItem";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the List component.
 */
export interface ListProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Collection of item data entries to render sequentially. */
    items: Array<{
        id: string | number;
        title: string;
        details?: string;
        icon?: React.ReactNode;
        rightIcon?: React.ReactNode;
    }>;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Vertical list container component rendering a collection of ListItem components.
 */
export const List: React.FC<ListProps> = ({ items, className, ...props }) => {
    return (
        <div className={cn("flex w-full flex-col", className)} {...props}>
            {items.map((item) => (
                <ListItem
                    key={item.id}
                    title={item.title}
                    details={item.details}
                    icon={item.icon}
                    rightIcon={item.rightIcon}
                />
            ))}
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default List;
