import { describe, it, expect } from "vitest";
import { parseFormCheckbox } from "./parseFormCheckbox";

describe("parseFormCheckbox", () => {
  it("returns true when value is 'true' or 'on'", () => {
    const fdTrue = new FormData();
    fdTrue.append("test_key", "true");
    expect(parseFormCheckbox(fdTrue, "test_key")).toBe(true);

    const fdOn = new FormData();
    fdOn.append("test_key", "on");
    expect(parseFormCheckbox(fdOn, "test_key")).toBe(true);
  });

  it("returns false when value is missing, empty, or other string", () => {
    const fdEmpty = new FormData();
    expect(parseFormCheckbox(fdEmpty, "test_key")).toBe(false);

    const fdFalse = new FormData();
    fdFalse.append("test_key", "false");
    expect(parseFormCheckbox(fdFalse, "test_key")).toBe(false);
  });
});
