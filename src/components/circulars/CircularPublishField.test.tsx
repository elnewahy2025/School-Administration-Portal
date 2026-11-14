import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { CircularPublishField } from "./CircularPublishField";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      publishImmediately: "نشر التعميم فوراً",
      publishImmediatelyHelp: "تفعيل التعميم ونشره فوراً وإرسال الإشعارات إلى المستهدفين.",
    };
    return messages[key] ?? key;
  },
}));

describe("CircularPublishField", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders checkbox checked by default", () => {
    render(<CircularPublishField />);

    const checkbox = screen.getByRole("checkbox", { name: /نشر التعميم فوراً/i });
    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toBeChecked();
  });

  it("renders checkbox unchecked when defaultChecked is false", () => {
    render(<CircularPublishField defaultChecked={false} />);

    const checkbox = screen.getByRole("checkbox", { name: /نشر التعميم فوراً/i });
    expect(checkbox).not.toBeChecked();
  });
});
