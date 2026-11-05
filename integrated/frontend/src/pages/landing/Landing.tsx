/* ==========================================================================
   IMPORTS & UTILITIES
   ========================================================================== */
import { useState } from "react";
import ReservationModal, {
    type ReservationWeightTier
} from "@/features/reservation";
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
 * Primary landing page component assembling all marketing sections, global header navigation,
 * and the interactive reservation modal dialog.
 */
export default function Landing() {
    const [isReservationOpen, setIsReservationOpen] = useState<boolean>(false);
    const [selectedServiceId, setSelectedServiceId] = useState<
        string | undefined
    >(undefined);
    const [selectedWeightTier, setSelectedWeightTier] = useState<
        ReservationWeightTier | undefined
    >(undefined);

    const handleOpenReservation = (
        serviceId?: string,
        weightTier?: ReservationWeightTier
    ) => {
        setSelectedServiceId(serviceId);
        setSelectedWeightTier(weightTier);
        setIsReservationOpen(true);
    };

    return (
        <div className="min-h-screen bg-surface-white overflow-x-clip">
            <NavBar onCtaClick={() => handleOpenReservation()} />
            <div className="w-full max-w-container mx-auto px-px-mobile md:px-0">
                <main className="flex flex-col gap-50 md:gap-60 py-8">
                    <Hero
                        className="pt-8 md:pt-32"
                        onBookingClick={() => handleOpenReservation()}
                    />
                    <Features />
                    <Pricing
                        onSelectPlan={(planId, sizeTier) =>
                            handleOpenReservation(planId, sizeTier)
                        }
                    />
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

            <ReservationModal
                isOpen={isReservationOpen}
                onClose={() => setIsReservationOpen(false)}
                initialServiceId={selectedServiceId}
                initialWeightTier={selectedWeightTier}
            />
        </div>
    );
}
