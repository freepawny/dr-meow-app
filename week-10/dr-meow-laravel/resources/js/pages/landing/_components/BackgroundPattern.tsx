/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import type { FC } from "react";
import { cn } from "@/lib/utils";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export interface BackgroundPatternProps {
    color?: "yellow" | "blue";
    variant?: "responsive" | "exact";
    minDistance?: string;
    className?: string;
}

/* ==========================================================================
   ATOMIC SUB-COMPONENTS
   ========================================================================== */

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const BackgroundPattern: FC<BackgroundPatternProps> = ({
    color = "yellow",
    variant = "responsive",
    minDistance,
    className
}) => {
    const colorClasses = {
        fill: color === "yellow" ? "fill-surface-accent" : "fill-surface-primary-subtle",
        bg: color === "yellow" ? "bg-surface-accent" : "bg-surface-primary-subtle"
    };

    if (variant === "exact") {
        return (
            <div
                aria-hidden="true"
                className={cn(
                    "pointer-events-none absolute inset-x-0 top-1/2 left-1/2 z-0 flex w-screen max-w-[100vw] -translate-x-1/2 -translate-y-[calc(50%+22px)] items-center justify-center overflow-hidden",
                    className
                )}
            >
                <svg
                    viewBox="0 0 1441 1351"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className={cn("h-auto w-full max-w-[1441px]", colorClasses.fill)}
                >
                    <path
                        d="M2.3924 0H0V1351C0 1130.09 179.086 951 400 951H1041C1261.91 951 1441 1130.09 1441 1351V0H1438.61C1416.7 200.212 1247.04 356 1041 356H400C193.956 356 24.2988 200.212 2.3924 0Z"
                        fillRule="evenodd"
                        clipRule="evenodd"
                    />
                </svg>
            </div>
        );
    }

    return (
        <div
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-x-0 top-1/2 left-1/2 z-0 flex min-h-full w-screen max-w-[100vw] -translate-x-1/2 -translate-y-1/2 flex-col justify-between overflow-hidden",
                className
            )}
        >
            <svg
                className={cn("w-full shrink-0 h-24 sm:h-36 md:h-56 lg:h-[400px]", colorClasses.fill)}
                viewBox="0 0 1441 356"
                preserveAspectRatio="none"
            >
                <path d="M0 0 C24.2988 200.212 193.956 356 400 356 H1041 C1247.04 356 1416.7 200.212 1441 0 V356 H0 Z" />
            </svg>

            <div className={cn("w-full flex-1", minDistance || "min-h-[600px]", colorClasses.bg)} />

            <svg
                className={cn("w-full shrink-0 h-24 sm:h-36 md:h-56 lg:h-[400px]", colorClasses.fill)}
                viewBox="0 0 1441 400"
                preserveAspectRatio="none"
            >
                <path d="M0 0 H1441 V400 C1441 220.91 1261.91 0 1041 0 H400 C179.086 0 0 220.91 0 400 Z" />
            </svg>
        </div>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { BackgroundPattern };
export default BackgroundPattern;
