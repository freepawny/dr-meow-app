/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
export type TabContainerVariant = "default" | "capsule";

export interface TabContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    /** Varian tampilan pembungkus tab: 'default' (polos/inline) atau 'capsule' (Figma Tab v2) */
    variant?: TabContainerVariant;
    className?: string;
    children: React.ReactNode;
}

export interface TabPillBaseProps {
    /** Teks label tab */
    label?: string;
    /** Menampilkan teks label (default: true) */
    showText?: boolean;
    /** Status aktif / terpilih */
    isSelected?: boolean;
    /** Menampilkan default ikon bintang kiri */
    showLeftIcon?: boolean;
    /** Menampilkan default ikon bintang kanan */
    showRightIcon?: boolean;
    /** Kustom node ikon kiri (opsional) */
    leftIcon?: React.ReactNode;
    /** Kustom node ikon kanan (opsional) */
    rightIcon?: React.ReactNode;
    /** URL tujuan jika tab difungsikan sebagai link navigasi */
    href?: string;
    className?: string;
}

export type TabPillProps = TabPillBaseProps &
    (
        | (React.ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined })
        | (React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string })
    );

/* ==========================================================================
   ATOMIC SUB-COMPONENTS (FIGMA STAR ICON)
   ========================================================================== */
interface IconProps {
    className?: string;
}

const StarIcon: React.FC<IconProps> = ({ className }) => (
    <svg
        className={cn("w-6 h-6 flex-shrink-0", className)}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
    >
        <path
            d="M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

/* ==========================================================================
   TAB CONTAINER COMPONENT (TAB V1 VS TAB V2)
   ========================================================================== */
export const TabContainer = React.forwardRef<HTMLDivElement, TabContainerProps>(
    ({ variant = "default", className, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="tablist"
                className={cn(
                    "inline-flex items-center transition-all duration-200",
                    variant === "default" && "gap-1",
                    variant === "capsule" &&
                        "p-2 rounded-full border border-surface-primary bg-surface-white gap-1 w-fit shadow-xs",
                    className
                )}
                {...props}
            >
                {children}
            </div>
        );
    }
);

TabContainer.displayName = "TabContainer";

/* ==========================================================================
   MAIN COMPONENT (ATOMIC TAB PILL ITEM)
   ========================================================================== */
export const TabPill = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, TabPillProps>(
    (
        {
            label = "Label",
            showText = true,
            isSelected = false,
            showLeftIcon = false,
            showRightIcon = false,
            leftIcon,
            rightIcon,
            href,
            className,
            ...props
        },
        ref
    ) => {
        const baseClasses = cn(
            "inline-flex h-10 items-center justify-center rounded-lg p-3 font-quicksand text-[14px] font-bold leading-4 transition-all duration-200 outline-none select-none cursor-pointer flex-shrink-0",
            "focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2",
            isSelected
                ? "bg-surface-primary text-text-primary-white shadow-xs"
                : "bg-transparent text-text-primary-dark hover:bg-primary-50 active:bg-primary-100 active:scale-95",
            className
        );

        const renderLeftIcon = () => {
            if (leftIcon) {
                return (
                    <span
                        className={cn(
                            "inline-flex items-center justify-center flex-shrink-0",
                            isSelected ? "text-icon-white" : "text-icon-accent"
                        )}
                    >
                        {leftIcon}
                    </span>
                );
            }
            if (showLeftIcon) {
                return <StarIcon className={isSelected ? "text-icon-white" : "text-icon-accent"} />;
            }
            return null;
        };

        const renderRightIcon = () => {
            if (rightIcon) {
                return (
                    <span
                        className={cn(
                            "inline-flex items-center justify-center flex-shrink-0",
                            isSelected ? "text-icon-white" : "text-icon-accent"
                        )}
                    >
                        {rightIcon}
                    </span>
                );
            }
            if (showRightIcon) {
                return <StarIcon className={isSelected ? "text-icon-white" : "text-icon-accent"} />;
            }
            return null;
        };

        const content = (
            <>
                {renderLeftIcon()}
                {showText && label && (
                    <div className="flex items-center justify-center px-2">
                        <span className="text-center">{label}</span>
                    </div>
                )}
                {renderRightIcon()}
            </>
        );

        if (href) {
            return (
                <a
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    role="tab"
                    aria-selected={isSelected}
                    className={baseClasses}
                    {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
                >
                    {content}
                </a>
            );
        }

        return (
            <button
                ref={ref as React.Ref<HTMLButtonElement>}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={baseClasses}
                {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)}
            >
                {content}
            </button>
        );
    }
);

TabPill.displayName = "TabPill";

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { StarIcon };
export default TabPill;
