import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import VideoPlayer from "./VideoPlayer";


const materials = [
  {
    id: "plastic",
    label: "Plastic",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <path
          d="M22 8h20l4 48H18L22 8z"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <path
          d="M26 8V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M28 20v20M36 22v16"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </svg>
    ),
    color: "#3B82F6",
    video: null,
    description: "Bottles, containers, packaging",
    accuracy: "97.2%",
    speed: "0.8s",
    steps: [
      {
        title: "Detection",
        desc: "The camera identifies the plastic object on the conveyor belt using computer vision.",
      },
      {
        title: "Classification",
        desc: "The AI model classifies the plastic type (PET, HDPE, PP) for optimal recycling.",
      },
      {
        title: "Sorting",
        desc: "The robotic arm grabs the object and places it into the correct bin.",
      },
    ],
  },
  {
    id: "paper",
    label: "Paper",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <rect
          x="14"
          y="6"
          width="36"
          height="52"
          rx="2"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M22 18h20M22 26h20M22 34h14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M14 44l36-38"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.2"
        />
      </svg>
    ),
    color: "#F59E0B",
    video: "/paper2.mov",
    description: "Newspapers, cardboard, sheets, packaging",
    accuracy: "98.5%",
    speed: "0.6s",
    steps: [
      {
        title: "Detection",
        desc: "The optical sensor detects paper-based material and analyzes its surface texture.",
      },
      {
        title: "Classification",
        desc: "The algorithm distinguishes between corrugated cardboard, newsprint, and coated paper.",
      },
      {
        title: "Sorting",
        desc: "The arm picks up the material and directs it to the press for compaction.",
      },
    ],
  },
  {
    id: "cans",
    label: "Cans",
    icon: (
      <svg viewBox="0 0 64 64" fill="none" className="w-10 h-10">
        <ellipse
          cx="32"
          cy="12"
          rx="14"
          ry="6"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <path
          d="M18 12v40c0 3.3 6.3 6 14 6s14-2.7 14-6V12"
          stroke="currentColor"
          strokeWidth="2.5"
        />
        <ellipse
          cx="32"
          cy="52"
          rx="14"
          ry="6"
          stroke="currentColor"
          strokeWidth="2.5"
          opacity="0.3"
        />
        <path
          d="M22 28h20"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.3"
        />
      </svg>
    ),
    color: "#EF4444",
    video: "/can.mov",
    description: "Aluminum, steel, tin cans",
    accuracy: "99.1%",
    speed: "0.5s",
    steps: [
      {
        title: "Detection",
        desc: "The induction sensor detects the presence of metal and activates the vision system.",
      },
      {
        title: "Classification",
        desc: "The model distinguishes between aluminum and steel to optimize the smelting process.",
      },
      {
        title: "Sorting",
        desc: "The magnetic gripper grabs the can and places it into the dedicated container.",
      },
    ],
  },
] as const;

type MaterialId = (typeof materials)[number]["id"];

export default function DemoPage() {
  const [active, setActive] = useState<MaterialId>("plastic");
  const current = materials.find((m) => m.id === active)!;

  return (
    <section className="min-h-screen bg-primary pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Title + Video side by side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              className="text-accent text-5xl md:text-7xl font-bold tracking-tighter"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              How it works
              <span className="font-serif italic font-normal">.</span>
            </motion.h1>

            <motion.p
              className="text-accent/50 text-lg font-light mt-4 max-w-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Select a material to see how MA-
              <span className="font-serif italic">NO</span> recognizes and sorts it
              automatically.
            </motion.p>
          </div>

          {/* Video */}
          <motion.div
            className="border border-accent/10 relative overflow-hidden"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/30 z-10" />
            <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/30 z-10" />
            <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/30 z-10" />
            <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/30 z-10" />

            {current.video ? (
              <VideoPlayer
                src={current.video}
                label={current.label}
                accuracy={current.accuracy}
                speed={current.speed}
              />
            ) : (
              <>
                <div className="aspect-video bg-primary flex flex-col items-center justify-center gap-4">
                  <motion.div
                    className="w-16 h-16 rounded-full border-2 border-accent/20 flex items-center justify-center"
                    animate={{ scale: [1, 1.08, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-accent/30 ml-1"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </motion.div>

                  <p className="text-accent/20 text-sm font-light tracking-widest uppercase">
                    {current.label} sorting demo
                  </p>
                </div>

                <div className="border-t border-accent/10 px-6 py-3 flex items-center justify-between">
                  <p className="text-accent/40 text-xs font-light tracking-wide">
                    MA-<span className="font-serif italic">NO</span> — {current.label} sorting
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-accent/20 text-xs font-light">
                      {current.accuracy} accuracy
                    </span>
                    <span className="w-px h-3 bg-accent/10" />
                    <span className="text-accent/20 text-xs font-light">
                      {current.speed} per item
                    </span>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </div>

        {/* Material tabs */}
        <motion.div
          className="flex gap-3 mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => setActive(mat.id)}
              className={`relative flex items-center gap-3 px-6 py-4 border-2 font-bold text-sm tracking-wide transition-all duration-300 cursor-pointer ${
                active === mat.id
                  ? "border-accent bg-accent text-primary"
                  : "border-accent/20 text-accent/60 hover:border-accent/40 hover:text-accent"
              }`}
            >
              <span
                className={`transition-colors duration-300 ${
                  active === mat.id ? "text-primary" : "text-accent/60"
                }`}
              >
                {mat.icon}
              </span>
              {mat.label}
            </button>
          ))}
        </motion.div>

        {/* Content area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-12"
          >
            {/* Stats bar */}
            <div className="flex gap-8 mb-12">
              <div className="border border-accent/10 px-6 py-4">
                <p className="text-accent/40 text-xs font-light tracking-widest uppercase">
                  Material
                </p>
                <p className="text-accent text-lg font-bold mt-1">
                  {current.label}
                </p>
                <p className="text-accent/40 text-sm font-light">
                  {current.description}
                </p>
              </div>
              <div className="border border-accent/10 px-6 py-4">
                <p className="text-accent/40 text-xs font-light tracking-widest uppercase">
                  Accuracy
                </p>
                <p className="text-accent text-3xl font-bold mt-1">
                  {current.accuracy}
                </p>
              </div>
              <div className="border border-accent/10 px-6 py-4">
                <p className="text-accent/40 text-xs font-light tracking-widest uppercase">
                  Sorting time
                </p>
                <p className="text-accent text-3xl font-bold mt-1">
                  {current.speed}
                </p>
              </div>
            </div>

            {/* Process steps */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Connector lines spanning the gaps */}
              <div className="hidden md:block absolute top-1/2 left-0 right-0 -translate-y-1/2 pointer-events-none">
                <div className="mx-8 h-px bg-accent/20" />
              </div>

              {current.steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="relative border border-accent/10 bg-primary p-8 group hover:border-accent/30 transition-colors z-10"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                >
                  {/* Step number */}
                  <span className="text-accent/10 text-7xl font-bold absolute top-4 right-6 select-none">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div className="relative z-10">
                    <h3 className="text-accent text-xl font-bold tracking-tight">
                      {step.title}
                    </h3>
                    <p className="text-accent/50 text-sm font-light mt-3 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  {/* Animated accent bar */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-accent"
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + i * 0.2,
                      ease: "easeOut",
                    }}
                  />
                </motion.div>
              ))}
            </div>

          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
