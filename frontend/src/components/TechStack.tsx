import { motion } from "motion/react";

const technologies = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Python", category: "Backend / AI" },
  { name: "Computer Vision", category: "Backend / AI" },
  { name: "TensorFlow", category: "Backend / AI" },
];

export default function TechStack() {
  return (
    <section className="min-h-[60vh] bg-primary flex items-center justify-center px-6 py-24">
      <div className="max-w-7xl w-full">
        <motion.p
          className="text-accent/40 text-sm font-light tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Built With
        </motion.p>

        <motion.h2
          className="text-accent text-4xl md:text-6xl font-bold tracking-tight max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          The tech behind the{" "}
          <span className="font-serif italic font-normal">hand</span>.
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-16">
          {technologies.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="border border-accent/10 rounded-2xl p-6 hover:border-accent/30 transition-colors"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.08 * i }}
            >
              <p className="text-accent text-lg font-bold">{tech.name}</p>
              <p className="text-accent/40 text-xs font-light mt-1 tracking-wide">
                {tech.category}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 pt-8 border-t border-accent/10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <p className="text-accent/30 text-sm font-light">
            Powered by <span className="text-accent/60 font-normal">Cyberwave</span>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
