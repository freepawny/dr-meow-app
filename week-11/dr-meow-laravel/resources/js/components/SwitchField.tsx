/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the reusable SwitchField boolean toggle component.
 */
export interface SwitchFieldProps {
    /** Current boolean state of the switch. */
    checked: boolean;
    /** Callback invoked when the user toggles the switch. */
    onCheckedChange: (checked: boolean) => void;
    /** Primary label describing the setting. */
    label: string;
    /** Optional supporting description text. */
    description?: string;
    /** Optional leading icon element. */
    icon?: ReactNode;
    /**
     * Disables user interaction when true.
     * @defaultValue false
     */
    disabled?: boolean;
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Accessible switch card component (`role="switch"`) for boolean preferences.
 */
export const SwitchField: FC<SwitchFieldProps> = ({
    checked,
    onCheckedChange,
    label,
    description,
    icon,
    disabled = false,
    className
}) => {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            disabled={disabled}
            onClick={() => onCheckedChange(!checked)}
            className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-4 rounded-xl border-[1.5px] p-3.5 text-left transition-all duration-200 select-none outline-none",
                "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-1",
                checked
                    ? "border-primary-300 bg-primary-50/60"
                    : "border-grey-200 bg-surface-grey hover:border-primary-200",
                disabled && "pointer-events-none cursor-not-allowed opacity-50",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {icon && (
                    <span
                        className={cn(
                            "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
                            checked
                                ? "bg-primary-400 text-surface-white"
                                : "bg-grey-200 text-grey-600"
                        )}
                    >
                        {icon}
                    </span>
                )}
                <div className="flex flex-col">
                    <span className="font-quicksand text-b3 font-bold text-primary-700">
                        {label}
                    </span>
                    {description && (
                        <span className="font-nunito text-c1 leading-4 text-grey-600">
                            {description}
                        </span>
                    )}
                </div>
            </div>

            <span
                aria-hidden="true"
                className={cn(
                    "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200",
                    checked ? "bg-primary-400" : "bg-grey-300"
                )}
            >
                <span
                    className={cn(
                        "inline-block h-5 w-5 rounded-full bg-surface-white shadow-100 transition-transform duration-200",
                        checked ? "translate-x-5" : "translate-x-0"
                    )}
                />
            </span>
        </button>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default SwitchField;
