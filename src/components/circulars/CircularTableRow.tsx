import { Link } from "@/i18n";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";
import { CircularPriorityBadge } from "./CircularPriorityBadge";
import { CircularStatusBadge } from "./CircularStatusBadge";
import type { CircularRow } from "@/lib/circulars/types";

export function CircularTableRow({
  circular,
  viewLabel,
}: {
  circular: CircularRow;
  viewLabel: string;
}) {
  const formattedDueDate = circular.due_at ? new Date(circular.due_at).toLocaleDateString() : "—";

  return (
    <TableRow>
      <TableCell className="font-mono text-xs font-semibold text-foreground">
        {circular.ref_number}
      </TableCell>
      <TableCell className="max-w-xs truncate font-medium text-foreground">
        {circular.title}
      </TableCell>
      <TableCell>
        <CircularPriorityBadge priority={circular.priority} />
      </TableCell>
      <TableCell>
        <CircularStatusBadge status={circular.status} />
      </TableCell>
      <TableCell className="text-xs text-muted-foreground">{circular.response_type}</TableCell>
      <TableCell className="font-mono text-xs text-muted-foreground">{formattedDueDate}</TableCell>
      <TableCell className="text-end">
        <Link href={`/circulars/${circular.id}`}>
          <Button variant="ghost" size="sm" className="gap-1 text-xs">
            <EyeIcon className="size-3.5" />
            <span>{viewLabel}</span>
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
}
