import NavBar from "./_components/NavBar";
import Hero from "./_components/Hero";
import Features from "./_components/Features";
import Pricing from "./_components/Pricing";
import FourMethodServices from "./_components/FourMethodServices";
import BeforAfter from "./_components/BeforAfter";
import Branch from "./_components/Branch";
import FAQ from "./_components/FAQ";

export default function Landing() {
    return (
        <div>
            <header className="sticky top-0 z-50 w-full bg-white shadow-sm">
                <div className="w-full max-w-container mx-auto px-px-mobile md:px-0">
                    <NavBar />
                </div>
            </header>
            <div className="w-full max-w-container mx-auto px-px-mobile md:px-0">
                <main>
                    <Hero />
                    <br />
                    <Features />
                    <br />
                    <Pricing />
                    <br />
                    <FourMethodServices />
                    <br />
                    <BeforAfter />
                    <br />
                    <Branch />
                    <br />
                    <FAQ />
                </main>
                <footer></footer>
            </div>
        </div>
    );
}
