import type { BasemapId } from "@/types";

export interface BasemapConfig {
  id: BasemapId;
  label: string;
  description: string;
  tiles: string[];
  attribution: string;
  maxzoom: number;
  tileSize: number;
  labels?: {
    tiles: string[];
    maxzoom: number;
    tileSize: number;
  };
}

const ESRI_ATTRIBUTION =
  'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a> — Esri, HERE, Garmin, &copy; OpenStreetMap contributors';

export const BASEMAPS: Record<BasemapId, BasemapConfig> = {
  light: {
    id: "light",
    label: "Terang",
    description: "Peta abu terang dengan label jalan, paling jelas untuk data tematik.",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    ],
    labels: {
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      ],
      maxzoom: 16,
      tileSize: 256,
    },
    attribution: ESRI_ATTRIBUTION,
    maxzoom: 16,
    tileSize: 256,
  },
  satellite: {
    id: "satellite",
    label: "Satelit",
    description: "Citra satelit untuk membaca konteks fisik wilayah.",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    attribution:
      'Tiles &copy; <a href="https://www.esri.com/" target="_blank" rel="noreferrer">Esri</a>, Maxar, Earthstar Geographics',
    maxzoom: 19,
    tileSize: 256,
  },
  dark: {
    id: "dark",
    label: "Gelap",
    description: "Latar gelap dengan label halus untuk kontras data yang lebih dramatis.",
    tiles: [
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
    ],
    labels: {
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
      ],
      maxzoom: 16,
      tileSize: 256,
    },
    attribution: ESRI_ATTRIBUTION,
    maxzoom: 16,
    tileSize: 256,
  },
};

export const BASEMAP_ORDER: BasemapId[] = ["light", "satellite", "dark"];
