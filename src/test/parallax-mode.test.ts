import { describe, expect, it } from "vitest";
import { celestialBodyForMode, MODE_TRANSITION_MS } from "@/components/ui/parallax-mode";

describe("Torino sky modes", () => {
  it("replaces the sun with a moon when day is selected", () => {
    expect(celestialBodyForMode("night")).toBe("sun");
    expect(celestialBodyForMode("day")).toBe("moon");
  });
  it("completes the mode change in 10 seconds", () => {
    expect(MODE_TRANSITION_MS).toBe(10000);
  });
});