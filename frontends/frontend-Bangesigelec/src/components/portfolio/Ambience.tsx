import { useMemo, type CSSProperties } from "react";

/** Générateur pseudo-aléatoire déterministe (même rendu serveur et navigateur). */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let r = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function CourtLines() {
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full text-hot" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="40" y="40" width="920" height="480" rx="4" />
      <line x1="500" y1="40" x2="500" y2="520" />
      <circle cx="500" cy="280" r="70" />
      <circle cx="500" cy="280" r="22" />
      <rect x="40" y="200" width="190" height="160" />
      <rect x="770" y="200" width="190" height="160" />
      <circle cx="230" cy="280" r="60" />
      <circle cx="770" cy="280" r="60" />
      <path d="M40 75 H120 A230 230 0 0 1 120 485 H40" />
      <path d="M960 75 H880 A230 230 0 0 0 880 485 H960" />
      <circle cx="92" cy="280" r="9" />
      <circle cx="908" cy="280" r="9" />
    </svg>
  );
}

function GraphMesh() {
  const { nodes, edges } = useMemo(() => {
    const rand = mulberry32(42);
    const nodes = Array.from({ length: 46 }, () => ({ x: rand() * 1000, y: rand() * 560, r: 1.5 + rand() * 3 }));
    const edges: [number, number][] = [];
    nodes.forEach((a, i) =>
      nodes.forEach((b, j) => {
        if (j > i && Math.hypot(a.x - b.x, a.y - b.y) < 150) edges.push([i, j]);
      }),
    );
    return { nodes, edges };
  }, []);
  return (
    <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid slice" className="h-full w-full text-cold">
      {edges.map(([i, j]) => (
        <line key={`${i}-${j}`} x1={nodes[i]!.x} y1={nodes[i]!.y} x2={nodes[j]!.x} y2={nodes[j]!.y} stroke="currentColor" strokeWidth="0.7" opacity="0.6" />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="currentColor" />
      ))}
    </svg>
  );
}

