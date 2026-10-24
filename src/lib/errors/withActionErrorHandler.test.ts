import { describe, it, expect } from "vitest";
import { withActionErrorHandler } from "./withActionErrorHandler";
import { ValidationError } from "./ValidationError";
import { ERROR_CODES } from "./errorCodes";

describe("withActionErrorHandler", () => {
  it("returns normal result on success", async () => {
    const action = withActionErrorHandler("testAction", async (val: string) => {
      return { success: true, value: val };
    });

    const res = await action("test-data");
    expect(res).toEqual({ success: true, value: "test-data" });
  });

  it("catches ValidationError and returns structured field errors", async () => {
    const action = withActionErrorHandler("testAction", async () => {
      throw new ValidationError("Invalid payload", { title: ["Title is required"] });
    });

    const res = await action();
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.code).toBe(ERROR_CODES.VALIDATION_FAILED);
      expect(res.fieldErrors?.title).toEqual(["Title is required"]);
      expect(res.correlationId).toBeDefined();
    }
  });

  it("catches unexpected exceptions and returns safe error result", async () => {
    const action = withActionErrorHandler("testAction", async () => {
      throw new Error("Unhandled network failure");
    });

    const res = await action();
    expect(res.success).toBe(false);
    if (!res.success) {
      expect(res.code).toBe(ERROR_CODES.INTERNAL_ERROR);
      expect(res.correlationId).toBeDefined();
    }
  });
});
