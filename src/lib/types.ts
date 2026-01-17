import type { LucideIcon } from "lucide-react";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

// Tipo para ícones Lucide (usado em layouts, admin, navegação)
export type { LucideIcon };

// Tipo para ícones Phosphor (usado em features, games, páginas)
export type PhosphorIconType = PhosphorIcon;

// Interface genérica para itens de navegação
export interface NavItemConfig {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
}

// Interface genérica para cards de estatísticas
export interface StatCardConfig {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

// Interface para itens de feature com Phosphor icons
export interface FeatureItemConfig {
  title: string;
  description: string;
  icon: PhosphorIcon;
}
