/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React from "react";
import { cn } from "@/lib/utils";
import { TabPill, TabContainer } from "@/components/TabPill";
import Button from "@/components/Button";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Navigation link descriptor for the primary header menu. */
export interface NavItem {
    /** Unique identifier matching section anchors. */
    id: string;
    /** Text label displayed on the navigation tab. */
    label: string;
    /** Anchor destination URL. */
    href: string;
}

/**
 * Props for the static responsive Navbar component (Sprint 01).
 */
export interface NavbarProps {
    logoSrc?: string;
    logoAlt?: string;
    items?: NavItem[];
    activeId?: string;
    ctaText?: string;
    ctaHref?: string;
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
const DEFAULT_NAV_ITEMS: NavItem[] = [
    { id: "layanan", label: "Layanan", href: "#layanan" },
    { id: "harga", label: "Harga", href: "#harga" },
    { id: "faq", label: "FAQ", href: "#faq" }
];

/**
 * Semantic responsive navigation bar header using pure HTML/CSS without JS state.
 */
export const Navbar: React.FC<NavbarProps> = ({
    logoSrc = "https://api.builder.io/api/v1/image/assets/TEMP/e8963345c9927333c14db8de1d2560e1ba26788e?width=324",
    logoAlt = "Logo DR. MEOWW",
    items = DEFAULT_NAV_ITEMS,
    activeId = "layanan",
    ctaText = "Reservasi Sekarang",
    ctaHref = "#harga",
    className
}) => {
    return (
        <header
            className={cn(
                "w-full bg-surface-white/60 backdrop-blur-sm sticky top-0 z-50 border-b border-grey-100",
                className
            )}
        >
            <nav
                aria-label="Main Navigation"
                className="flex w-full max-w-container mx-auto items-center justify-between relative px-px-mobile py-3 md:px-0"
            >
                <a href="#" className="flex-shrink-0 transition-opacity hover:opacity-90">
                    <img
                        src={logoSrc}
                        alt={logoAlt}
                        width={162}
                        height={53}
                        className="h-[42px] md:h-[53px] w-auto aspect-[162/53] object-contain"
                    />
                </a>

                <div className="hidden md:flex items-center gap-1">
                    <TabContainer variant="default" aria-label="Navigasi Utama">
                        {items.map((item) => (
                            <TabPill
                                key={item.id}
                                label={item.label}
                                href={item.href}
                                isSelected={activeId === item.id}
                            />
                        ))}
                    </TabContainer>
                </div>

                <div className="hidden md:flex items-center shrink-0">
                    <Button href={ctaHref}>{ctaText}</Button>
                </div>

                <details className="relative md:hidden group">
                    <summary
                        aria-label="Buka menu navigasi"
                        className="list-none flex p-2 text-text-primary-dark rounded-md cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-surface-primary"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </summary>
                    <div className="absolute right-0 top-12 w-60 rounded-xl border border-grey-100 bg-surface-white p-3 shadow-500 flex flex-col gap-2 z-50">
                        <div className="flex flex-col gap-1">
                            {items.map((item) => (
                                <TabPill
                                    key={item.id}
                                    label={item.label}
                                    href={item.href}
                                    isSelected={activeId === item.id}
                                    className="w-full justify-start text-left"
                                />
                            ))}
                        </div>
                        <div className="pt-1 border-t border-grey-100">
                            <Button href={ctaHref} className="w-full">
                                {ctaText}
                            </Button>
                        </div>
                    </div>
                </details>
            </nav>
        </header>
    );
};

export { Navbar as NavBar };
export default Navbar;
