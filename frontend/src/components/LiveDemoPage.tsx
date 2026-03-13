import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";

// In dev, Vite proxies /api to the backend (handles ngrok headers).
// In production, set VITE_BACKEND_URL for direct access.
const BACKEND = import.meta.env.PROD
  ? import.meta.env.VITE_BACKEND_URL || ""
  : "";

type Status = {
  status: "idle" | "playing" | "error";
  scenario_id?: number;
  current_frame?: number;
  total_frames?: number;
  progress_percent?: number;
};

export default function LiveDemoPage() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const [status, setStatus] = useState<Status>({ status: "idle" });
  const [error, setError] = useState<string | null>(null);
  const [cameraOk, setCameraOk] = useState(true);
  const polling = useRef<ReturnType<typeof setInterval> | null>(null);

  const isPlaying = status.status === "playing";

  const pollStatus = useCallback(() => {
    if (polling.current) return;
    polling.current = setInterval(async () => {
      try {
        const res = await fetch(`${BACKEND}/api/so-01/status`);
        const data: Status = await res.json();
        setStatus(data);
        if (data.status !== "playing" && polling.current) {
          clearInterval(polling.current);
          polling.current = null;
        }
      } catch {
        /* ignore */
      }
    }, 500);
  }, []);

  useEffect(() => {
    return () => {
      if (polling.current) clearInterval(polling.current);
    };
  }, []);

  const handleClearing = async () => {
    if (isPlaying || !scenarioId) return;
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/so-01/${scenarioId}`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        const msg =
          res.status === 404
            ? "Scenario not found"
            : res.status === 409
              ? "Already running"
              : res.status === 503
                ? "Robot offline"
                : body?.detail || "Request failed";
        setError(msg);
        return;
      }
      const data = await res.json();
      setStatus({ status: "playing", ...data });
      pollStatus();
    } catch {
      setError("Cannot connect to backend");
    }
  };

  return (
    <section className="min-h-screen bg-primary pt-28 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-accent/50 hover:text-accent text-sm font-light tracking-wide transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-4 h-4"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-accent text-4xl md:text-5xl font-bold tracking-tighter mt-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Live Demo
          <span className="font-serif italic font-normal">.</span>
          <span className="text-accent/40 text-2xl ml-4 font-light">
            Scenario {scenarioId}
          </span>
        </motion.h1>

        {/* Camera feed */}
        <motion.div
          className="mt-10 border border-accent/10 relative overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Corner brackets */}
          <span className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-accent/30 z-10" />
          <span className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-accent/30 z-10" />
          <span className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-accent/30 z-10" />
          <span className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-accent/30 z-10" />

          {/* Live indicator */}
          <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
            </span>
            <span className="text-accent/60 text-xs font-light tracking-widest uppercase">
              Live
            </span>
          </div>

          <div className="aspect-video bg-black">
            {cameraOk ? (
              <img
                src={`${BACKEND}/api/so-01/stream`}
                alt="Live camera feed"
                className="w-full h-full object-cover"
                onError={() => setCameraOk(false)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-white/30 text-sm font-light tracking-widest uppercase">
                  Camera offline
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Clearing button + status */}
        <motion.div
          className="mt-8 flex flex-col items-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <button
            onClick={handleClearing}
            disabled={isPlaying}
            className={`
              relative px-12 py-4 text-lg font-bold tracking-wide transition-all duration-300 cursor-pointer
              ${
                isPlaying
                  ? "border-2 border-accent/20 text-accent/40 cursor-not-allowed"
                  : "border-2 border-accent bg-accent text-primary hover:bg-transparent hover:text-accent"
              }
            `}
          >
            {isPlaying ? (
              <span className="flex items-center gap-3">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Running...
              </span>
            ) : (
              "Clearing"
            )}
          </button>

          {/* Progress */}
          {isPlaying && status.total_frames && (
            <div className="w-full max-w-md">
              <div className="flex justify-between text-accent/40 text-xs font-light mb-2">
                <span>
                  Frame {status.current_frame} / {status.total_frames}
                </span>
                <span>{status.progress_percent?.toFixed(1)}%</span>
              </div>
              <div className="w-full h-1 bg-accent/10 overflow-hidden">
                <motion.div
                  className="h-full bg-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${status.progress_percent || 0}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-red-400 text-sm font-light">{error}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
