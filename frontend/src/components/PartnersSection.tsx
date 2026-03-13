import { motion } from "motion/react";
import { Ticker } from "motion-plus/react";
import { useScroll, useTransform } from "motion/react";

const partners = [
  { text: "Cyberwave", reverse: false },
  { text: "Jade Hosting", reverse: true },
  { text: "Cyberwave", reverse: false },
  { text: "Jade Hosting", reverse: true },
];

export default function PartnersSection() {
  const { scrollY } = useScroll();

  const offset1 = useTransform(() => scrollY.get() * 0.5);
  const offset2 = useTransform(() => scrollY.get() * -0.7);
  const offset3 = useTransform(() => scrollY.get() * 0.6);
  const offset4 = useTransform(() => scrollY.get() * -0.8);

  const offsets = [offset1, offset2, offset3, offset4];

  return (
    <section className="bg-primary py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <motion.p
          className="text-accent/40 text-sm font-light tracking-[0.3em] uppercase mb-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          Partners
        </motion.p>

        <motion.h2
          className="text-accent text-4xl md:text-6xl font-bold tracking-tight max-w-3xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          Backed by the{" "}
          <span className="font-serif italic font-normal">best</span>.
        </motion.h2>
      </div>

      <div className="flex flex-col gap-2">
        {partners.map((partner, index) => (
          <Ticker
            key={`${partner.text}-${index}`}
            className="flex items-center"
            items={[
              <span className="text-accent font-bold text-[clamp(48px,10vw,100px)] uppercase tracking-tight px-5 whitespace-nowrap">
                {partner.text}
              </span>,
              <span className="text-transparent font-bold text-[clamp(48px,10vw,100px)] uppercase tracking-tight px-5 whitespace-nowrap [--stroke:2px] [-webkit-text-stroke:var(--stroke)_rgba(255,255,0,0.3)]">
                {partner.text}
              </span>,
            ]}
            offset={offsets[index]}
          />
        ))}
      </div>
    </section>
  );
}
