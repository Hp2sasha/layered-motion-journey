export type Mode = "day" | "night";

export const MODE_TRANSITION_MS = 10000;
export const celestialBodyForMode = (mode: Mode) => mode === "day" ? "moon" : "sun";