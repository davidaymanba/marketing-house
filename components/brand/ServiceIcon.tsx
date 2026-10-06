import { Camera, CodeXml, Megaphone, Palette, PenTool, Search, Share2, TrendingUp, type LucideProps } from "lucide-react";
import type { ServiceIcon as ServiceIconName } from "@/lib/content/types";

const icons = {
  palette: Palette,
  share: Share2,
  pen: PenTool,
  camera: Camera,
  megaphone: Megaphone,
  trending: TrendingUp,
  code: CodeXml,
  search: Search,
} satisfies Record<ServiceIconName, unknown>;

export const serviceIconNames = Object.keys(icons) as ServiceIconName[];

export function ServiceIcon({ name, ...props }: LucideProps & { name: ServiceIconName }) {
  const Icon = icons[name] ?? Palette;
  return <Icon aria-hidden strokeWidth={1.5} {...props} />;
}
