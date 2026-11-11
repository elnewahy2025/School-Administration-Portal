import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SchoolContactFields } from "./SchoolContactFields";
import type { SchoolFullDetails } from "@/lib/school/getSchoolFullDetails";

let mockLocale = "ar";

vi.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => key,
}));

describe("SchoolContactFields", () => {
  afterEach(() => {
    cleanup();
  });

  const mockSchool = {
    id: "s1",
    phone: "123456",
    email: "test@school.edu",
    address_ar: "شارع الأمل",
    address_en: "Hope Street",
  } as unknown as SchoolFullDetails;

  it("renders English address as hidden input in Arabic locale", () => {
    mockLocale = "ar";
    const { container } = render(<SchoolContactFields school={mockSchool} canManage={true} />);

    expect(screen.queryByLabelText("addressEn")).toBeNull();
    const hidden = container.querySelector('input[type="hidden"][name="address_en"]');
    expect(hidden).toBeInTheDocument();
    expect(hidden).toHaveValue("Hope Street");
  });

  it("renders English address visibly in English locale", () => {
    mockLocale = "en";
    render(<SchoolContactFields school={mockSchool} canManage={true} />);

    const input = screen.getByLabelText("addressEn");
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue("Hope Street");
  });
});

