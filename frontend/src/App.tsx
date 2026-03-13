import { motion } from "motion/react";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen bg-primary flex items-center justify-center px-6 font-sans overflow-hidden relative">
      <Navbar />

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
        </div>

        <motion.img
          src="/robothand_101074.svg"
          alt="MA-NO robot hand"
          className="hidden md:block w-80 lg:w-md xl:w-lg opacity-90"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 0.9, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </div>
    </div>
  );
}

export default App;
