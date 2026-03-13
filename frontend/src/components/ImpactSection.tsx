import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
    return unsubscribe;
  }, [rounded, suffix]);

  useEffect(() => {
    if (!hasAnimated) return;
    const controls = animate(motionVal, target, { duration: 2, ease: "easeOut" });
    return controls.stop;
  }, [hasAnimated, motionVal, target]);

  return (
    <motion.span
      ref={ref}
      onViewportEnter={() => setHasAnimated(true)}
      viewport={{ once: true, margin: "-100px" }}
    >
      0{suffix}
    </motion.span>
  );
}

const metrics = [
  { value: 95, suffix: "%", label: "Sorting accuracy at home" },
  { value: 0, suffix: "", label: "Seconds of your time", display: "0" },
  { value: 5, suffix: "", label: "Waste categories, one bin" },
  { value: 24, suffix: "/7", label: "Always ready, always sorting" },
];

export default function ImpactSection() {
  return (
    <section className="py-24 px-6 bg-accent">
      <div className="max-w-7xl mx-auto">
        <motion.p
          className="text-primary/50 text-sm font-light tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          The Impact
        </motion.p>

        <motion.h2
          className="text-primary text-4xl md:text-6xl font-bold tracking-tight max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Numbers that{" "}
          <span className="font-serif italic font-normal">matter</span>.
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="relative group p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.1 * i }}
            >
              <span className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-primary/30 group-hover:border-primary/60 transition-colors" />
              <span className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-primary/30 group-hover:border-primary/60 transition-colors" />
              <span className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-primary/30 group-hover:border-primary/60 transition-colors" />
              <span className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-primary/30 group-hover:border-primary/60 transition-colors" />

              <p className="text-primary text-5xl md:text-7xl font-bold tracking-tight">
                {metric.display ? (
                  metric.display
                ) : (
                  <AnimatedCounter target={metric.value} suffix={metric.suffix} />
                )}
              </p>
              <p className="text-primary/50 text-sm font-light mt-2">
                {metric.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
