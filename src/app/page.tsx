"use client";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import HeroSection from "@/components/heroSection";

const Home: React.FC = () => {
    return (
        <div className="bg-white min-h-screen relative">
        <Header />
        <HeroSection />
        <About />
        <div className="mt-52">
            <Footer />
        </div>
        </div>
    );
};

export default Home;
