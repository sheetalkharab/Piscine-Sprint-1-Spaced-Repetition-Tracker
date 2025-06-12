import { getRevisionDates } from "./script.mjs";
import { getUserIDs } from "./common.mjs";
import assert from "node:assert";
import test from "node:test";


test("User count is correct", () => {
  assert.equal(getUserIds().length, 5);
});


// test revision date generation 
test("getRevisionDates returns 5 correct future dates", () => {
  const baseDate = "2025-01-01";
  const expected = [
    "2025-01-08", // 1 week
    "2025-02-01", // 1 month
    "2025-04-01", // 3 months
    "2025-07-01", // 6 months
    "2026-01-01", // 12 months
  ];
  assert.deepEqual(getRevisionDates(baseDate), expected);
});
