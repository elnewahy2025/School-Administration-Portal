import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AppSidebar } from "./AppSidebar";
import type { SchoolRow } from "@/lib/school/getCurrentSchool";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const map: Record<string, string> = {
      portal: "School Portal",
      dashboard: "Dashboard",
      circulars: "Circulars",
      maintenance: "Maintenance",
      calendar: "Calendar",
      achievements: "Achievements",
      reports: "Reports",
      settings: "Settings",
    };
    return map[key] || key;
  },
  useLocale: () => "ar",
}));

vi.mock("@/i18n", () => ({
  usePathname: () => "/dashboard",
  Link: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("AppSidebar", () => {
  afterEach(() => {
    cleanup();
  });

  const mockSchool: SchoolRow = {
    id: "s1",
    name_ar: "دولة الكويت\nوزارة التربية\nمنطقة العاصمة التعليمية\nمدرسة الأمل الثانوية-بنات",
    name_en: "Al-Amal High School",
    slug: "amal",
    timezone: "Asia/Kuwait",
    logo_path: null,
    academic_year: "2026/2027",
    is_active: true,
  };

  it("extracts and displays only the school name (the last line)", () => {
    render(
      <AppSidebar
        school={mockSchool}
        isOwner={true}
        canManageSettings={true}
        canViewReports={true}
      />,
    );

    expect(screen.getByText("مدرسة الأمل الثانوية-بنات")).toBeDefined();
    expect(screen.queryByText(/دولة الكويت/)).toBeNull();
    expect(screen.queryByText(/وزارة التربية/)).toBeNull();
  });
});
