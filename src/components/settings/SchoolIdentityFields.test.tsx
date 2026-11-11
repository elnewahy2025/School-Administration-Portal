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

  it("hides English name and slug input in Arabic locale and provides hidden inputs", () => {
    mockLocale = "ar";
    const { container } = render(<SchoolIdentityFields school={mockSchool} canManage={true} />);

    expect(screen.queryByLabelText("nameEn")).toBeNull();
    const hiddenNameEn = container.querySelector('input[type="hidden"][name="name_en"]');
    expect(hiddenNameEn).toBeInTheDocument();
    expect(hiddenNameEn).toHaveValue("Al-Amal School");

    expect(screen.queryByLabelText("slug")).toBeNull();
    const hiddenSlug = container.querySelector('input[type="hidden"][name="slug"]');
    expect(hiddenSlug).toBeInTheDocument();
    expect(hiddenSlug).toHaveValue("al-amal");
  });

  it("shows visible English name and slug in English locale", () => {
    mockLocale = "en";
    render(<SchoolIdentityFields school={mockSchool} canManage={true} />);

    const textarea = screen.getByLabelText("nameEn");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue("Al-Amal School");

    const slugInput = screen.getByLabelText("slug");
    expect(slugInput).toBeInTheDocument();
    expect(slugInput).toHaveValue("al-amal");
  });
});
