import NavBar from "./_components/NavBar";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Pricing from "./_components/Pricing";
import DeliveryMethods from "./_components/DeliveryMethods";
import BeforeAfter from "./_components/BeforeAfter";
import Branch from "./_components/Branch";
import FAQ from "./_components/FAQ";

export default function Landing() {
    return (
        <div className="min-h-screen bg-surface-white">
            <NavBar />
            <div className="w-full max-w-container mx-auto px-px-mobile md:px-0">
                <main className="flex flex-col gap-12 md:gap-16 py-8">
                    <Hero />
                    <Features />
                    <Pricing />
                    <DeliveryMethods />
                    <BeforeAfter />
                    <Branch />
                    <FAQ />
                </main>
                <footer className="py-8 text-center font-nunito text-sm text-grey-500 border-t border-grey-100 mt-8">
                    <p>© {new Date().getFullYear()} DR. MEOWW. Hak cipta dilindungi undang-undang.</p>
                </footer>
            </div>
        </div>
    );
}
