/** Géométrie du ruban de Möbius (lemniscate de Bernoulli) dans un viewBox 800×300. */
export const VB_W = 800;
export const VB_H = 300;
const CX = 400;
const CY = 150;
const A = 330;

export interface Pt {
  x: number;
  y: number;
}

export function lemniscate(s: number): Pt {
  const sin = Math.sin(s);
  const cos = Math.cos(s);
  const d = 1 + sin * sin;
  return { x: CX + (A * cos) / d, y: CY + (A * sin * cos) / d };
}

/** t = 0 boucle gauche, 0.5 croisement, 1 boucle droite. */
export function orbPoint(t: number): Pt {
  return lemniscate(Math.PI * (1 - t));
}

/** Demi-largeur du ruban : fine au croisement (torsion), large aux extrémités. */
export function ribbonWidth(s: number): number {
  return 3 + 24 * Math.pow(Math.abs(Math.cos(s)), 1.3);
}

/** Contour fermé d'une boucle du ruban entre s0 et s1. */
export function ribbonPath(s0: number, s1: number, steps = 140): string {
  const left: Pt[] = [];
  const right: Pt[] = [];
  const eps = 0.001;
  for (let i = 0; i <= steps; i++) {
    const s = s0 + ((s1 - s0) * i) / steps;
    const p = lemniscate(s);
    const a = lemniscate(s - eps);
    const b = lemniscate(s + eps);
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const w = ribbonWidth(s);
    left.push({ x: p.x + nx * w, y: p.y + ny * w });
    right.push({ x: p.x - nx * w, y: p.y - ny * w });
  }
  const pts = [...left, ...right.reverse()];
  return (
    pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ") +
    " Z"
  );
}

/** Ligne médiane d'une portion de lemniscate. */
export function spinePath(s0: number, s1: number, steps = 160): string {
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const p = lemniscate(s0 + ((s1 - s0) * i) / steps);
    d += `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)} `;
  }
  return d.trim();
}

const SAMPLES = Array.from({ length: 401 }, (_, i) => {
  const t = i / 400;
  return { t, x: orbPoint(t).x };
});

/**
 * Zone visée par une abscisse SVG : le ruban (x 70 → 730) est découpé en trois tiers égaux,
 * gauche = Chaud, milieu = Hybride, droite = Froid.
 */
export function zoneFromX(x: number): "chaud" | "hybride" | "froid" {
  const third = (2 * A) / 3;
  if (x < CX - A + third) return "chaud";
  if (x > CX + A - third) return "froid";
  return "hybride";
}

/** Inverse : abscisse SVG → position t sur le trajet de l'orbe. */
export function tFromX(x: number): number {
  let best = SAMPLES[0]!;
  for (const s of SAMPLES) if (Math.abs(s.x - x) < Math.abs(best.x - x)) best = s;
  return best.t;
}
