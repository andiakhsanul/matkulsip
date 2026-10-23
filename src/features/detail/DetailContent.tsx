import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  Check,
  Copy,
  Crosshair,
  Info,
  MapPin,
  MapPinLine,
  ShareNetwork,
  Sparkle,
  Warning,
  X,
} from "@phosphor-icons/react";
import { toast } from "sonner";
import { Badge, PriorityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/providers/DataProvider";
import { useAppStore } from "@/stores/useAppStore";
import { LAYER_META, PRIORITY_ORDER } from "@/lib/constants";
import { getLayerScore, getLayerValue, legendColor } from "@/lib/layers";
import {
  cn,
  formatArea,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { LayerIcon } from "@/features/panel/layerIcons";
import type { SelectedFeature } from "@/types";

const priorityDescriptions: Record<string, string> = {
  Rendah:
    "Area ini berada pada kelas prioritas rendah dalam klasifikasi asli. Kombinasi parameter weighted overlay memberikan skor yang relatif lebih kecil dibanding wilayah lain.",
  Sedang:
    "Area ini berada pada kelas prioritas sedang. Terdapat peluang intervensi BGI, tetapi tidak sekuat wilayah dengan kelas prioritas tinggi.",
  Tinggi:
    "Area ini berada pada kelompok prioritas tinggi. Kombinasi tutupan lahan, lereng, elevasi, dan jarak sungai mendorong skor prioritas yang kuat.",
  "Sangat Tinggi":
    "Area ini berada pada kelompok prioritas sangat tinggi. Dalam klasifikasi asli, kombinasi empat parameter menempatkannya pada kelompok paling diprioritaskan.",
};

function DetailEmpty() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 text-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/10 blur-xl" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white bg-white text-blue-600 shadow-[0_16px_40px_-16px_rgba(4,30,51,.4)]">
          <MapPinLine size={26} weight="duotone" />
        </span>
      </div>
      <p className="mt-4 text-[14px] font-bold tracking-[-0.02em] text-ink">
        Pilih wilayah di peta
      </p>
      <p className="mt-1.5 max-w-[220px] text-[10.5px] leading-relaxed text-ink-soft">
        Klik poligon untuk membaca kelas prioritas, luas, dan konteks
        kecamatannya.
      </p>
      <div className="mt-4 flex items-center gap-1.5 rounded-full bg-mist-50 px-2.5 py-1.5 text-[9px] text-ink-faint">
        <Crosshair size={11} />
        Klik · zoom · salin detail
      </div>
    </div>
  );
}

