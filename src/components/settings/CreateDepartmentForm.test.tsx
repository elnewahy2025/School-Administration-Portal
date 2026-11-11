import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CreateDepartmentForm } from "./CreateDepartmentForm";

let mockLocale = "ar";

vi.mock("next-intl", () => ({
  useLocale: () => mockLocale,
  useTranslations: () => (key: string) => key,
}));

vi.mock("@/i18n", () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

vi.mock("@/actions/settings/createDepartmentAction", () => ({
  createDepartmentAction: vi.fn().mockResolvedValue({ success: true }),
}));

describe("CreateDepartmentForm", () => {
  afterEach(() => {
    cleanup();
  });

  it("hides English name input in Arabic locale", () => {
    mockLocale = "ar";
    render(<CreateDepartmentForm />);

    expect(screen.getByLabelText("deptNameAr")).toBeInTheDocument();
    expect(screen.queryByLabelText("deptNameEn")).toBeNull();
  });

  it("shows English name input in English locale", () => {
    mockLocale = "en";
    render(<CreateDepartmentForm />);

    expect(screen.getByLabelText("deptNameAr")).toBeInTheDocument();
    expect(screen.getByLabelText("deptNameEn")).toBeInTheDocument();
  });
});

