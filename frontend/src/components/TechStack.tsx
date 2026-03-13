import { motion } from "motion/react";
import { useState } from "react";

interface Tech {
  name: string;
  category: string;
}

const technologies: Tech[] = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Framer Motion", category: "Frontend" },
  { name: "FastAPI", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "OpenCV", category: "Computer Vision" },
  { name: "Feetech SDK", category: "Robotics" },
];

function ScrollHighlightItem({
  tech,
  index,
  isHighlighted,
  onHighlight,
}: {
  tech: Tech;
  index: number;
  isHighlighted: boolean;
  onHighlight: (index: number) => void;
}) {
  return (
    <motion.li
      className="will-change-[opacity] font-bold m-0 p-0 leading-[0.9] uppercase whitespace-nowrap text-accent"
      style={{ fontSize: "clamp(2rem, 8vw, 6rem)" }}
      initial={false}
      animate={{
        opacity: isHighlighted ? 1 : 0.3,
        scale: isHighlighted ? 1.02 : 1,
      }}
      transition={{
        duration: 0.1,
        ease: "linear",
      }}
      onViewportEnter={() => onHighlight(index)}
      viewport={{
        margin: "-28% 0px -68% 0px",
        amount: "some",
      }}
    >
      {tech.name}
    </motion.li>
  );
}

export default function TechStack() {
  const [activeTech, setActiveTech] = useState<number | null>(null);

  return (
    <section className="bg-primary px-6 pt-24 pb-8">
      <div className="max-w-7xl w-full mx-auto flex gap-8 items-start">
        {/* Sticky sidebar title */}
        <div className="sticky top-24 flex-shrink-0 hidden md:block">
          <p className="text-accent/40 text-sm font-light tracking-[0.3em] uppercase mb-4">
            Built With
          </p>
          <h2 className="text-accent text-4xl md:text-6xl font-bold tracking-tight">
            The tech
            <br />
            behind the{" "}
            <span className="font-serif italic font-normal">hand</span>.
          </h2>
        </div>

        {/* Scrolling tech list */}
        <div className="flex-1">
          {/* Mobile-only title */}
          <div className="md:hidden mb-12">
            <p className="text-accent/40 text-sm font-light tracking-[0.3em] uppercase mb-4">
              Built With
            </p>
            <h2 className="text-accent text-4xl font-bold tracking-tight">
              The tech behind the{" "}
              <span className="font-serif italic font-normal">hand</span>.
            </h2>
          </div>

          <ul className="list-none p-0 m-0 flex flex-col gap-5 pt-[20vh] pb-[10vh]">
            {technologies.map((tech, index) => (
              <ScrollHighlightItem
                key={tech.name}
                tech={tech}
                index={index}
                isHighlighted={activeTech === index}
                onHighlight={() => setActiveTech(index)}
              />
            ))}
          </ul>
        </div>
      </div>

    </section>
  );
}
