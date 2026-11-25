/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { useEffect, useId } from "react";
import type { FC, ReactNode } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/**
 * Props for the reusable Modal dialog component.
 */
export interface ModalProps {
    /** Controls whether the modal overlay and dialog window are visible. */
    isOpen: boolean;
    /** Callback triggered when user closes via close button, backdrop, or Escape key. */
    onClose: () => void;
    /** Primary dialog heading title. */
    title?: ReactNode;
    /** Supporting descriptive subtitle below the heading. */
    description?: ReactNode;
    /** Optional badge or accent slot rendered above the title. */
    badge?: ReactNode;
    /** Main modal body content. */
    children: ReactNode;
    /** Optional sticky footer slot rendered below the scrollable body. */
    footer?: ReactNode;
    /**
     * Whether clicking the darkened/blurred backdrop closes the modal.
     * @defaultValue true
     */
    closeOnBackdropClick?: boolean;
    /** Additional custom CSS class names for the dialog window panel. */
    className?: string;
    /** Additional custom CSS class names for the scrollable body container. */
    bodyClassName?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Accessible pop-up dialog window with darkened and blurred backdrop overlay.
 */
export const Modal: FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    description,
    badge,
    children,
    footer,
    closeOnBackdropClick = true,
    className,
    bodyClassName
}) => {
    const baseId = useId();
    const titleId = `modal-title-${baseId}`;
    const descId = `modal-desc-${baseId}`;

    useEffect(() => {
        if (!isOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
            <div
                aria-hidden="true"
                onClick={() => {
                    if (closeOnBackdropClick) {
                        onClose();
                    }
                }}
                className="fixed inset-0 bg-surface-overlay backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
            />

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? titleId : undefined}
                aria-describedby={description ? descId : undefined}
                className={cn(
                    "relative z-10 flex max-h-[90vh] w-full max-w-[680px] flex-col overflow-hidden rounded-2xl border border-primary-100 bg-surface-white shadow-800 animate-in fade-in zoom-in-95 duration-200",
                    className
                )}
            >
                <div className="flex items-start justify-between gap-4 border-b border-grey-100 bg-gradient-to-r from-primary-50/70 via-surface-white to-primary-50/40 px-5 py-4 sm:px-6 sm:py-5">
                    <div className="flex flex-1 flex-col items-start gap-1.5">
                        {badge && <div>{badge}</div>}
                        {title && (
                            <h2
                                id={titleId}
                                className="font-nunito text-s1 font-black leading-snug text-primary-700 sm:text-h5"
                            >
                                {title}
                            </h2>
                        )}
                        {description && (
                            <p
                                id={descId}
                                className="font-nunito text-b3 leading-5 text-grey-600"
                            >
                                {description}
                            </p>
                        )}
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Tutup form"
                        className="inline-flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-grey-200 bg-surface-white text-grey-600 transition-all duration-200 hover:border-primary-300 hover:bg-primary-50 hover:text-primary-700 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary-400 outline-none"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div
                    className={cn(
                        "flex-1 overflow-y-auto px-5 py-5 sm:px-6",
                        bodyClassName
                    )}
                >
                    {children}
                </div>

                {footer && (
                    <div className="border-t border-grey-100 bg-surface-grey px-5 py-4 sm:px-6">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export default Modal;
