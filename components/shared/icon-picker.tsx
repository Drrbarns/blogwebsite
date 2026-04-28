import {
  BarChart3,
  BookOpen,
  Bot,
  FileText,
  Gauge,
  Globe,
  LayoutGrid,
  LineChart,
  Mail,
  MessageSquare,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  BarChart3,
  BookOpen,
  Bot,
  FileText,
  Gauge,
  Globe,
  LayoutGrid,
  LineChart,
  Mail,
  MessageSquare,
  Rocket,
  Search,
  Shield,
  Sparkles,
  Workflow,
};

/**
 * Look up a Lucide icon by string name with a sensible fallback.  Used for
 * CMS-driven content where editors pick icons from a select field.
 */
export function pickIcon(name?: string | null): LucideIcon {
  if (!name) return Sparkles;
  return ICONS[name] ?? Sparkles;
}

export type { LucideIcon };
