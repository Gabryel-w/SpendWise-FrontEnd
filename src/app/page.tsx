"use client";
import Header from "@/components/header";
import Banner from "@/components/Banner";
import Footer from "@/components/Footer";
import About from "@/components/About";

const Home: React.FC = () => {
    return (
        <div className="bg-white min-h-screen relative">
        <Header />
        <Banner />
        <About />
        <div className="mt-52">
            <Footer />
        </div>
        </div>
    );
};

export default Home;
