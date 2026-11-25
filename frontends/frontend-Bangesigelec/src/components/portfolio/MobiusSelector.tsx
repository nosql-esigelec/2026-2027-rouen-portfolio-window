import { animate, motion, type AnimationPlaybackControls } from "framer-motion";
import { Flame, MoveHorizontal, Snowflake, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent } from "react";

import { MODE_COPY, MODES, ZONES, clamp01, modeFromT, type Mode } from "@/lib/mode";
import { VB_H, VB_W, orbPoint, ribbonPath, spinePath, tFromX, zoneFromX } from "@/lib/mobius";
import { cn } from "@/lib/utils";

interface Props {
  t: number;
  onChange: (t: number) => void;
}

const PARTICLES = Array.from({ length: 18 }, (_, i) => {
  const angle = (i / 18) * Math.PI * 2;
  const r = 14 + ((i * 37) % 26);
  return { i, dx: Math.cos(angle) * r, dy: Math.sin(angle) * r * 0.7, d: 1.6 + (i % 5) * 0.35 };
});

export function MobiusSelector({ t, onChange }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const tRef = useRef(t);
  const anim = useRef<AnimationPlaybackControls | null>(null);
  const [dragging, setDragging] = useState(false);
  const mode = modeFromT(t);

  useEffect(() => {
    tRef.current = t;
  }, [t]);

  const set = useCallback((v: number) => onChange(clamp01(v)), [onChange]);

  const glideTo = useCallback(
    (target: number) => {
      anim.current?.stop();
      anim.current = animate(tRef.current, target, {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: set,
      });
    },
    [set],
  );

  /** Abscisse du pointeur dans le repère du SVG (0 → 800). */
  const svgX = (e: PointerEvent) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return orbPoint(tRef.current).x;
    return ((e.clientX - rect.left) / rect.width) * VB_W;
  };

  const onPointerDown = (e: PointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    anim.current?.stop();
    setDragging(true);
  };
  const onPointerMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    set(tFromX(svgX(e)));
  };
  // Clic ou fin de glissement : l'orbe rejoint la zone (gauche / milieu / droite) sous le pointeur.
  const onPointerUp = (e: PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    setDragging(false);
    glideTo(ZONES[zoneFromX(svgX(e))]);
  };
  const onPointerCancel = () => {
    if (!dragging) return;
    setDragging(false);
    glideTo(ZONES[zoneFromX(orbPoint(tRef.current).x)]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const idx = MODES.indexOf(mode);
    let next: Mode | null = null;
    if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = MODES[Math.max(0, idx - 1)] ?? null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp")
      next = MODES[Math.min(MODES.length - 1, idx + 1)] ?? null;
    if (e.key === "Home") next = "chaud";
    if (e.key === "End") next = "froid";
    if (next) {
      e.preventDefault();
      glideTo(ZONES[next]);
    }
  };

  const geo = useMemo(
    () => ({
      left: ribbonPath(Math.PI / 2, (3 * Math.PI) / 2),
      right: ribbonPath(-Math.PI / 2, Math.PI / 2),
      spine: spinePath(0, Math.PI * 2),
      track: spinePath(Math.PI, 0),
      leftFlow: spinePath(Math.PI / 2, (3 * Math.PI) / 2),
      rightFlow: spinePath(-Math.PI / 2, Math.PI / 2),
      zones: MODES.map((m) => ({ m, p: orbPoint(ZONES[m]) })),
    }),
    [],
  );

  const orb = orbPoint(t);

  return (
    <div className="w-full">
      <div className="relative mx-auto w-full max-w-4xl">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          className={cn(
            "w-full touch-none select-none outline-none",
            dragging ? "cursor-grabbing" : "cursor-grab",
          )}
          role="slider"
          tabIndex={0}
          aria-label="Ruban de Möbius : passer du Chaud au Froid"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(t * 100)}
          aria-valuetext={MODE_COPY[mode].label}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onKeyDown={onKeyDown}
        >
          <defs>
            <linearGradient id="mobius-grad" gradientUnits="userSpaceOnUse" x1="60" x2="740" y1="0" y2="0">
              <stop offset="0" style={{ stopColor: "var(--hot-2)" }} />
              <stop offset="0.28" style={{ stopColor: "var(--hot-1)" }} />
              <stop offset="0.5" style={{ stopColor: "var(--twist)" }} />
              <stop offset="0.72" style={{ stopColor: "var(--cold-1)" }} />
              <stop offset="1" style={{ stopColor: "var(--cold-2)" }} />
            </linearGradient>
            <linearGradient id="mobius-shade" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stopColor="white" stopOpacity="0.35" />
              <stop offset="0.5" stopColor="white" stopOpacity="0" />
              <stop offset="1" stopColor="black" stopOpacity="0.35" />
            </linearGradient>
            <radialGradient id="twist-shadow" cx="400" cy="150" r="70" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="black" stopOpacity="0.55" />
              <stop offset="1" stopColor="black" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="orb-core">
              <stop offset="0" stopColor="white" />
              <stop offset="0.45" style={{ stopColor: "var(--live-2)" }} />
              <stop offset="1" style={{ stopColor: "var(--live)" }} />
            </radialGradient>
            <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" />
            </filter>
            <filter id="ribbon-depth" x="-10%" y="-20%" width="120%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="black" floodOpacity="0.55" />
            </filter>
            <filter id="energy-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>

          {/* Halo général */}
          <path d={geo.spine} fill="none" stroke="url(#mobius-grad)" strokeWidth="40" opacity="0.18" filter="url(#soft-glow)" />

          {/* Boucle gauche (arrière) */}
          <path d={geo.left} fill="url(#mobius-grad)" opacity="0.92" />
          <path d={geo.left} fill="url(#mobius-shade)" opacity="0.7" />
          <ellipse cx="400" cy="150" rx="70" ry="50" fill="url(#twist-shadow)" />

          {/* Boucle droite (avant, passe par-dessus à la torsion) */}
          <g filter="url(#ribbon-depth)">
            <path d={geo.right} fill="url(#mobius-grad)" />
            <path d={geo.right} fill="url(#mobius-shade)" opacity="0.7" />
          </g>
          <path d={geo.left} fill="none" stroke="white" strokeOpacity="0.18" strokeWidth="1" />
          <path d={geo.right} fill="none" stroke="white" strokeOpacity="0.22" strokeWidth="1" />

          {/* Flux d'énergie : lave pulsante à gauche, éclats de givre à droite */}
          <path d={geo.leftFlow} fill="none" stroke="var(--hot-2)" strokeWidth="3.2" strokeLinecap="round" className="lava-flow" filter="url(#energy-glow)" />
          <path d={geo.rightFlow} fill="none" stroke="var(--ice-light)" strokeWidth="2.2" strokeLinecap="round" className="ice-flow" filter="url(#energy-glow)" />

          {/* Particules du croisement */}
          <g className="layer-hybrid">
            {PARTICLES.map((p) => (
              <motion.circle
                key={p.i}
                cx={400}
                cy={150}
                r={p.i % 3 === 0 ? 2.2 : 1.4}
                fill={p.i % 2 ? "var(--hot-2)" : "var(--cold-2)"}
                animate={{ cx: [400, 400 + p.dx, 400], cy: [150, 150 + p.dy, 150], opacity: [0, 1, 0] }}
                transition={{ duration: p.d, repeat: Infinity, ease: "easeInOut", delay: p.i * 0.08 }}
              />
            ))}
          </g>

          {/* Zones magnétiques */}
          {geo.zones.map(({ m, p }) => (
            <g key={m} opacity={m === mode ? 1 : 0.55}>
              <circle cx={p.x} cy={p.y} r="9" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="1.2" strokeDasharray="3 3" />
              <circle cx={p.x} cy={p.y} r="2.5" fill="white" />
            </g>
          ))}

          {/* Orbe */}
          <g transform={`translate(${orb.x} ${orb.y})`} style={{ pointerEvents: "none" }}>
            <circle r="34" fill="var(--live)" opacity="0.45" filter="url(#soft-glow)" />
            <circle r="13" fill="none" stroke="var(--live-2)" strokeWidth="1.5" className="orb-pulse" />
            <circle r="13" fill="url(#orb-core)" />
            <circle r="4" cx="-4" cy="-4" fill="white" opacity="0.8" />
          </g>
        </svg>

        {!dragging && (
          <div className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center">
            <span className="nudge-x inline-flex items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
              <MoveHorizontal className="size-3.5" /> Glissez l'orbe
            </span>
          </div>
        )}
      </div>

      <div className="mx-auto mt-8 grid max-w-3xl grid-cols-3 gap-2 sm:gap-4">
        {MODES.map((m) => {
          const active = m === mode;
          return (
            <button
              key={m}
              type="button"
              onClick={() => glideTo(ZONES[m])}
              aria-pressed={active}
              className={cn(
                "group rounded-full border px-2 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.14em] transition-all sm:px-4 sm:text-xs",
                active
                  ? "border-live bg-accent text-foreground shadow-glow"
                  : "border-border text-muted-foreground hover:border-live/60 hover:text-foreground",
              )}
            >
              <span className="mr-2 inline-flex align-middle">
                {m === "chaud" && <Flame className="size-3.5 text-hot" />}
                {m === "hybride" && <Sparkles className="size-3.5 text-live" />}
                {m === "froid" && <Snowflake className="size-3.5 text-cold" />}
              </span>
              {MODE_COPY[m].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
