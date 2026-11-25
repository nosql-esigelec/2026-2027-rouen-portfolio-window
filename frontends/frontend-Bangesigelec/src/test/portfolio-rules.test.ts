import { afterEach, describe, expect, it, vi } from "vitest";

import { DEMO_EXPERIENCES, DEMO_PROFIL, DEMO_PROJETS, experiencesForMode } from "@/data/demo";
import { modeFromT, snapT } from "@/lib/mode";
import { zoneFromX } from "@/lib/mobius";
import { similarProjects } from "@/lib/similarity";
import { api } from "@/services/api";

describe("Ruban de Möbius", () => {
  it("associe les extrémités et le centre aux trois modes", () => {
    expect(modeFromT(0)).toBe("chaud");
    expect(modeFromT(0.5)).toBe("hybride");
    expect(modeFromT(1)).toBe("froid");
  });

  it("aimante l'orbe vers la zone la plus proche", () => {
    expect(snapT(0.2)).toBe(0);
    expect(snapT(0.3)).toBe(0.5);
    expect(snapT(0.8)).toBe(1);
  });
});

describe("Clic sur le ruban", () => {
  it("envoie l'orbe à gauche, au milieu ou à droite selon l'endroit cliqué", () => {
    expect(zoneFromX(120)).toBe("chaud"); // boucle gauche
    expect(zoneFromX(250)).toBe("chaud");
    expect(zoneFromX(400)).toBe("hybride"); // croisement
    expect(zoneFromX(560)).toBe("froid");
    expect(zoneFromX(700)).toBe("froid"); // boucle droite
  });
});

describe("Parcours filtré par mode", () => {
  it("montre seulement le parcours de basketteur en mode Chaud", () => {
    const ids = experiencesForMode(DEMO_EXPERIENCES, "chaud").map((e) => e.id);
    expect(ids).toEqual(["basket-haut-niveau"]);
  });

  it("montre ESIGELEC et le stage Omen Performance en mode Froid", () => {
    const orgs = experiencesForMode(DEMO_EXPERIENCES, "froid").map((e) => e.organisation);
    expect(orgs).toEqual(["ESIGELEC", "Omen Performance"]);
  });

  it("montre tout le parcours en mode Hybride", () => {
    expect(experiencesForMode(DEMO_EXPERIENCES, "hybride")).toHaveLength(DEMO_EXPERIENCES.length);
  });
});

describe("Projets similaires", () => {
  it("n'inclut jamais le projet lui-même et trie par score décroissant", () => {
    const sims = similarProjects(DEMO_PROJETS, "detection-rfid-random-forest");
    expect(sims.map((s) => s.slug)).not.toContain("detection-rfid-random-forest");
    const scores = sims.map((s) => s.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
  });
});

describe("Disponibilité et contact", () => {
  it("annonce un stage en mars 2027 et un poste en avril 2027", () => {
    expect(DEMO_PROFIL.disponibilite).toEqual({ stage: "mars 2027", poste: "avril 2027" });
  });

  it("utilise l'adresse e-mail ESIGELEC", () => {
    expect(DEMO_PROFIL.email).toBe("bangaly.fofana@groupe-esigelec.org");
  });
});

describe("Repli automatique sur la démo", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("renvoie les données de démo quand l'API ne répond pas", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    const res = await api.getProjets();
    expect(res.source).toBe("demo");
    expect(res.data).toHaveLength(4);
  });

  it("utilise les données de l'API quand elle répond", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response(JSON.stringify([DEMO_PROJETS[0]]), { status: 200 })),
    );
    const res = await api.getProjets();
    expect(res.source).toBe("api");
    expect(res.data).toHaveLength(1);
  });
});
