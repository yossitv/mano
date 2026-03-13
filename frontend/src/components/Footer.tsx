import { motion } from "motion/react";

export default function Footer() {
  return (
    <footer className="bg-primary border-t border-accent/10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="flex flex-col items-center text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-accent text-4xl md:text-6xl font-bold tracking-tight">
            See it in{" "}
            <span className="font-serif italic font-normal">action</span>.
          </h2>

          <p className="text-accent/50 text-lg font-light mt-4 max-w-md">
            Stop sorting. Start living.
          </p>

          <motion.a
            href="#"
            className="mt-8 inline-block bg-accent text-primary px-8 py-3 rounded-full font-bold text-sm tracking-wide hover:bg-accent/90 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            Get Early Access
          </motion.a>
        </motion.div>

        <div className="mt-16 pt-8 border-t border-accent/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src="/robothand_101074.svg" alt="MA-NO" className="w-8 h-8" />
            <span className="text-accent/40 text-sm font-light">
              MA-NO © 2026
            </span>
          </div>

          <p className="text-accent/30 text-xs font-light">
            Built at Cyberwave Hackathon
          </p>
        </div>
      </div>
    </footer>
  );
}
