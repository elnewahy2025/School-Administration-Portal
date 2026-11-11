import React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  getClientEnv: vi.fn(() => ({
    NEXT_PUBLIC_SUPABASE_URL: "https://school.supabase.co",
    NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-key",
  })),
}));

import { CalendarEventImageBanner } from "./CalendarEventImageBanner";

describe("CalendarEventImageBanner", () => {
  afterEach(() => {
    cleanup();
  });

  it("returns null when imagePath is null or empty", () => {
    const { container } = render(<CalendarEventImageBanner imagePath={null} altText="Event" />);
    expect(container.firstChild).toBeNull();
  });

  it("renders image with resolved public storage URL and becomes visible on load", () => {
    render(
      <CalendarEventImageBanner imagePath="school-1/calendar/pic.jpg" altText="Event title" />,
    );
    const img = screen.getByRole("img", { name: "Event title" });
    expect(img).toBeInTheDocument();
    expect(img.getAttribute("src")).toBe(
      "https://school.supabase.co/storage/v1/object/public/public-assets/school-1/calendar/pic.jpg",
    );
    fireEvent.load(img);
    expect(img.closest("div")).toHaveClass("opacity-100");
  });

  it("gracefully hides image if it fails to load and shows fallback placeholder", () => {
    render(<CalendarEventImageBanner imagePath="school-1/calendar/missing.jpg" altText="Event" />);
    const img = screen.getByRole("img", { name: "Event" });
    fireEvent.error(img);
    expect(screen.queryByRole("img", { name: "Event" })).toBeNull();
    expect(screen.getByText("Event")).toBeInTheDocument();
  });

  it("resets error state when imagePath changes to a new image", () => {
    const { rerender } = render(
      <CalendarEventImageBanner imagePath="school-1/calendar/broken.jpg" altText="First" />,
    );
    const brokenImg = screen.getByRole("img", { name: "First" });
    fireEvent.error(brokenImg);
    expect(screen.queryByRole("img", { name: "First" })).toBeNull();

    // Rerender with a new valid image path
    rerender(<CalendarEventImageBanner imagePath="school-1/calendar/valid.jpg" altText="Second" />);
    const newImg = screen.getByRole("img", { name: "Second" });
    expect(newImg).toBeInTheDocument();
    expect(newImg.getAttribute("src")).toBe(
      "https://school.supabase.co/storage/v1/object/public/public-assets/school-1/calendar/valid.jpg",
    );
  });

  it("resets error state when imagePath changes to a new image", () => {
    const { rerender } = render(
      <CalendarEventImageBanner imagePath="school-1/calendar/broken.jpg" altText="First" />,
    );
    const brokenImg = screen.getByRole("img", { name: "First" });
    fireEvent.error(brokenImg);
    expect(screen.queryByRole("img", { name: "First" })).toBeNull();

    // Rerender with a new valid image path
    rerender(<CalendarEventImageBanner imagePath="school-1/calendar/valid.jpg" altText="Second" />);
    const newImg = screen.getByRole("img", { name: "Second" });
    expect(newImg).toBeInTheDocument();
    expect(newImg.getAttribute("src")).toBe(
      "https://school.supabase.co/storage/v1/object/public/public-assets/school-1/calendar/valid.jpg",
    );
  });
});
