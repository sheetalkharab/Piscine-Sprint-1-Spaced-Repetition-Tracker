// script.test.js
import { describe, test, expect } from "@jest/globals";

import { getUserIds } from "./common.mjs";
import { addMonths, getRevisionDates, formatDate } from "./script.mjs";

describe("common.getUserIds", () => {
  test('returns exactly 5 user IDs as strings "1" through "5"', () => {
    const ids = getUserIds();
    expect(Array.isArray(ids)).toBe(true);
    expect(ids).toHaveLength(5);
    expect(ids).toEqual(["1", "2", "3", "4", "5"]);
  });
});

describe("script.formatDate", () => {
  test("formats a Date as YYYY-MM-DD", () => {
    const d = new Date("2025-07-19T15:30:00Z");
    expect(formatDate(d)).toBe("2025-07-19");
  });
});

describe("script.addMonths", () => {
  test("adds months without rollover", () => {
    const d = new Date("2025-01-15");
    const d2 = addMonths(d, 2);
    expect(formatDate(d2)).toBe("2025-03-15");
  });

  test("handles end-of-month rollover correctly", () => {
    const d = new Date("2025-01-31");
    const feb = addMonths(d, 1);
    expect(formatDate(feb)).toBe("2025-02-28");
  });
});

describe("script.getRevisionDates", () => {
  test("computes exactly 5 revision dates for a given start date", () => {
    const start = "2025-07-19";
    const revs = getRevisionDates(start).map(formatDate);
    expect(revs).toEqual([
      "2025-07-26", // +1 week
      "2025-08-19", // +1 month
      "2025-10-19", // +3 months
      "2026-01-19", // +6 months
      "2026-07-19", // +12 months
    ]);
  });
});
