"use client";
import Header from "@/components/header";
import Footer from "@/components/Footer";
import About from "@/components/About";
import HeroSection from "@/components/heroSection";
import FeaturesSection from "@/components/FeaturesSection";
import ProductShowcase from "@/components/ProductShowcase";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Faq from "@/components/Faq";
import CallToAction from "@/components/CallToAction";

const Home: React.FC = () => {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen relative">
        <Header />
        <HeroSection />
        <About />
        <FeaturesSection />
        <ProductShowcase />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <CallToAction />
       
            <Footer />
  
        </div>
    );
};

export default Home;
