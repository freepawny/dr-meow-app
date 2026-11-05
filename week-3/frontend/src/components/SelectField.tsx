/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { forwardRef, useId } from "react";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Single option item inside a SelectField dropdown.
 */
export interface SelectOption {
    /** Submitted option value. */
    value: string;
    /** Human-readable label shown to user. */
    label: string;
    /** Optional disabled flag for unavailable options. */
    disabled?: boolean;
}

/**
 * Props for the reusable SelectField dropdown component.
 */
export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    /** Field label displayed above the select dropdown. */
    label?: string;
    /** Array of selectable dropdown options. */
    options: SelectOption[];
    /** Optional placeholder label when value is empty. */
    placeholder?: string;
    /** Optional helper hint rendered below the select box. */
    helperText?: string;
    /** Validation error message replacing helper text when present. */
    errorMessage?: string;
    /** Optional leading icon rendered inside the select wrapper. */
    leftIcon?: ReactNode;
    /** Additional custom CSS class names for the outer field wrapper. */
    containerClassName?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Design-system dropdown select component styled consistently with TextField.
 */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    (
        {
            label,
            options,
            placeholder,
            helperText,
            errorMessage,
            leftIcon,
            required,
            disabled,
            id,
            className,
            containerClassName,
            ...props
        },
        ref
    ) => {
        const generatedId = useId();
        const selectId = id ?? `selectfield-${generatedId}`;
        const messageId = `${selectId}-msg`;
        const hasError = Boolean(errorMessage);

        return (
            <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="font-quicksand text-b3 font-bold text-primary-700"
                    >
                        {label}
                        {required && (
                            <span className="ml-1 text-text-error" aria-hidden="true">
                                *
                            </span>
                        )}
                    </label>
                )}

                <div
                    className={cn(
                        "relative flex h-11 w-full items-center gap-2.5 rounded-lg border-[1.5px] bg-surface-white px-3.5 transition-all duration-200",
                        hasError
                            ? "border-text-error focus-within:border-text-error focus-within:ring-2 focus-within:ring-red-100"
                            : "border-grey-200 hover:border-primary-300 focus-within:border-primary-400 focus-within:ring-2 focus-within:ring-primary-100",
                        disabled && "cursor-not-allowed bg-grey-50 opacity-60"
                    )}
                >
                    {leftIcon && (
                        <span className="inline-flex shrink-0 text-primary-500">
                            {leftIcon}
                        </span>
                    )}

                    <select
                        ref={ref}
                        id={selectId}
                        required={required}
                        disabled={disabled}
                        aria-invalid={hasError}
                        aria-describedby={
                            errorMessage || helperText ? messageId : undefined
                        }
                        className={cn(
                            "h-full w-full flex-1 cursor-pointer appearance-none bg-transparent pr-7 font-nunito text-b3 text-grey-800 outline-none sm:text-b1",
                            disabled && "cursor-not-allowed",
                            className
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="" disabled>
                                {placeholder}
                            </option>
                        )}
                        {options.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                disabled={opt.disabled}
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <ChevronDown
                        className="pointer-events-none absolute right-3.5 h-4 w-4 text-primary-500"
                        aria-hidden="true"
                    />
                </div>

                {(errorMessage || helperText) && (
                    <p
                        id={messageId}
                        className={cn(
                            "font-nunito text-c1 leading-4",
                            hasError ? "font-semibold text-text-error" : "text-grey-500"
                        )}
                    >
                        {errorMessage || helperText}
                    </p>
                )}
            </div>
        );
    }
);

SelectField.displayName = "SelectField";

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default SelectField;