/** Coulées de lave, roche basaltique et braises qui montent du cratère. */
function VolcanoScene() {
  const embers = useMemo(() => {
    const rand = mulberry32(107);
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 270 + rand() * 145,
      y: 430 + rand() * 260,
      r: 1.2 + rand() * 2.4,
      drift: -55 + rand() * 110,
      delay: -rand() * 5,
      duration: 3.2 + rand() * 3.8,
    }));
  }, []);

  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="volcano-rock" x1="0" y1="0" x2="0.75" y2="1">
          <stop offset="0" stopColor="var(--rock-lit)" />
          <stop offset="0.5" stopColor="var(--rock)" />
          <stop offset="1" stopColor="var(--background)" />
        </linearGradient>
        <linearGradient id="lava" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--hot-2)" />
          <stop offset="0.45" stopColor="var(--hot-1)" />
          <stop offset="1" stopColor="var(--lava-deep)" stopOpacity="0.15" />
        </linearGradient>
        <radialGradient id="crater-aura">
          <stop offset="0" stopColor="var(--hot-2)" stopOpacity="0.6" />
          <stop offset="0.45" stopColor="var(--hot-1)" stopOpacity="0.18" />
          <stop offset="1" stopColor="var(--hot-1)" stopOpacity="0" />
        </radialGradient>
        <filter id="volcano-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur stdDeviation="7" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="smoke-blur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="24" />
        </filter>
      </defs>

      <ellipse cx="330" cy="435" rx="225" ry="190" fill="url(#crater-aura)" className="crater-aura" />

      <g filter="url(#smoke-blur)" fill="var(--smoke)" opacity="0.3">
        <ellipse cx="315" cy="325" rx="82" ry="115" className="smoke-puff" />
        <ellipse cx="255" cy="220" rx="110" ry="85" className="smoke-puff" style={{ animationDelay: "-2s" }} />
        <ellipse cx="355" cy="135" rx="145" ry="80" className="smoke-puff" style={{ animationDelay: "-4s" }} />
      </g>

      <path d="M-80 1000 L75 820 L160 680 L238 545 L286 444 Q326 420 365 452 L414 575 L474 710 L585 1000 Z" fill="url(#volcano-rock)" opacity="0.92" />
      <path d="M75 820 L238 545 L286 444 L309 463 L250 650 L205 760 L175 1000 L-80 1000 Z" fill="var(--rock-lit)" opacity="0.18" />
      <path d="M365 452 L414 575 L474 710 L585 1000 L390 1000 L365 735 L338 585 Z" fill="var(--rock)" opacity="0.5" />
      <path d="M278 449 Q324 417 372 454 Q330 487 278 449 Z" fill="var(--lava-deep)" filter="url(#volcano-glow)" />
      <path d="M290 450 Q326 434 360 454 Q327 468 290 450 Z" fill="var(--hot-2)" />

      <g fill="none" stroke="url(#lava)" strokeLinecap="round" filter="url(#volcano-glow)">
        <path d="M315 464 C300 535 340 565 309 633 C282 690 295 743 247 820 C222 859 231 919 208 1000" strokeWidth="10" className="lava-stream" />
        <path d="M341 463 C359 524 337 567 374 624 C408 675 386 729 427 790 C453 829 445 891 480 947" strokeWidth="7" className="lava-stream" style={{ animationDelay: "-1.4s" }} />
        <path d="M309 631 C268 639 251 675 222 693" strokeWidth="4" className="lava-stream" style={{ animationDelay: "-2.1s" }} />
        <path d="M374 624 C403 616 419 638 438 652" strokeWidth="3" className="lava-stream" style={{ animationDelay: "-0.7s" }} />
      </g>
      <g fill="none" stroke="var(--hot-2)" strokeLinecap="round" opacity="0.8">
        <path d="M315 464 C300 535 340 565 309 633 C282 690 295 743 247 820" strokeWidth="2.2" className="lava-stream" />
        <path d="M341 463 C359 524 337 567 374 624 C408 675 386 729 427 790" strokeWidth="1.6" className="lava-stream" />
      </g>

      <g fill="var(--hot-2)" filter="url(#volcano-glow)">
        {embers.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.r}
            className="ember"
            style={{ "--drift": `${p.drift}px`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/** Facettes gelées, cristaux translucides et chute de neige. */
function IceScene() {
  const snow = useMemo(() => {
    const rand = mulberry32(209);
    return Array.from({ length: 34 }, (_, i) => ({
      id: i,
      x: 470 + rand() * 450,
      y: 30 + rand() * 900,
      r: 0.8 + rand() * 2.2,
      drift: -45 + rand() * 65,
      delay: -rand() * 8,
      duration: 5 + rand() * 6,
      opacity: 0.25 + rand() * 0.55,
    }));
  }, []);

  return (
    <svg viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" className="h-full w-full">
      <defs>
        <linearGradient id="ice-body" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--ice-light)" stopOpacity="0.55" />
          <stop offset="0.42" stopColor="var(--cold-1)" stopOpacity="0.2" />
          <stop offset="1" stopColor="var(--cold-2)" stopOpacity="0.03" />
        </linearGradient>
        <linearGradient id="ice-facet" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--ice-light)" stopOpacity="0.65" />
          <stop offset="1" stopColor="var(--cold-1)" stopOpacity="0.05" />
        </linearGradient>
        <radialGradient id="ice-aura">
          <stop offset="0" stopColor="var(--cold-2)" stopOpacity="0.28" />
          <stop offset="1" stopColor="var(--cold-1)" stopOpacity="0" />
        </radialGradient>
        <filter id="ice-glow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <ellipse cx="725" cy="620" rx="260" ry="360" fill="url(#ice-aura)" />

      <g stroke="var(--cold-2)" strokeWidth="1.4" strokeLinejoin="round" className="ice-crystal">
        <path d="M694 370 L753 582 L735 1000 L605 1000 L634 600 Z" fill="url(#ice-body)" />
        <path d="M694 370 L692 740 L605 1000 L634 600 Z" fill="url(#ice-facet)" opacity="0.45" />
        <path d="M694 370 L753 582 L692 740 Z" fill="var(--ice-light)" opacity="0.12" />
        <path d="M793 500 L852 688 L867 1000 L742 1000 L752 690 Z" fill="url(#ice-body)" />
        <path d="M793 500 L803 760 L742 1000 L752 690 Z" fill="url(#ice-facet)" opacity="0.35" />
        <path d="M568 600 L616 733 L590 1000 L490 1000 L522 748 Z" fill="url(#ice-body)" opacity="0.75" />
        <path d="M568 600 L559 812 L490 1000 L522 748 Z" fill="url(#ice-facet)" opacity="0.3" />
        <path d="M867 690 L915 810 L940 1000 L850 1000 L842 816 Z" fill="url(#ice-body)" opacity="0.65" />
      </g>

      <g fill="none" stroke="var(--ice-light)" strokeWidth="1" opacity="0.2">
        <path d="M694 410 L694 735 L640 925 M694 735 L731 865 M662 560 L714 610 M653 676 L707 628" />
        <path d="M793 540 L803 760 L780 914 M803 760 L842 875 M772 652 L817 700" />
        <path d="M568 640 L559 812 L532 926 M559 812 L590 885" />
      </g>
      <g fill="none" stroke="var(--cold-2)" strokeWidth="2" filter="url(#ice-glow)" opacity="0.38" className="ice-shimmer">
        <path d="M694 370 L753 582 L735 1000 M694 370 L634 600 L605 1000" />
        <path d="M793 500 L852 688 L867 1000 M793 500 L752 690 L742 1000" />
      </g>

      <g fill="var(--ice-light)">
        {snow.map((p) => (
          <circle
            key={p.id}
            cx={p.x}
            cy={p.y}
            r={p.r}
            opacity={p.opacity}
            className="snowflake"
            style={{ "--drift": `${p.drift}px`, animationDelay: `${p.delay}s`, animationDuration: `${p.duration}s` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}

/** Fond d'ambiance : volcan (chaud) et banquise (froid) en fondu selon la position de l'orbe. */
export function Ambience() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="layer-hot absolute inset-0 halo-hot" />
      <div className="layer-cold absolute inset-0 halo-cold" />
      <div className="layer-hybrid absolute inset-0 halo-hybrid" />
      <div className="layer-hot absolute inset-0">
        <VolcanoScene />
        <div className="absolute inset-0 opacity-[0.035]"><CourtLines /></div>
      </div>
      <div className="layer-cold absolute inset-0">
        <IceScene />
        <div className="absolute inset-0 opacity-[0.05]"><GraphMesh /></div>
      </div>
      <div className="scene-vignette absolute inset-0" />
      <div className="grain absolute inset-0" />
    </div>
  );
}
