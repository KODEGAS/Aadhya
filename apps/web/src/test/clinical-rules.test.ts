import { describe, expect, it } from "vitest";
import { parseISO, format } from "date-fns";
import { eddFromLmp, gestationalAge, trimester, vaccinationStatus } from "@/lib/demo/fixtures";

describe("pregnancy calculations", () => {
  it("EDD is LMP + 280 days (Naegele)", () => {
    expect(format(eddFromLmp("2026-03-01"), "yyyy-MM-dd")).toBe("2026-12-06");
  });
  it("gestational age for LMP 2026-03-01 on 2026-11-04 is 35w 3d", () => {
    const ga = gestationalAge("2026-03-01", parseISO("2026-11-04"));
    expect([ga.weeks, ga.days]).toEqual([35, 3]);
  });
  it("trimester boundaries at 14 and 28 weeks", () => {
    expect([trimester(13), trimester(14), trimester(27), trimester(28)]).toEqual([1, 2, 2, 3]);
  });
});

describe("vaccination status", () => {
  const today = parseISO("2026-11-04");
  it("ungiven past-due dose is overdue", () => {
    expect(
      vaccinationStatus(
        { id: "x", childId: "c", vaccine: "MMR", dose: "2", dueDate: "2026-10-01" },
        today,
      ),
    ).toBe("OVERDUE");
  });
  it("given dose is given", () => {
    expect(
      vaccinationStatus(
        {
          id: "x",
          childId: "c",
          vaccine: "MMR",
          dose: "2",
          dueDate: "2026-10-01",
          givenDate: "2026-10-02",
        },
        today,
      ),
    ).toBe("GIVEN");
  });
});

import { epdsLevel, isPostpartumHaemorrhage } from "@/lib/demo/fixtures";
describe("postpartum rules", () => {
  it("EPDS 13+ is high, 10–12 moderate, below 10 low", () => {
    expect([epdsLevel(9), epdsLevel(10), epdsLevel(12), epdsLevel(13)]).toEqual([
      "LOW",
      "MODERATE",
      "MODERATE",
      "HIGH",
    ]);
  });
  it("PPH threshold is 500 mL vaginal, 1000 mL caesarean", () => {
    expect(isPostpartumHaemorrhage(500, "Spontaneous vaginal")).toBe(true);
    expect(isPostpartumHaemorrhage(499, "Spontaneous vaginal")).toBe(false);
    expect(isPostpartumHaemorrhage(900, "Emergency C-section")).toBe(false);
    expect(isPostpartumHaemorrhage(1000, "Elective C-section")).toBe(true);
  });
});
