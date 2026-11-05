/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import NavBar from "./_components/NavBar";
import Hero from "./_sections/Hero";
import Features from "./_sections/Features";
import Pricing from "./_sections/Pricing";
import DeliveryMethods from "./_sections/DeliveryMethods";
import BeforeAfter from "./_sections/BeforeAfter";
import Branch from "./_sections/Branch";
import FAQ from "./_sections/FAQ";

/* ==========================================================================
   MAIN COMPONENT
   ========================================================================== */
/**
 * Primary static landing page component assembling semantic marketing sections,
 * responsive layout containers, header navigation, and global footer (Sprint 01).
 */
export default function Landing() {
    return (
        <div className="min-h-screen bg-surface-white overflow-x-clip">
            <NavBar ctaHref="#harga" />
            <div className="w-full max-w-container mx-auto px-px-mobile md:px-0">
                <main className="flex flex-col gap-50 md:gap-60 py-8">
                    <Hero className="pt-8 md:pt-32" bookingHref="#harga" />
                    <Features />
                    <Pricing />
                    <DeliveryMethods />
                    <BeforeAfter />
                    <Branch />
                    <FAQ />
                </main>
                <footer className="py-8 text-center font-nunito text-sm text-grey-500 border-t border-grey-100 mt-8">
                    <p>
                        © {new Date().getFullYear()} DR. MEOWW. Hak cipta
                        dilindungi undang-undang.
                    </p>
                </footer>
            </div>
        </div>
    );
}
