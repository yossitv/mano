import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const [onYellow, setOnYellow] = useState(false);
  const [inHowItWorks, setInHowItWorks] = useState(false);

  useEffect(() => {
    const check = () => {
      // Use a fixed reference point (where the nav sits: top-4 ≈ 16px + ~28px half-height)
      const navMid = 30;

      const sections = document.querySelectorAll("section");
      let hit = false;
      sections.forEach((section) => {
        if (section.classList.contains("bg-accent")) {
          const rect = section.getBoundingClientRect();
          if (navMid >= rect.top && navMid <= rect.bottom) {
            hit = true;
          }
        }
      });
      setOnYellow(hit);

      const howSection = document.getElementById("how-it-works");
      if (howSection) {
        const rect = howSection.getBoundingClientRect();
        setInHowItWorks(rect.top <= navMid && navMid <= rect.bottom);
      }
    };

    window.addEventListener("scroll", check, { passive: true });
    check();
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <motion.nav
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 backdrop-blur-md px-6 py-1.5 flex items-center gap-3 transition-colors duration-300 ${
        onYellow ? "bg-primary/20" : "bg-accent/10"
      }`}
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Corner accents */}
      <span className={`absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 transition-colors duration-300 ${onYellow ? "border-primary/40" : "border-accent/40"}`} />
      <span className={`absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 transition-colors duration-300 ${onYellow ? "border-primary/40" : "border-accent/40"}`} />
      <span className={`absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 transition-colors duration-300 ${onYellow ? "border-primary/40" : "border-accent/40"}`} />
      <span className={`absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 transition-colors duration-300 ${onYellow ? "border-primary/40" : "border-accent/40"}`} />

      <a href="#" onClick={(e) => { e.preventDefault(); navigate("/"); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
        <img
          src="/robothand_101074.svg"
          alt="MA-NO logo"
          className={`w-14 h-14 -my-2 -mx-2 transition-all duration-300 cursor-pointer ${onYellow ? "brightness-0" : ""}`}
        />
      </a>

      <div className="flex items-center gap-6">
        <a href="#" className={`text-sm font-light tracking-wide transition-colors ${onYellow ? "text-primary/70 hover:text-primary" : "text-accent/70 hover:text-accent"}`}>
          Product
        </a>
        <a href="#" className={`text-sm font-light tracking-wide transition-colors ${onYellow ? "text-primary/70 hover:text-primary" : "text-accent/70 hover:text-accent"}`}>
          About
        </a>
        <a href="#" className={`text-sm font-light tracking-wide transition-colors ${onYellow ? "text-primary/70 hover:text-primary" : "text-accent/70 hover:text-accent"}`}>
          Contact
        </a>
      </div>
    </motion.nav>
  );
}
