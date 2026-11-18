/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import React, { useState } from "react";
import { cn } from "@/lib/utils"
import { TabPill, TabContainer } from "@/components/TabPill";
import Button from "@/components/Button";

/* ==========================================================================
   TYPES & INTERFACES
   ========================================================================== */
/** Navigation link descriptor for the primary header menu. */
export interface NavItem {
    /** Unique identifier matching section anchors or tab keys. */
    id: string;
    /** Text label displayed on the navigation tab. */
    label: string;
    /** Optional hyperlink destination URL. */
    href?: string;
}

/**
 * Props for the Navbar component.
 */
export interface NavbarProps {
    /**
     * Brand logo image source URL.
     * @defaultValue "https://api.builder.io/api/v1/image/assets/TEMP/e8963345c9927333c14db8de1d2560e1ba26788e?width=324"
     */
    logoSrc?: string;
    /**
     * Accessible alternative text for the brand logo.
     * @defaultValue "Logo"
     */
    logoAlt?: string;
    /**
     * Array of navigation items rendered in the navbar.
     * @defaultValue DEFAULT_NAV_ITEMS
     */
    items?: NavItem[];
    /** Identifier of the currently active navigation item. */
    activeId?: string;
    /** Callback triggered when a navigation item is clicked or selected. */
    onTabChange?: (id: string) => void;
    /**
     * Label text for the call-to-action button.
     * @defaultValue "Reservasi Sekarang"
     */
    ctaText?: string;
    /** Callback triggered when the call-to-action button is clicked. */
    onCtaClick?: () => void;
    /** Target anchor or page URL for the call-to-action link. */
    ctaHref?: string;
    /** Additional custom CSS class names. */
    className?: string;
}

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/** Default fallback list of navigation tab items. */
const DEFAULT_NAV_ITEMS: NavItem[] = [
    { id: "layanan", label: "Layanan" },
    { id: "harga", label: "Harga" },
    { id: "faq", label: "FAQ" }
];

/**
 * Responsive navigation bar header with brand logo, tab navigation, mobile toggle menu, and CTA button.
 */
export const Navbar: React.FC<NavbarProps> = ({
    logoSrc = "https://api.builder.io/api/v1/image/assets/TEMP/e8963345c9927333c14db8de1d2560e1ba26788e?width=324",
    logoAlt = "Logo",
    items = DEFAULT_NAV_ITEMS,
    activeId,
    onTabChange,
    ctaText = "Reservasi Sekarang",
    onCtaClick,
    ctaHref,
    className
}) => {
    const [internalActiveId, setInternalActiveId] = useState<string>(
        activeId || items[0]?.id || ""
    );
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const currentActiveId = activeId !== undefined ? activeId : internalActiveId;

    const handleTabSelect = (item: NavItem) => {
        if (activeId === undefined) {
            setInternalActiveId(item.id);
        }
        onTabChange?.(item.id);
        setIsMobileMenuOpen(false);
    };

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
                <a href="/" className="flex-shrink-0 transition-opacity hover:opacity-90">
                    <img
                        src={logoSrc}
                        alt={logoAlt}
                        width={162}
                        height={53}
                        className="h-[42px] md:h-[53px] w-auto aspect-[162/53] object-contain"
                    />
                </a>

                <div className="hidden md:flex items-center gap-1">
                    <TabContainer variant="default" aria-label="Navigasi Capsule">
                        {items.map((item) => (
                            <TabPill
                                key={item.id}
                                label={item.label}
                                isSelected={currentActiveId === item.id}
                                onClick={() => handleTabSelect(item)}
                            />
                        ))}
                    </TabContainer>
                </div>

                <div className="hidden md:flex items-center shrink-0">
                    <Button href={ctaHref} onClick={onCtaClick}>
                        {ctaText}
                    </Button>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                    className="flex md:hidden p-2 text-text-primary-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-surface-primary rounded-md"
                    aria-expanded={isMobileMenuOpen}
                    aria-label="Toggle navigation menu"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {isMobileMenuOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            </nav>

            {isMobileMenuOpen && (
                <div className="md:hidden max-w-container mx-auto px-px-mobile pb-3 mt-3 pt-3 border-t border-grey-100 flex flex-col gap-2 w-full animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex flex-col gap-1" role="tablist">
                        {items.map((item) => (
                            <TabPill
                                key={item.id}
                                label={item.label}
                                isSelected={currentActiveId === item.id}
                                onClick={() => handleTabSelect(item)}
                                className="w-full justify-start text-left"
                            />
                        ))}
                    </div>
                    <div className="pt-2">
                        <Button
                            href={ctaHref}
                            onClick={() => {
                                onCtaClick?.();
                                setIsMobileMenuOpen(false);
                            }}
                            className="w-full"
                        >
                            {ctaText}
                        </Button>
                    </div>
                </div>
            )}
        </header>
    );
};

/* ==========================================================================
   EXPORTS
   ========================================================================== */
export { Navbar as NavBar };
export default Navbar;
