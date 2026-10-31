import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PublicDocumentsSection } from "./PublicDocumentsSection";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      documentsEyebrow: "مرفقات رسمية",
      documentsTitle: "أدلة ووثائق المدرسة",
      documentsSubtitle:
        "اضغط على أي دليل لعرضه — أو استخدم قائمة «أدلة وثائق المدرسة» في الأعلى من أي صفحة.",
      documentViewAction: "عرض الوثيقة",
      docOperationalPlanTitle: "الخطة التشغيلية",
      docOperationalPlanDesc: "أهداف الخطة السنوية ومؤشرات الأداء والتنفيذ.",
      docCommitteesGuideTitle: "دليل إجراءات اللجان",
      docCommitteesGuideDesc: "تشكيل اللجان المدرسية ومهامها وآلية عملها.",
      docCounselingGuideTitle: "دليل الإرشاد المدرسي",
      docCounselingGuideDesc: "برامج الإرشاد الطلابي والخدمات النفسية والتربوية.",
    };
    return messages[key] || key;
  },
}));

describe("PublicDocumentsSection", () => {
  afterEach(() => {
    cleanup();
  });

  it("renders the eyebrow, title, and subtitle", () => {
    render(<PublicDocumentsSection />);

    expect(screen.getByText("مرفقات رسمية")).toBeDefined();
    expect(screen.getByText("أدلة ووثائق المدرسة")).toBeDefined();
    expect(
      screen.getByText(
        "اضغط على أي دليل لعرضه — أو استخدم قائمة «أدلة وثائق المدرسة» في الأعلى من أي صفحة."
      )
    ).toBeDefined();
  });

  it("renders all three document cards with PDF badges and view action buttons", () => {
    render(<PublicDocumentsSection />);

    expect(screen.getByText("الخطة التشغيلية")).toBeDefined();
    expect(screen.getByText("دليل إجراءات اللجان")).toBeDefined();
    expect(screen.getByText("دليل الإرشاد المدرسي")).toBeDefined();

    const pdfBadges = screen.getAllByText("PDF");
    expect(pdfBadges).toHaveLength(3);

    const actionButtons = screen.getAllByText("عرض الوثيقة");
    expect(actionButtons).toHaveLength(3);
  });
});

