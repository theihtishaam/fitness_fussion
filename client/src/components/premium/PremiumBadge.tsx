import { Badge } from "@/components/ui/badge";
import { Crown } from "lucide-react";

export function PremiumBadge() {
  return (
    <Badge variant="secondary" className="gap-1">
      <Crown className="h-3 w-3" />
      <span>Premium</span>
    </Badge>
  );
}
