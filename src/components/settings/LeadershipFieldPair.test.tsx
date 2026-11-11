import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LeadershipFieldPair } from "./LeadershipFieldPair";

let mockLocale = "ar";

vi.mock("next-intl", () => ({
  useLocale: () => mockLocale,
}));

describe("LeadershipFieldPair", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders English field as hidden input in Arabic locale", () => {
    mockLocale = "ar";
    const { container } = render(
      <LeadershipFieldPair
        idAr="manager_name_ar"
        idEn="manager_name_en"
        labelAr="المدير"
        labelEn="Principal"
        defaultValueAr="أحمد"
        defaultValueEn="Ahmed"
        disabled={false}
      />,
    );

    expect(screen.queryByLabelText("Principal")).toBeNull();
    const hidden = container.querySelector('input[type="hidden"][name="manager_name_en"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveValue("Ahmed");
  });

  it("renders English field visibly in English locale", () => {
    mockLocale = "en";
    render(
      <LeadershipFieldPair
        idAr="manager_name_ar"
        idEn="manager_name_en"
        labelAr="المدير"
        labelEn="Principal"
        defaultValueAr="أحمد"
        defaultValueEn="Ahmed"
        disabled={false}
      />,
    );

    const input = screen.getByLabelText("Principal");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Ahmed");
  });
});

