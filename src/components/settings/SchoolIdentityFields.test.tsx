import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SchoolIdentityFields } from "./SchoolIdentityFields";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";

let mockLocale = "ar";

vi.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => key,
}));

describe("SchoolIdentityFields", () => {
  afterEach(() => {
    cleanup();
  });

  const mockSchool = {
    id: "s1",
    name_ar: "مدرسة الأمل",
    name_en: "Al-Amal School",
    slug: "al-amal",
    academic_year: "2026/2027",
  } as unknown as SchoolFullDetails;

  it("hides English name input in Arabic locale and provides a hidden input", () => {
    mockLocale = "ar";
    const { container } = render(<SchoolIdentityFields school={mockSchool} canManage={true} />);

    expect(screen.queryByLabelText("nameEn")).toBeNull();
    const hiddenInput = container.querySelector('input[type="hidden"][name="name_en"]');
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput).toHaveValue("Al-Amal School");
  });

  it("shows visible English name textarea in English locale", () => {
    mockLocale = "en";
    render(<SchoolIdentityFields school={mockSchool} canManage={true} />);

    const textarea = screen.getByLabelText("nameEn");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Al-Amal School");
  });
});
