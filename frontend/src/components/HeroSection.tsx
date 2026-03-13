import { motion } from "motion/react";

export default function HeroSection() {
  return (
    <section className="min-h-screen bg-primary flex items-center justify-center px-6 relative">
      <div className="flex items-center justify-between w-full max-w-7xl gap-12">
        <div className="flex flex-col items-start">
          <motion.h1
            className="text-accent text-8xl md:text-9xl font-bold tracking-tighter"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            MA-
            <span className="font-serif italic font-normal">NO</span>
          </motion.h1>

          <motion.h2
            className="text-accent text-xl md:text-2xl font-light tracking-wide mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.4,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            A robotic hand that takes care of your waste.
          </motion.h2>

          <motion.h3
            className="text-accent/60 text-base md:text-lg font-light tracking-wide mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Sorting is a thing of the past.
          </motion.h3>

          <motion.a
            href="#demo"
            className="mt-10 relative inline-flex items-center gap-3 border-2 border-accent bg-accent text-primary px-10 py-4 font-bold text-lg tracking-wide overflow-hidden group"
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.1, ease: [0.25, 0.46, 0.45, 0.94] }}
            whileHover={{
              scale: 1.08,
              boxShadow: "0 0 40px rgba(255,255,0,0.4), 0 0 80px rgba(255,255,0,0.15)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="absolute inset-0 bg-primary/10"
              initial={{ x: "-100%" }}
              whileHover={{ x: "100%" }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            />
            <span className="relative z-10">Request a Demo</span>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              className="w-5 h-5 relative z-10"
              animate={{ x: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </motion.svg>
          </motion.a>

        </div>

        <div className="relative hidden md:block">
          <motion.img
            src="/robothand_101074.svg"
            alt="MA-NO robot hand"
            className="w-80 lg:w-md xl:w-lg opacity-90"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 0.9, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
          <motion.img
            src="/recycling-svgrepo-com.svg"
            alt="Recycling symbol"
            className="absolute bottom-[30%] left-1/2 -translate-x-1/2 -ml-5 -mb-5.5 w-12 lg:w-14 xl:w-16"
            initial={{ opacity: 0, scale: 0, rotate: -180 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </div>
    </section>
  );
}
