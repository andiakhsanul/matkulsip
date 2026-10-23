import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const idNumber = new Intl.NumberFormat("id-ID", {
  maximumFractionDigits: 1,
});

const idNumberCompact = new Intl.NumberFormat("id-ID", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatNumber(value: number, digits = 1) {
  return new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits,
  }).format(value);
}

export function formatArea(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${idNumber.format(value)} ha`;
}

export function formatCompact(value: number) {
  if (!Number.isFinite(value)) return "—";
  return idNumberCompact.format(value);
}

export function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatPercent(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "—";
  return `${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: digits,
  }).format(value)}%`;
}

export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
