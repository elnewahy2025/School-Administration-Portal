import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicCircularsSection } from "./PublicCircularsSection";
import type { CircularRow } from "@/lib/circulars/types";

vi.mock("next-intl", () => ({
  useLocale: () => "ar",
  useTranslations: (namespace?: string) => (key: string) => {
    const messages: Record<string, string> = {
      circularsEyebrow: "إعلانات وقرارات رسمية",
      circularsTitle: "التعاميم المدرسية",
      circularsSubtitle: "أحدث التعاميم والقرارات المعتمدة الصادرة عن إدارة المدرسة",
      viewCircularAction: "عرض التعميم",
      noPublicCirculars: "لا توجد تعاميم عامة منشورة حالياً.",
      hasAttachments: "مرفق مستند",
      priorityNormal: "عادي",
      priorityUrgent: "عاجل",
      priorityHigh: "هام",
      priorityLow: "منخفض",
    };
    return messages[key] || `${namespace}.${key}`;
  },
}));

vi.mock("@/i18n", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

const mockCircular: CircularRow = {
  id: "circ-1",
  school_id: "school-1",
  ref_number: "CIR-2026-0001",
  title: "الخطة الدراسية الجديدة",
  body: "نص التعميم بخصوص الخطة الدراسية الجديدة للعام الحالي.",
  category: "admin",
  priority: "normal",
  status: "published",
  visibility: "public",
  response_type: "acknowledgement",
  response_instructions: null,
  allow_response_revision: false,
  publish_at: "2026-11-10T10:00:00Z",
  due_at: null,
  created_by: "u-1",
  closed_at: null,
  created_at: "2026-11-10T09:00:00Z",
  attachments: [
    {
      id: "att-1",
      circular_id: "circ-1",
      school_id: "school-1",
      path: "school-1/circ-1/plan.pdf",
      mime: "application/pdf",
      size_bytes: 1024,
      uploaded_by: "u-1",
      created_at: "2026-11-10T09:00:00Z",
    },
  ],
};

describe("PublicCircularsSection", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the empty state when no circulars are provided", () => {
    render(<PublicCircularsSection circulars={[]} />);
    expect(screen.getByText("لا توجد تعاميم عامة منشورة حالياً.")).toBeDefined();
    expect(screen.getByText("التعاميم المدرسية")).toBeDefined();
  });

  it("renders circular cards with ref number, title, and action link", () => {
    render(<PublicCircularsSection circulars={[mockCircular]} />);
    expect(screen.getByText("CIR-2026-0001")).toBeDefined();
    expect(screen.getByText("الخطة الدراسية الجديدة")).toBeDefined();
    expect(screen.getByText("عرض التعميم")).toBeDefined();
    expect(screen.getByText("مرفق مستند")).toBeDefined();

    const link = screen.getByRole("link", { name: /عرض التعميم/ });
    expect(link.getAttribute("href")).toBe("/public/circulars/circ-1");
  });
});
