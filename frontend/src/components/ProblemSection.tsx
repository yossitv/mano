import { motion } from "motion/react";

const stats = [
  { value: "5+", label: "bins to remember at home — plastic, paper, glass, organic, mixed" },
  { value: "62%", label: "of people admit they throw recyclables in the wrong bin" },
  { value: "15min", label: "wasted every week sorting and second-guessing your trash" },
];

export default function ProblemSection() {
  return (
    <section className="min-h-screen bg-primary flex items-center justify-center px-6 py-24">
      <div className="max-w-7xl w-full">
        <motion.p
          className="text-accent/40 text-sm font-light tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          The Problem
        </motion.p>

        <motion.h2
          className="text-accent text-4xl md:text-6xl font-bold tracking-tight max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Nobody wants to{" "}
          <span className="font-serif italic font-normal">think</span> about trash.
        </motion.h2>

        <motion.p
          className="text-accent/60 text-lg md:text-xl font-light mt-6 max-w-2xl leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          Is this plastic recyclable? Does the lid go separately? Every day you
          stand in front of your bins, guessing. Get it wrong and your recycling
          ends up in a landfill anyway.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="border border-accent/10 rounded-2xl p-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <p className="text-accent text-5xl md:text-6xl font-bold tracking-tight">
                {stat.value}
              </p>
              <p className="text-accent/50 text-sm font-light mt-3 leading-relaxed">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
