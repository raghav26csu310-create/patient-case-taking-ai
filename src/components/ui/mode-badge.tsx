import React from "react";
import { APP_CONFIG } from "@/lib/config/app-config";
import { Badge } from "./badge";
import { AlertCircle } from "lucide-react";

export function ModeBadge() {
  if (APP_CONFIG.isProduction) {
    return (
      <Badge variant="success" size="sm">
        PRODUCTION ACTIVE
      </Badge>
    );
  }

  return (
    <Badge variant="warning" size="sm" className="gap-1 font-mono uppercase tracking-wider">
      <AlertCircle className="w-3 h-3" />
      DEMO / SYNTHETIC CASE MODE
    </Badge>
  );
}
