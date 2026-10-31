import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { KuwaitMoeLink } from "./KuwaitMoeLink";

describe("KuwaitMoeLink", () => {
  afterEach(() => {
    cleanup();
  });
  it("renders with correct MOE url and security attributes", () => {
    render(<KuwaitMoeLink />);
    const link = screen.getByRole("link", {
      name: "وزارة التربية - دولة الكويت | Ministry of Education",
    });
    expect(link).toHaveAttribute("href", "https://www.moe.edu.kw/");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders Kuwait emblem image", () => {
    render(<KuwaitMoeLink />);
    const img = screen.getByAltText("شعار دولة الكويت - وزارة التربية");
    expect(img).toHaveAttribute("src", "/images/kuwait-emblem.svg");
  });
});
