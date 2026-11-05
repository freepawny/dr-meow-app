/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { forwardRef, useId } from "react";
import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the reusable TextField input component.
 */
export interface TextFieldProps
    extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
    /** Field label displayed above the input box. */
    label?: string;
    /** Optional helper hint rendered below the input. */
    helperText?: string;
    /** Validation error message replacing helper text when present. */
    errorMessage?: string;
    /** Optional leading icon rendered inside the input field. */
    leftIcon?: ReactNode;
    /** Optional trailing unit label or element (e.g. "kg"). */
    rightAddon?: ReactNode;
    /** Additional custom CSS class names for the outer field wrapper. */
    containerClassName?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Design-system text input component supporting icons, unit addons, and validation states.
 */
export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
    (
        {
            label,
            helperText,
            errorMessage,
            leftIcon,
            rightAddon,
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
        const inputId = id ?? `textfield-${generatedId}`;
        const messageId = `${inputId}-msg`;
        const hasError = Boolean(errorMessage);

        return (
            <div className={cn("flex w-full flex-col gap-1.5", containerClassName)}>
                {label && (
                    <label
                        htmlFor={inputId}
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
                        "flex h-11 w-full items-center gap-2.5 rounded-lg border-[1.5px] bg-surface-white px-3.5 transition-all duration-200",
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

                    <input
                        ref={ref}
                        id={inputId}
                        required={required}
                        disabled={disabled}
                        aria-invalid={hasError}
                        aria-describedby={
                            errorMessage || helperText ? messageId : undefined
                        }
                        className={cn(
                            "h-full w-full flex-1 bg-transparent font-nunito text-b3 text-grey-800 placeholder:text-grey-400 outline-none sm:text-b1",
                            disabled && "cursor-not-allowed",
                            className
                        )}
                        {...props}
                    />

                    {rightAddon && (
                        <span className="inline-flex shrink-0 items-center rounded-md bg-primary-50 px-2 py-0.5 font-quicksand text-c1 font-bold text-primary-700">
                            {rightAddon}
                        </span>
                    )}
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

TextField.displayName = "TextField";

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default TextField;
