import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProblemSection from "./components/ProblemSection";
import HowItWorks from "./components/HowItWorks";
import ImpactSection from "./components/ImpactSection";
import TechStack from "./components/TechStack";
import PartnersSection from "./components/PartnersSection";
import Footer from "./components/Footer";
import DemoPage from "./components/DemoPage";

function LandingPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <HowItWorks />
      <ImpactSection />
      <TechStack />
      <PartnersSection />
      <Footer />
    </>
  );
}

function App() {
  return (
    <div className="bg-primary font-sans overflow-x-hidden">
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/demo" element={<DemoPage />} />
      </Routes>
    </div>
  );
}

export default App;
