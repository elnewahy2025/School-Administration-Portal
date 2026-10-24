import { Badge } from "@/components/ui/badge";

export function RoleBadge({ isSystem }: { isSystem: boolean }) {
  if (isSystem) {
    return (
      <Badge variant="secondary" className="text-xs">
        System
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="border-primary/50 text-xs text-primary">
      Custom
    </Badge>
  );
}
