import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SchoolNarrativeFields } from "./SchoolNarrativeFields";

let mockLocale = "ar";

vi.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => key,
}));

describe("SchoolNarrativeFields", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders English vision and mission as hidden inputs in Arabic locale", () => {
    mockLocale = "ar";
    const { container } = render(
      <SchoolNarrativeFields
        visionAr="رؤيتنا"
        visionEn="Our Vision"
        missionAr="رسالتنا"
        missionEn="Our Mission"
        disabled={false}
      />,
    );

    expect(screen.queryByLabelText("visionEn")).toBeNull();
    expect(screen.queryByLabelText("missionEn")).toBeNull();

    const hiddenVision = container.querySelector('input[type="hidden"][name="vision_en"]');
    expect(hiddenVision).toBeInTheDocument();
    expect(hiddenVision).toHaveValue("Our Vision");

    const hiddenMission = container.querySelector('input[type="hidden"][name="mission_en"]');
    expect(hiddenMission).toBeInTheDocument();
    expect(hiddenMission).toHaveValue("Our Mission");
  });

  it("renders English vision and mission visibly in English locale", () => {
    mockLocale = "en";
    render(
      <SchoolNarrativeFields
        visionAr="رؤيتنا"
        visionEn="Our Vision"
        missionAr="رسالتنا"
        missionEn="Our Mission"
        disabled={false}
      />,
    );

    expect(screen.getByLabelText("visionEn")).toBeInTheDocument();
    expect(screen.getByLabelText("missionEn")).toBeInTheDocument();
  });
});

