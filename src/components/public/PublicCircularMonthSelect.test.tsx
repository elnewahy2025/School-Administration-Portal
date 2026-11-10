import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { PublicCircularMonthSelect } from "./PublicCircularMonthSelect";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("PublicCircularMonthSelect", () => {
  afterEach(() => {
    cleanup();
  });
  const months = [
    { key: "2026-11", label: "November 2026", count: 2 },
    { key: "2026-10", label: "October 2026", count: 0 },
  ];

  it("renders select with all months and options", () => {
    const onSelectMonth = vi.fn();
    render(
      <PublicCircularMonthSelect
        months={months}
        selectedMonth="all"
        totalCount={2}
        onSelectMonth={onSelectMonth}
      />,
    );

    const select = screen.getByRole("combobox", { name: "selectMonth" });
    expect(select).toBeInTheDocument();
    expect(screen.getByText(/allMonths \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/November 2026 \(2\)/)).toBeInTheDocument();
    expect(screen.getByText(/October 2026 \(0\)/)).toBeInTheDocument();
  });

  it("calls onSelectMonth when selection changes", () => {
    const onSelectMonth = vi.fn();
    render(
      <PublicCircularMonthSelect
        months={months}
        selectedMonth="all"
        totalCount={2}
        onSelectMonth={onSelectMonth}
      />,
    );

    const select = screen.getByRole("combobox", { name: "selectMonth" });
    fireEvent.change(select, { target: { value: "2026-11" } });

    expect(onSelectMonth).toHaveBeenCalledWith("2026-11");
  });
});
