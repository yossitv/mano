import { motion } from "motion/react";

export default function Navbar() {
  return (
    <motion.nav
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-accent/10 backdrop-blur-md border border-accent/20 rounded-2xl px-6 py-1.5 flex items-center gap-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      <img src="/robothand_101074.svg" alt="MA-NO logo" className="w-14 h-14 -my-2 -mx-2" />

      <div className="flex items-center gap-6">
        <a href="#" className="text-accent/70 hover:text-accent text-sm font-light tracking-wide transition-colors">
          Product
        </a>
        <a href="#" className="text-accent/70 hover:text-accent text-sm font-light tracking-wide transition-colors">
          About
        </a>
        <a href="#" className="text-accent/70 hover:text-accent text-sm font-light tracking-wide transition-colors">
          Contact
        </a>
      </div>
    </motion.nav>
  );
}