function PriorityDetail({
  selected,
}: {
  selected: Extract<SelectedFeature, { layer: "priority" }>;
}) {
  const { summary } = useData();
  const selectFeature = useAppStore((state) => state.selectFeature);
  const [copied, setCopied] = React.useState(false);
  const props = selected.properties;
  const areaPct = summary.priority.totalAreaHa
    ? (props.areaHa / summary.priority.totalAreaHa) * 100
    : 0;
  const kecamatan = summary.priority.kecamatan.find(
    (item) => item.name === props.kecamatan
  );
  const rank = summary.priority.kecamatan.findIndex(
    (item) => item.name === props.kecamatan
  );
  const classShare = kecamatan?.totalAreaHa
    ? (props.areaHa / kecamatan.totalAreaHa) * 100
    : 0;

  const copy = async () => {
    const text = `${props.kecamatan} · Prioritas ${props.priority} · ${formatArea(props.areaHa)} — Atlas BGI Cirebon`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Detail wilayah disalin");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Detail tidak dapat disalin");
    }
  };

  const zoom = () => {
    if (!selected.center) return;
    window.dispatchEvent(
      new CustomEvent("bgi:focus-feature", {
        detail: { center: selected.center, zoom: 14.6 },
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-mist-200/70 bg-white p-3.5 shadow-[0_10px_28px_-24px_rgba(4,30,51,.5)]">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
              Kecamatan
            </p>
            <p className="mt-1 text-[18px] font-bold leading-none tracking-[-0.04em] text-ink">
              {props.kecamatan}
            </p>
          </div>
          <PriorityBadge label={props.priority} />
        </div>
        <div className="mt-4 flex items-end justify-between gap-2">
          <div>
            <p className="text-[26px] font-bold leading-none tracking-[-0.05em] text-ink">
              {formatNumber(props.areaHa, 1)}
              <span className="ml-1 text-[11px] font-medium tracking-normal text-ink-faint">
                ha
              </span>
            </p>
            <p className="mt-1 text-[9px] text-ink-faint">
              {formatPercent(areaPct, 1)} dari area dianalisis
            </p>
          </div>
          <div className="rounded-xl bg-mist-50 px-2.5 py-2 text-right">
            <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink-faint">
              Peringkat
            </p>
            <p className="mt-0.5 text-[14px] font-bold text-ink">
              {rank >= 0 ? `#${rank + 1}` : "—"}
              <span className="ml-0.5 text-[8px] font-medium text-ink-faint">
                /{summary.priority.kecamatan.length}
              </span>
            </p>
          </div>
        </div>
        <div className="mt-3 flex h-1.5 overflow-hidden rounded-full bg-mist-100">
          {summary.priority.classes.map((item) => (
            <span
              key={item.label}
              className="h-full"
              style={{
                width: `${item.pct}%`,
                backgroundColor: item.color,
                opacity: item.label === props.priority ? 1 : 0.35,
              }}
            />
          ))}
        </div>
        <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
          {priorityDescriptions[props.priority]}
        </p>
      </div>

      {kecamatan && (
        <div className="rounded-[20px] border border-mist-200/70 bg-white p-3.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
              <MapPin size={11} className="text-blue-600" />
              Konteks kecamatan
            </span>
            <span className="font-mono text-[8.5px] text-ink-faint">
              {formatArea(kecamatan.totalAreaHa)}
            </span>
          </div>
          <div className="mt-3 flex h-2 gap-px overflow-hidden rounded-full">
            {PRIORITY_ORDER.map((label) => {
              const key = label.toLowerCase().replace(" ", "-");
              const value = kecamatan.classes[key] ?? 0;
              const classData = summary.priority.classes.find(
                (item) => item.label === label
              );
              if (!value) return null;
              return (
                <span
                  key={label}
                  className="h-full first:rounded-l-full last:rounded-r-full"
                  style={{
                    width: `${(value / kecamatan.totalAreaHa) * 100}%`,
                    backgroundColor: classData?.color,
                  }}
                  title={`${label}: ${formatArea(value)}`}
                />
              );
            })}
          </div>
          <div className="mt-2.5 flex items-center justify-between text-[9px] text-ink-soft">
            <span>
              Kelas ini mencakup{" "}
              <strong className="font-semibold text-ink">{formatPercent(classShare, 1)}</strong>{" "}
              dari kecamatan.
            </span>
            <Link
              to="/ringkasan"
              className="flex items-center gap-1 font-semibold text-blue-700"
            >
              Ringkasan
              <ArrowUpRight size={10} weight="bold" />
            </Link>
          </div>
        </div>
      )}

      <div className="rounded-[20px] bg-gradient-to-br from-ocean-950 to-[#073b5f] p-3.5 text-white">
        <div className="flex items-center gap-1.5">
          <Info size={11} weight="fill" className="text-aqua-300" />
          <span className="font-mono text-[8px] uppercase tracking-[0.13em] text-white/45">
            Model prioritas
          </span>
        </div>
        <p className="mt-1.5 text-[10px] leading-relaxed text-white/65">
          Skor parameter 1–5 tersedia pada layer empat parameter. Shapefile
          prioritas tidak memuat field skor akhir, sehingga kelas prioritas
          ditampilkan tanpa nilai numerik. Bobot mengikuti analisis asli; kelas
          bukan rekomendasi intervensi final.
        </p>
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {[
            ["Tutupan lahan", "40%"],
            ["Kemiringan", "25%"],
            ["Elevasi", "25%"],
            ["Jarak sungai", "10%"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-lg bg-white/[0.06] px-2 py-1.5"
            >
              <span className="text-[8.5px] text-white/55">{label}</span>
              <span className="font-mono text-[8.5px] font-semibold text-aqua-300">
                {value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Button onClick={zoom} size="sm" className="col-span-2">
          <Crosshair size={14} weight="bold" />
          Zoom ke wilayah
        </Button>
        <Button variant="outline" size="sm" onClick={copy}>
          {copied ? <Check size={13} weight="bold" /> : <Copy size={13} weight="bold" />}
          {copied ? "Tersalin" : "Salin detail"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => selectFeature(null)}
        >
          <X size={13} weight="bold" />
          Tutup detail
        </Button>
      </div>
    </div>
  );
}

function GenericDetail({ selected }: { selected: SelectedFeature }) {
  const { summary } = useData();
  const selectFeature = useAppStore((state) => state.selectFeature);
  const meta = LAYER_META[selected.layer];
  const properties = selected.properties as unknown as Record<string, unknown>;
  const value = getLayerValue(selected.layer, properties);
  const score = getLayerScore(selected.layer, properties);
  const scoreLabel = selected.layer === "flood" ? "Skor bahaya" : "Skor parameter";
  const area = Number(properties.areaHa);
  const duplicate =
    selected.layer === "landcover" && Boolean(properties.duplicate);
  const classes = Array.isArray(properties.classes)
    ? (properties.classes as string[])
    : [];
  const classScores =
    properties.classScores && typeof properties.classScores === "object"
      ? (properties.classScores as Record<string, number>)
      : null;
  const classSummary = classes
    .map((label) => {
      const classScore = classScores?.[label];
      return typeof classScore === "number" ? `${label} (skor ${classScore})` : label;
    })
    .join(" / ");

  const zoom = () => {
    if (!selected.center) return;
    window.dispatchEvent(
      new CustomEvent("bgi:focus-feature", {
        detail: { center: selected.center, zoom: 14.6 },
      })
    );
  };

  return (
    <div className="space-y-4">
      <div className="rounded-[20px] border border-mist-200/70 bg-white p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
              {String(properties.kecamatan ?? "Kota Cirebon")}
            </p>
            <p className="mt-1 text-[18px] font-bold leading-none tracking-[-0.04em] text-ink">
              {value}
            </p>
            <p className="mt-1 text-[9px] text-ink-faint">{meta.label}</p>
          </div>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{
              backgroundColor: `${meta.color}16`,
              color: meta.color,
            }}
          >
            <LayerIcon id={selected.layer} size={17} />
          </span>
        </div>
        {Number.isFinite(area) && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-mist-50 px-3 py-2">
            <span className="text-[9px] text-ink-faint">Luas tercatat</span>
            <span className="text-[13px] font-bold text-ink">{formatArea(area)}</span>
          </div>
        )}
        {score !== null && (
          <div className="mt-1.5 flex items-center justify-between rounded-xl border border-blue-500/15 bg-blue-500/[0.055] px-3 py-2">
            <span className="flex items-center gap-1.5 text-[9px] font-semibold text-blue-800">
              <Sparkle size={11} weight="fill" className="text-blue-600" />
              {scoreLabel}
            </span>
            <span className="font-mono text-[13px] font-bold text-blue-800">
              {score}
              <span className="ml-0.5 text-[8px] font-medium text-blue-700/60">/5</span>
            </span>
          </div>
        )}
        <p className="mt-2.5 text-[10px] leading-relaxed text-ink-soft">
          {meta.description}
        </p>
      </div>

      {duplicate && (
        <div className="rounded-[18px] border border-amber-500/20 bg-amber-500/[0.06] p-3">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-[#99610c]">
              <Warning size={13} weight="fill" />
            </span>
            <div>
              <p className="text-[10px] font-bold text-[#8b5b0f]">
                Geometri duplikat
              </p>
              <p className="mt-1 text-[9px] leading-relaxed text-[#99610c]/85">
                Geometri ini muncul dengan dua kelas di data sumber:{" "}
                <strong className="font-semibold">{classSummary}</strong>.
                Kelas yang ditampilkan mengikuti fitur teratas pada ekspor asli.
              </p>
              <Link
                to="/metodologi"
                className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-[#8b5b0f] underline decoration-[#8b5b0f]/20 underline-offset-2"
              >
                Catatan data
                <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-[18px] border border-mist-200/70 bg-white p-3">
        <p className="text-[9px] font-bold uppercase tracking-[0.12em] text-ink-faint">
          Catatan
        </p>
        <p className="mt-1.5 text-[9.5px] leading-relaxed text-ink-soft">
          Layer ini adalah bagian dari atlas analisis BGI Kota Cirebon. Nilai dan
          kelas mengikuti data sumber; gunakan panel{" "}
          <Link
            to="/metodologi"
            className="font-semibold text-blue-700 underline decoration-blue-700/20 underline-offset-2"
          >
            Metodologi
          </Link>{" "}
          untuk memahami batasannya.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <Button onClick={zoom} size="sm" className="col-span-2">
          <Crosshair size={14} weight="bold" />
          Zoom ke wilayah
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const scoreText = score !== null ? ` · skor ${score}/5` : "";
            void navigator.clipboard
              .writeText(`${meta.label} · ${value}${scoreText} · ${formatArea(area)}`)
              .then(() => toast.success("Detail layer disalin"));
          }}
        >
          <Copy size={13} weight="bold" />
          Salin
        </Button>
        <Button variant="outline" size="sm" onClick={() => selectFeature(null)}>
          <X size={13} weight="bold" />
          Tutup
        </Button>
      </div>
    </div>
  );
}

export function DetailContent({
  selected,
  onClose,
  compact = false,
}: {
  selected: SelectedFeature | null;
  onClose?: () => void;
  compact?: boolean;
}) {
  const { summary, metadata } = useData();
  const navigate = useNavigate();

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center justify-between gap-2 px-1 pb-3">
        <div>
          <p className="text-[9.5px] font-bold uppercase tracking-[0.16em] text-ink-faint">
            Detail wilayah
          </p>
          <p className="mt-0.5 text-[11px] text-ink-soft">
            {selected ? "Informasi fitur terpilih" : "Belum ada fitur terpilih"}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              void navigator.clipboard.writeText(window.location.href).then(() => {
                toast.success("Tautan atlas disalin");
              });
            }}
            aria-label="Bagikan detail"
            className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-mist-100 hover:text-ink"
          >
            <ShareNetwork size={14} weight="bold" />
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup detail"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition-colors hover:bg-mist-100 hover:text-ink"
            >
              <X size={15} weight="bold" />
            </button>
          )}
        </div>
      </div>
      <div className={cn("min-h-0 flex-1", compact ? "overflow-visible" : "overflow-y-auto pr-0.5 thin-scrollbar")}>
        {selected ? (
          selected.layer === "priority" ? (
            <PriorityDetail selected={selected} />
          ) : (
            <GenericDetail selected={selected} />
          )
        ) : (
          <DetailEmpty />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-mist-100 px-1 pt-2.5">
        <span className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink-faint">
          Data analisis BGI · v{metadata.version}
        </span>
        <button
          type="button"
          onClick={() => navigate("/ringkasan")}
          className="flex items-center gap-1 text-[9px] font-semibold text-blue-700"
        >
          Ringkasan
          <ArrowUpRight size={10} weight="bold" />
        </button>
      </div>
    </div>
  );
}
