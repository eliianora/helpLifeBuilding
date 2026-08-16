import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import { MARQUEE_ITEMS } from "@/lib/brand";

export function MarqueeBar() {
  const [paused, setPaused] = useState(false);
  const items = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS];

  return (
    <div className="relative overflow-hidden bg-ink text-white">
      <div
        className="animate-marquee flex w-max whitespace-nowrap py-2.5"
        style={{ animationPlayState: paused ? "paused" : "running" }}
      >
        {items.map((item, i) => (
          <Link
            key={`${item.text}-${i}`}
            to={item.to}
            className="mx-8 inline-flex items-center gap-3 text-sm text-white/80 transition-colors hover:text-primary"
          >
            <item.icon className="size-4 text-primary" aria-hidden />
            <span>{item.text}</span>
            <span className="text-primary">•</span>
          </Link>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setPaused((p) => !p)}
        aria-label={paused ? "Reprendre le défilement" : "Mettre en pause le défilement"}
        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-sm bg-white/10 p-1.5 text-white/80 transition-colors hover:text-white"
      >
        {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
      </button>
    </div>
  );
}
