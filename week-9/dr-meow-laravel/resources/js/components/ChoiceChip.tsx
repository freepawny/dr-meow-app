/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { ButtonHTMLAttributes, FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the reusable ChoiceChip selectable card/pill button.
 */
export interface ChoiceChipProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    /** Primary label text inside the selectable chip. */
    label: string;
    /** Optional secondary description or price caption. */
    subLabel?: string;
    /** Optional leading icon element. */
    icon?: ReactNode;
    /** Optional small highlight badge text (e.g. "Populer"). */
    badgeText?: string;
    /**
     * Indicates whether this option is currently active/selected.
     * @defaultValue false
     */
    isSelected?: boolean;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Interactive single-click selectable chip/card atom reducing manual form typing.
 */
export const ChoiceChip: FC<ChoiceChipProps> = ({
    label,
    subLabel,
    icon,
    badgeText,
    isSelected = false,
    disabled = false,
    className,
    ...props
}) => {
    return (
        <button
            type="button"
            disabled={disabled}
            aria-pressed={isSelected}
            className={cn(
                "relative flex cursor-pointer items-center gap-2.5 rounded-xl border-2 px-3.5 py-2.5 text-left transition-all duration-200 select-none outline-none",
                "active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
                isSelected
                    ? "border-primary-400 bg-primary-50 text-primary-700 shadow-200"
                    : "border-grey-200 bg-surface-white text-primary-700 shadow-100 hover:border-primary-300 hover:bg-primary-50/40",
                disabled && "pointer-events-none cursor-not-allowed opacity-50",
                className
            )}
            {...props}
        >
            {icon && (
                <span
                    className={cn(
                        "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isSelected
                            ? "bg-primary-400 text-surface-white"
                            : "bg-primary-50 text-primary-600"
                    )}
                >
                    {icon}
                </span>
            )}

            <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-center justify-between gap-2">
                    <span className="truncate font-nunito text-b3 font-extrabold leading-5 text-primary-700">
                        {label}
                    </span>
                    {badgeText && (
                        <span className="shrink-0 rounded-full bg-yellow-300 px-2 py-0.5 font-quicksand text-[10px] font-bold leading-none text-surface-white">
                            {badgeText}
                        </span>
                    )}
                </div>
                {subLabel && (
                    <span className="font-nunito text-c1 leading-4 text-grey-600">
                        {subLabel}
                    </span>
                )}
            </div>
        </button>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default ChoiceChip;
