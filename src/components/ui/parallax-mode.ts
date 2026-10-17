export type Mode = "day" | "night";

export const MODE_TRANSITION_MS = 1500;
export const celestialBodyForMode = (mode: Mode) => mode === "day" ? "moon" : "sun";