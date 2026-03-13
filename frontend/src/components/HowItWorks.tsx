import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Scan",
    description:
      "Just toss your waste in. MA-NO's camera instantly recognizes what you've thrown away.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M17.36 17.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M17.36 6.64l1.42-1.42" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Classify",
    description:
      "The AI identifies the material in milliseconds — plastic, glass, metal, organic, or general waste.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Sort",
    description:
      "The robotic arm drops it into the right compartment. No thinking, no mistakes, no effort.",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10">
        <path d="M9 5H2v7l6.29 6.29a1 1 0 001.42 0l5.58-5.58a1 1 0 000-1.42L9 5z" />
        <circle cx="6" cy="9" r="1" fill="currentColor" />
        <path d="M15 4l6 6-6.29 6.29" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="min-h-screen bg-primary flex items-center justify-center px-6 py-24">
      <div className="max-w-7xl w-full">
        <motion.p
          className="text-accent/40 text-sm font-light tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          How It Works
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.h2
            className="text-accent text-4xl md:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            Three steps.{" "}
            <span className="font-serif italic font-normal">Zero</span> effort.
          </motion.h2>

          {/* Video */}
          <motion.div
            className="border border-accent/10 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/30 z-10" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/30 z-10" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/30 z-10" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/30 z-10" />

            <div className="aspect-video bg-primary flex flex-col items-center justify-center gap-4">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-20 h-20 text-accent/40"
              >
                <path d="M8 5v14l11-7z" />
              </svg>

              <p className="text-accent/20 text-sm font-light tracking-widest uppercase">
                Sorting demo
              </p>
            </div>

            <div className="border-t border-accent/10 px-6 py-3 flex items-center justify-between">
              <p className="text-accent/40 text-xs font-light tracking-wide">
                MA-<span className="font-serif italic">NO</span> — Live sorting
              </p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              className="relative p-8 group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.15 * i, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-accent/30 group-hover:border-accent/60 transition-colors" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-accent/30 group-hover:border-accent/60 transition-colors" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-accent/30 group-hover:border-accent/60 transition-colors" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-accent/30 group-hover:border-accent/60 transition-colors" />

              <span className="text-accent/20 text-7xl font-bold absolute top-4 right-6 select-none">
                {step.number}
              </span>

              <div className="text-accent/70 mb-6">{step.icon}</div>

              <h3 className="text-accent text-2xl font-bold tracking-tight">
                {step.title}
              </h3>

              <p className="text-accent/50 text-sm font-light mt-3 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
