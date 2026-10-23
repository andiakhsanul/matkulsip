import type { Icon, IconProps } from "@phosphor-icons/react";
import {
  MapPin,
  Mountains,
  Path,
  Plant,
  Ruler,
  Stack,
  Waves,
} from "@phosphor-icons/react";
import type { LayerId } from "@/types";

const ICONS: Record<LayerId, Icon> = {
  priority: Stack,
  flood: Waves,
  landcover: Plant,
  slope: Mountains,
  elevation: Ruler,
  river: Path,
  admin: MapPin,
};

export function LayerIcon({
  id,
  size = 16,
  weight = "fill",
  ...props
}: { id: LayerId } & IconProps) {
  const IconComponent = ICONS[id];
  return <IconComponent size={size} weight={weight} {...props} />;
}
