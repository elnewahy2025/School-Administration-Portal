"use client";

import Link from "next/link";
import { ArrowUpRightIcon, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface DashboardStatItem {
  title: string;
  count: number;
  desc: string;
  href: string;
  icon: LucideIcon;
  accent: string;
}

export function DashboardStatCard({ item }: { item: DashboardStatItem }) {
  const Icon = item.icon;
  return (
    <Link href={item.href} className="group">
      <Card className="h-full border-border bg-card transition-all hover:border-primary/50 hover:shadow-md">
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between">
            <div className={`flex size-10 items-center justify-center rounded-lg ${item.accent}`}>
              <Icon className="size-5" />
            </div>
            <ArrowUpRightIcon className="size-4 text-muted-foreground opacity-0 transition-all group-hover:text-primary group-hover:opacity-100 rtl:-rotate-90" />
          </div>
          <div>
            <div className="text-2xl font-bold tracking-tight text-foreground">{item.count}</div>
            <div className="mt-0.5 text-sm font-semibold text-foreground">{item.title}</div>
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">{item.desc}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
