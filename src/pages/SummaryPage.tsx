import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChartDonut,
  Drop,
  Info,
  Leaf,
  MapPin,
  MapTrifold,
  Ruler,
  Sparkle,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";
import {
  ContourBackground,
  Eyebrow,
  PageShell,
  Reveal,
} from "@/components/common/PagePrimitives";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/providers/DataProvider";
import { useAppStore } from "@/stores/useAppStore";
import { PRIORITY_ORDER } from "@/lib/constants";
import {
  formatArea,
  formatNumber,
  formatPercent,
} from "@/lib/format";
import { cn } from "@/lib/format";
import type { KecamatanSummary, SummaryClass } from "@/types";

function SectionHeading({
  index,
  eyebrow,
  title,
  description,
}: {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-[620px]">
        <p className="flex items-center gap-2 font-mono text-[9px] font-medium uppercase tracking-[0.18em] text-ink-faint">
          <span className="text-blue-600">{index}</span>
          <span className="h-px w-5 bg-mist-300" />
          {eyebrow}
        </p>
        <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink text-balance">
          {title}
        </h2>
      </div>
      {description && (
        <p className="max-w-[350px] text-[11px] leading-relaxed text-ink-soft">
          {description}
        </p>
      )}
    </div>
  );
}

function HeroDonut() {
  const { summary } = useData();
  let cursor = 0;
  const stops = summary.priority.classes
    .map((item) => {
      const start = cursor;
      cursor += item.pct;
      return `${item.color} ${start}% ${cursor}%`;
    })
    .join(", ");

  return (
    <div className="relative flex items-center gap-5 rounded-[22px] border border-white/10 bg-white/[0.045] p-4">
      <div
        className="relative h-[128px] w-[128px] shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      >
        <div className="absolute inset-[11px] flex flex-col items-center justify-center rounded-full border border-white/10 bg-ocean-950">
          <span className="text-[24px] font-bold leading-none tracking-[-0.05em] text-white">
            {formatNumber(summary.priority.highPriorityPct, 1)}
            <span className="text-[11px] text-white/40">%</span>
          </span>
          <span className="mt-1 font-mono text-[7px] uppercase tracking-[0.12em] text-white/35">
            prioritas tinggi
          </span>
        </div>
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-mono text-[8px] uppercase tracking-[0.15em] text-white/35">
          Komposisi area
        </p>
        <div className="mt-2 space-y-1.5">
          {summary.priority.classes.map((item) => (
            <div key={item.label} className="flex items-center gap-2">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="min-w-0 flex-1 truncate text-[9px] text-white/55">
                {item.label}
              </span>
              <span className="font-mono text-[8.5px] text-white/40">
                {formatPercent(item.pct, 1)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const { summary } = useData();
  return (
    <section className="relative overflow-hidden border-b border-mist-200/60 bg-gradient-to-b from-white via-white to-mist-50">
      <ContourBackground className="-right-20 -top-32 h-[620px] w-[820px] text-blue-600/15" />
      <PageShell className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Ringkasan analisis · 2026</Eyebrow>
            <h1 className="mt-5 max-w-[720px] text-[clamp(2.6rem,5.6vw,5.2rem)] font-extrabold leading-[0.95] tracking-[-0.065em] text-ink text-balance">
              Prioritas{" "}
              <span className="bg-gradient-to-r from-blue-700 via-blue-500 to-aqua-500 bg-clip-text text-transparent">
                Blue-Green
              </span>{" "}
              dibaca dari ruang kota.
            </h1>
            <p className="mt-5 max-w-[500px] text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
              {formatNumber(summary.analyzed.totalAreaHa, 1)} hektare wilayah
              Kota Cirebon dibaca melalui empat parameter spasial untuk
              menemukan ruang yang paling relevan bagi pengembangan
              infrastruktur biru-hijau.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-2.5">
              <Button asChild size="lg">
                <Link to="/">
                  <MapTrifold size={17} weight="fill" />
                  Buka peta prioritas
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/metodologi">
                  Baca metodologi
                  <ArrowUpRight size={15} weight="bold" />
                </Link>
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[9px] text-ink-faint">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" />
                {summary.priority.kecamatan.length} kecamatan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                4 parameter
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {summary.landcover.duplicateGroups} catatan data
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:justify-self-end">
            <div className="relative w-full max-w-[480px] overflow-hidden rounded-[32px] border border-white/10 bg-ocean-950 p-5 text-white shadow-[0_32px_90px_-30px_rgba(4,30,51,.6)] sm:p-6">
              <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full border border-white/8" />
              <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full border border-white/8" />
              <div className="pointer-events-none absolute -bottom-24 -left-16 h-48 w-48 rounded-full bg-aqua-300/10 blur-3xl" />
              <div className="relative flex items-center justify-between">
                <div>
                  <p className="font-mono text-[8.5px] uppercase tracking-[0.17em] text-white/35">
                    Potret kota
                  </p>
                  <p className="mt-1 text-[15px] font-bold tracking-[-0.03em] text-white">
                    Skor prioritas BGI
                  </p>
                </div>
                <Badge tone="glass">Weighted overlay</Badge>
              </div>
              <div className="relative mt-5">
                <HeroDonut />
              </div>
              <div className="relative mt-4 grid grid-cols-2 gap-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-white/35">
                    Tinggi + sangat tinggi
                  </p>
                  <p className="mt-1.5 text-[18px] font-bold tracking-[-0.04em] text-aqua-300">
                    {formatNumber(summary.priority.highPriorityAreaHa, 0)}
                    <span className="ml-0.5 text-[9px] font-medium text-white/40">ha</span>
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.045] p-3">
                  <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-white/35">
                    Area rendah
                  </p>
                  <p className="mt-1.5 text-[18px] font-bold tracking-[-0.04em] text-white">
                    {formatNumber(
                      summary.priority.classes.find((item) => item.label === "Rendah")
                        ?.pct ?? 0,
                      1
                    )}
                    <span className="ml-0.5 text-[9px] font-medium text-white/40">%</span>
                  </p>
                </div>
              </div>
              <div className="relative mt-4 flex items-center gap-2 border-t border-white/10 pt-3 text-[8.5px] text-white/35">
                <Sparkle size={11} weight="fill" className="text-aqua-300" />
                Data divisualisasikan pada peta interaktif
                <Link
                  to="/"
                  className="ml-auto flex items-center gap-1 font-semibold text-aqua-300"
                >
                  Jelajahi
                  <ArrowUpRight size={10} weight="bold" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </PageShell>
    </section>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  note,
  icon,
}: {
  label: string;
  value: string;
  suffix?: string;
  note: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-[22px] border border-mist-200/70 bg-white p-4 shadow-[0_12px_30px_-26px_rgba(4,30,51,.4)]">
      <div className="flex items-center justify-between">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-mist-50 text-blue-700">
          {icon}
        </span>
        <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-faint">
          {note}
        </span>
      </div>
      <p className="mt-4 text-[24px] font-bold leading-none tracking-[-0.05em] text-ink">
        {value}
        {suffix && (
          <span className="ml-1 text-[11px] font-medium tracking-normal text-ink-faint">
            {suffix}
          </span>
        )}
      </p>
      <p className="mt-1.5 text-[9.5px] font-medium text-ink-soft">{label}</p>
    </div>
  );
}

function ClassRow({ item }: { item: SummaryClass }) {
  return (
    <div className="flex items-center gap-3 border-b border-mist-100 py-2.5 last:border-0">
      <span
        className="h-3 w-3 shrink-0 rounded-[4px] ring-1 ring-inset ring-black/10"
        style={{ backgroundColor: item.color }}
      />
      <span className="w-[86px] shrink-0 text-[10.5px] font-semibold text-ink">
        {item.label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-mist-100">
        <div
          className="h-full rounded-full"
          style={{ width: `${item.pct}%`, backgroundColor: item.color }}
        />
      </div>
      <span className="w-[58px] shrink-0 text-right font-mono text-[9px] text-ink-faint">
        {formatPercent(item.pct, 1)}
      </span>
      <span className="hidden w-[72px] shrink-0 text-right font-mono text-[9px] text-ink-soft sm:block">
        {formatArea(item.areaHa)}
      </span>
    </div>
  );
}

function PriorityComposition() {
  const { summary } = useData();
  return (
    <div className="rounded-[26px] border border-mist-200/70 bg-white p-5 shadow-[0_14px_40px_-30px_rgba(4,30,51,.4)] lg:col-span-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
            <ChartDonut size={12} weight="fill" className="text-blue-600" />
            Komposisi kelas
          </p>
          <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
            Mayoritas area berada di kelas tinggi.
          </h3>
        </div>
        <Badge tone="blue">{summary.priority.classes.length} kelas</Badge>
      </div>
      <div className="mt-4">
        {summary.priority.classes.map((item) => (
          <ClassRow key={item.label} item={item} />
        ))}
      </div>
      <div className="mt-4 flex items-center gap-2 rounded-xl bg-mist-50 px-3 py-2.5 text-[9px] leading-relaxed text-ink-soft">
        <Info size={12} className="shrink-0 text-blue-600" />
        Kelas prioritas adalah hasil klasifikasi weighted overlay, bukan
        rekomendasi jenis intervensi.
      </div>
    </div>
  );
}

function InsightCard() {
  const { summary } = useData();
  const top = summary.priority.kecamatan[0];
  return (
    <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-ocean-950 via-[#062f4c] to-blue-700 p-5 text-white shadow-[0_20px_60px_-28px_rgba(4,30,51,.7)] lg:col-span-5">
      <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-aqua-300/10 blur-3xl" />
      <Eyebrow tone="light">Temuan kunci</Eyebrow>
      <p className="mt-4 text-[clamp(2.4rem,5vw,4rem)] font-extrabold leading-none tracking-[-0.06em] text-aqua-300">
        {formatPercent(summary.priority.highPriorityPct, 1)}
      </p>
      <p className="mt-2 text-[14px] font-bold leading-snug tracking-[-0.025em]">
        dari area yang dianalisis masuk kelas tinggi dan sangat tinggi.
      </p>
      <p className="mt-3 text-[10px] leading-relaxed text-white/50">
        {top?.name} memegang porsi terluas ({formatArea(top?.totalAreaHa ?? 0)}),
        diikuti {summary.priority.kecamatan[1]?.name}. Pola ini memberi petunjuk
        awal tentang konsentrasi ruang intervensi.
      </p>
      <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-3">
        <div>
          <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-white/35">
            Area tinggi
          </p>
          <p className="mt-1 text-[14px] font-bold text-white">
            {formatArea(
              summary.priority.classes.find((item) => item.label === "Tinggi")
                ?.areaHa ?? 0
            )}
          </p>
        </div>
        <div>
          <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-white/35">
            Sangat tinggi
          </p>
          <p className="mt-1 text-[14px] font-bold text-white">
            {formatArea(
              summary.priority.classes.find((item) => item.label === "Sangat Tinggi")
                ?.areaHa ?? 0
            )}
          </p>
        </div>
      </div>
      <Link
        to="/"
        className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-2 text-[9.5px] font-semibold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15"
      >
        Lihat sebaran di peta
        <ArrowUpRight size={12} weight="bold" />
      </Link>
    </div>
  );
}

function KecamatanTable() {
  const { summary } = useData();
  const navigate = useNavigate();
  const setKecamatanFilter = useAppStore((state) => state.setKecamatanFilter);
  const openMap = (kecamatan: KecamatanSummary) => {
    setKecamatanFilter([kecamatan.name]);
    navigate("/");
  };

  return (
    <div className="rounded-[26px] border border-mist-200/70 bg-white p-5 shadow-[0_14px_40px_-30px_rgba(4,30,51,.4)] lg:col-span-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
            <MapPin size={12} weight="fill" className="text-blue-600" />
            Sebaran wilayah
          </p>
          <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
            Luas prioritas menurut kecamatan
          </h3>
        </div>
        <p className="text-[9.5px] text-ink-faint">
          Total {formatArea(summary.priority.totalAreaHa)}
        </p>
      </div>
      <div className="mt-4 divide-y divide-mist-100">
        {summary.priority.kecamatan.map((kecamatan) => {
          const high =
            (kecamatan.classes["tinggi"] ?? 0) +
            (kecamatan.classes["sangat-tinggi"] ?? 0);
          const highPct = kecamatan.totalAreaHa
            ? (high / kecamatan.totalAreaHa) * 100
            : 0;
          return (
            <button
              key={kecamatan.name}
              type="button"
              onClick={() => openMap(kecamatan)}
              className="group grid w-full grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2 py-4 text-left transition-colors hover:bg-mist-50/60 sm:grid-cols-[190px_1fr_110px_24px] sm:px-2"
            >
              <div>
                <p className="text-[11.5px] font-bold text-ink">{kecamatan.name}</p>
                <p className="mt-0.5 font-mono text-[8.5px] text-ink-faint">
                  {formatArea(kecamatan.totalAreaHa)} ·{" "}
                  {formatPercent(kecamatan.pctOfAnalyzed, 1)} kota
                </p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <div className="flex h-2 gap-px overflow-hidden rounded-full bg-mist-100">
                  {PRIORITY_ORDER.map((label) => {
                    const key = label.toLowerCase().replace(" ", "-");
                    const value = kecamatan.classes[key] ?? 0;
                    const meta = summary.priority.classes.find(
                      (item) => item.label === label
                    );
                    if (!value) return null;
                    return (
                      <span
                        key={label}
                        className="h-full first:rounded-l-full last:rounded-r-full"
                        style={{
                          width: `${(value / kecamatan.totalAreaHa) * 100}%`,
                          backgroundColor: meta?.color,
                        }}
                        title={`${label}: ${formatArea(value)}`}
                      />
                    );
                  })}
                </div>
                <div className="mt-1.5 hidden gap-3 sm:flex">
                  {PRIORITY_ORDER.map((label) => (
                    <span
                      key={label}
                      className="flex items-center gap-1 text-[7.5px] text-ink-faint"
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: summary.priority.classes.find(
                            (item) => item.label === label
                          )?.color,
                        }}
                      />
                      {label}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-[13px] font-bold tracking-[-0.03em] text-ink">
                  {formatPercent(highPct, 1)}
                </p>
                <p className="font-mono text-[7.5px] uppercase tracking-[0.08em] text-ink-faint">
                  prioritas tinggi
                </p>
              </div>
              <span className="hidden h-7 w-7 items-center justify-center rounded-full border border-mist-200 text-ink-faint transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white sm:flex">
                <ArrowRight size={13} weight="bold" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function DataQualityCard() {
  const { summary, metadata } = useData();
  return (
    <div className="rounded-[26px] border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-white p-5 lg:col-span-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-[#99610c]">
            <Warning size={12} weight="fill" />
            Catatan kualitas data
          </p>
          <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
            Baca angka dengan konteks.
          </h3>
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/15 text-[#99610c]">
          <Info size={17} weight="fill" />
        </span>
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <div className="rounded-xl bg-white/70 p-2.5">
          <p className="text-[18px] font-bold tracking-[-0.04em] text-ink">
            {summary.landcover.duplicateGroups}
          </p>
          <p className="mt-0.5 text-[8px] leading-snug text-ink-faint">
            pasang geometri tutupan lahan duplikat
          </p>
        </div>
        <div className="rounded-xl bg-white/70 p-2.5">
          <p className="text-[18px] font-bold tracking-[-0.04em] text-ink">
            {formatNumber(summary.analyzed.gapAreaHa, 1)}
          </p>
          <p className="mt-0.5 text-[8px] leading-snug text-ink-faint">
            ha selisih area administrasi
          </p>
        </div>
        <div className="rounded-xl bg-white/70 p-2.5">
          <p className="text-[18px] font-bold tracking-[-0.04em] text-ink">
            {metadata.dataQuality.landcoverUniqueFeatures}
          </p>
          <p className="mt-0.5 text-[8px] leading-snug text-ink-faint">
            geometri tutupan lahan unik
          </p>
        </div>
      </div>
      <p className="mt-3 text-[9.5px] leading-relaxed text-ink-soft">
        Ekspor asli memuat geometri yang sama dengan dua kelas tutupan lahan.
        Atlas menampilkan kelas dari fitur teratas agar konsisten dengan visual
        qgis2web; validasi lapangan tetap diperlukan sebelum pengambilan
        keputusan.
      </p>
      <Link
        to="/metodologi"
        className="mt-3 inline-flex items-center gap-1 text-[9.5px] font-bold text-[#8b5b0f] underline decoration-[#8b5b0f]/20 underline-offset-2"
      >
        Baca catatan metodologis
        <ArrowUpRight size={11} weight="bold" />
      </Link>
    </div>
  );
}

function FactorWeights() {
  const { metadata } = useData();
  return (
    <div className="rounded-[26px] border border-mist-200/70 bg-white p-5 lg:col-span-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
            <Sparkle size={12} weight="fill" className="text-blue-600" />
            Model prioritas
          </p>
          <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
            Empat parameter, satu skor.
          </h3>
        </div>
        <Badge tone="blue">Weighted overlay</Badge>
      </div>
      <div className="mt-4 space-y-3">
        {metadata.weights.map((weight) => (
          <div key={weight.key}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-ink">{weight.label}</span>
              <span className="font-mono text-[9px] text-ink-faint">
                {weight.weight}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-mist-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-aqua-400"
                style={{ width: `${weight.weight}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-xl bg-mist-50 px-3 py-2.5 text-[9px] leading-relaxed text-ink-soft">
        Bobot mengikuti analisis asli. Kelas prioritas dihitung dari overlay
        keempat parameter, lalu dikelompokkan menjadi empat kelas.
      </p>
    </div>
  );
}

function CTA() {
  return (
    <Reveal className="mt-14">
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-blue-700 via-blue-600 to-aqua-500 p-6 text-white shadow-[0_30px_80px_-32px_rgba(11,99,184,.7)] sm:p-9">
        <ContourBackground className="-right-24 -top-24 h-[440px] w-[600px] text-white/12" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[560px]">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/50">
              Lanjutkan eksplorasi
            </p>
            <h2 className="mt-2 text-[clamp(1.8rem,4vw,3.1rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">
              Lihat prioritas ini di ruang nyata.
            </h2>
            <p className="mt-2 max-w-[450px] text-[11.5px] leading-relaxed text-white/60">
              Buka peta, pilih kecamatan, dan klik poligon untuk membaca detail
              luas serta konteks wilayah.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="w-fit bg-white text-blue-700 shadow-lg hover:bg-mist-50"
          >
            <Link to="/">
              <MapTrifold size={17} weight="fill" />
              Buka peta interaktif
              <ArrowUpRight size={15} weight="bold" />
            </Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}

export function SummaryPage() {
  const { summary } = useData();
  return (
    <div>
      <Hero />
      <PageShell className="relative pb-10 pt-10 sm:pt-12">
        <Reveal>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              label="Area dianalisis"
              value={formatNumber(summary.analyzed.totalAreaHa, 1)}
              suffix="ha"
              note="wilayah"
              icon={<Ruler size={16} weight="bold" />}
            />
            <MetricCard
              label="Prioritas tinggi + sangat tinggi"
              value={formatNumber(summary.priority.highPriorityPct, 1)}
              suffix="%"
              note="2 kelas"
              icon={<TrendUp size={16} weight="bold" />}
            />
            <MetricCard
              label="Kecamatan tercakup"
              value={String(summary.priority.kecamatan.length)}
              suffix="wilayah"
              note="administrasi"
              icon={<MapPin size={16} weight="bold" />}
            />
            <MetricCard
              label="Kelas prioritas"
              value={String(summary.priority.classes.length)}
              suffix="kelas"
              note="klasifikasi"
              icon={<ChartDonut size={16} weight="bold" />}
            />
          </div>
        </Reveal>

        <section className="mt-14">
          <SectionHeading
            index="01"
            eyebrow="Potret prioritas"
            title="Tujuh dari sepuluh hektare berada di kelas tinggi."
            description="Komposisi ini menunjukkan konsentrasi area yang perlu dibaca lebih dekat, bukan otomatis berarti seluruh area harus diintervensi."
          />
          <div className="grid gap-3 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <PriorityComposition />
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-5">
              <InsightCard />
            </Reveal>
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading
            index="02"
            eyebrow="Sebaran spasial"
            title="Prioritas tidak tersebar merata."
            description="Klik salah satu kecamatan untuk membuka peta dengan filter wilayah tersebut."
          />
          <div className="grid gap-3 lg:grid-cols-12">
            <Reveal className="lg:col-span-12">
              <KecamatanTable />
            </Reveal>
          </div>
        </section>

        <section className="mt-14">
          <SectionHeading
            index="03"
            eyebrow="Cara membaca"
            title="Data yang baik selalu punya catatan."
            description="Dua hal perlu diingat: duplikasi tutupan lahan pada data sumber dan perbedaan luas administrasi."
          />
          <div className="grid gap-3 lg:grid-cols-12">
            <Reveal className="lg:col-span-6">
              <DataQualityCard />
            </Reveal>
            <Reveal delay={0.08} className="lg:col-span-6">
              <FactorWeights />
            </Reveal>
          </div>
        </section>

        <CTA />
      </PageShell>
    </div>
  );
}
