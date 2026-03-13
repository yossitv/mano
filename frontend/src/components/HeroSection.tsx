import { motion, useMotionValue, useSpring, AnimatePresence } from "motion/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function MagneticCTA({
  onHoverChange,
}: {
  onHoverChange: (hovered: boolean) => void;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const navigate = useNavigate();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 15 });
  const springY = useSpring(y, { stiffness: 200, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.3);
    y.set((e.clientY - cy) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    onHoverChange(false);
  };

  return (
    <motion.a
      ref={ref}
      onClick={(e) => { e.preventDefault(); navigate("/demo"); }}
      className="mt-10 relative inline-flex items-center gap-3 border-2 border-accent bg-accent text-primary px-10 py-4 font-bold text-lg tracking-wide overflow-hidden group cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 1.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => onHoverChange(true)}
      onMouseLeave={handleMouseLeave}
      whileHover={{
        scale: 1.08,
        boxShadow:
          "0 0 40px rgba(255,255,0,0.4), 0 0 80px rgba(255,255,0,0.15)",
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
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </motion.svg>
    </motion.a>
  );
}

export default function HeroSection() {
  const [ctaHovered, setCtaHovered] = useState(false);

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

          <MagneticCTA onHoverChange={setCtaHovered} />
        </div>

        <div className="relative hidden md:block">
          <AnimatePresence mode="wait">
            {ctaHovered ? (
              <motion.svg
                key="trash"
                className="w-60 lg:w-72 xl:w-80 -ml-10"
                viewBox="-3 0 32 32"
                fill="#FFFF00"
                initial={{ opacity: 0, y: 80 }}
                animate={{ opacity: 0.9, y: 0 }}
                exit={{ opacity: 0, y: -60 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <path d="M23,8 L3,8 C2.448,8 2,7.553 2,7 C2,6.448 2.448,6 3,6 L23,6 C23.552,6 24,6.448 24,7 C24,7.553 23.552,8 24,8 L23,8 Z M22,28 C22,29.104 21.104,30 20,30 L6,30 C4.896,30 4,29.104 4,28 L4,10 L22,10 L22,28 Z M10,3 C10,2.447 10.448,2 11,2 L15,2 C15.552,2 16,2.447 16,3 L16,4 L10,4 L10,3 Z M24,4 L18,4 L18,2 C18,0.896 17.104,0 16,0 L10,0 C8.896,0 8,0.896 8,2 L8,4 L2,4 C0.896,4 0,4.896 0,6 L0,8 C0,9.104 0.896,10 2,10 L2,28 C2,30.209 3.791,32 6,32 L20,32 C22.209,32 24,30.209 24,28 L24,10 C25.104,10 26,9.104 26,8 L26,6 C26,4.896 25.104,4 24,4 Z M13,28 C13.552,28 14,27.553 14,27 L14,15 C14,14.448 13.552,14 13,14 C12.448,14 12,14.448 12,15 L12,27 C12,27.553 12.448,28 13,28 Z M8,28 C8.552,28 9,27.553 9,27 L9,15 C9,14.448 8.552,14 8,14 C7.448,14 7,14.448 7,15 L7,27 C7,27.553 7.448,28 8,28 Z M18,28 C18.552,28 19,27.553 19,27 L19,15 C19,14.448 18.552,14 18,14 C17.448,14 17,14.448 17,15 L17,27 C17,27.553 17.448,28 18,28 Z" />
              </motion.svg>
            ) : (
              <motion.div key="default" className="relative">
                <motion.img
                  src="/robothand_101074.svg"
                  alt="MA-NO robot hand"
                  className="w-80 lg:w-md xl:w-lg opacity-90"
                  initial={{ opacity: 0, x: 60 }}
                  animate={{ opacity: 0.9, x: 0 }}
                  exit={{ opacity: 0, x: 40, filter: "blur(6px)" }}
                  transition={{
                    duration: 0.35,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
                <motion.img
                  src="/recycling-svgrepo-com.svg"
                  alt="Recycling symbol"
                  className="absolute bottom-[30%] left-1/2 -translate-x-1/2 -ml-5 -mb-5.5 w-12 lg:w-14 xl:w-16"
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 90 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeIn",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
