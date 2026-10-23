import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BracketsCurly,
  Database,
  Drop,
  Info,
  Leaf,
  MapTrifold,
  Mountains,
  Path,
  Plant,
  RoadHorizon,
  Ruler,
  Sparkle,
  Stack,
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
import { displayClassLabel } from "@/lib/layers";
import { formatArea, formatNumber, formatPercent } from "@/lib/format";
import type { FactorLayerId, SummaryValue } from "@/types";

const weightIcons: Record<string, React.ReactNode> = {
  landcover: <Plant size={18} weight="fill" />,
  slope: <Mountains size={18} weight="fill" />,
  elevation: <Ruler size={18} weight="fill" />,
  river: <Path size={18} weight="fill" />,
};

const steps = [
  {
    number: "01",
    title: "Menyiapkan parameter",
    text: "Empat layer tematik disiapkan: tutupan lahan, kemiringan lereng, elevasi, dan jarak dari sungai. Seluruh layer dipotong pada batas kecamatan Kota Cirebon.",
  },
  {
    number: "02",
    title: "Reklasifikasi & skoring",
    text: "Setiap parameter diterjemahkan menjadi kelas dengan skor 1–5 dari atribut skor shapefile QGIS. Nilainya tidak diubah pada atlas ini.",
  },
  {
    number: "03",
    title: "Weighted overlay",
    text: "Parameter digabung dengan bobot 40% tutupan lahan, 25% kemiringan, 25% elevasi, dan 10% jarak sungai untuk menghasilkan skor prioritas.",
  },
  {
    number: "04",
    title: "Klasifikasi prioritas",
    text: "Skor dikelompokkan menjadi empat kelas: Rendah, Sedang, Tinggi, dan Sangat Tinggi. Kelas inilah yang ditampilkan pada peta.",
  },
];

function Hero() {
  const { summary } = useData();
  return (
    <section className="relative overflow-hidden border-b border-mist-200/60 bg-gradient-to-b from-white to-mist-50">
      <ContourBackground className="-left-40 -top-48 h-[640px] w-[860px] text-blue-600/12" />
      <PageShell className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>Metodologi · Transparansi analisis</Eyebrow>
            <h1 className="mt-5 max-w-[680px] text-[clamp(2.5rem,5.4vw,4.9rem)] font-extrabold leading-[0.96] tracking-[-0.06em] text-ink text-balance">
              Satu skor, empat{" "}
              <span className="bg-gradient-to-r from-blue-700 to-aqua-500 bg-clip-text text-transparent">
                lapis kota.
              </span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
              Atlas ini membaca prioritas Blue-Green Infrastructure melalui
              weighted overlay. Halaman ini menjelaskan parameter, bobot, alur
              analisis, dan batasan yang perlu diketahui saat membaca peta.
            </p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[9px] text-ink-faint">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                {summary.priority.kecamatan.length} kecamatan
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-aqua-500" />
                4 parameter
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                {summary.landcover.duplicateGroups} catatan duplikasi
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end">
            <div className="relative w-full max-w-[420px] overflow-hidden rounded-[30px] bg-ocean-950 p-5 text-white shadow-[0_30px_80px_-30px_rgba(4,30,51,.6)]">
              <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full border border-white/10" />
              <p className="font-mono text-[8px] uppercase tracking-[0.17em] text-white/35">
                Formula asli
              </p>
              <div className="mt-4 flex items-center gap-2 text-[13px] font-semibold tracking-[-0.02em]">
                <BracketsCurly size={18} className="text-aqua-300" />
                Skor Prioritas BGI
              </div>
              <div className="mt-3 rounded-2xl border border-white/10 bg-black/15 p-3.5 font-mono text-[11px] leading-relaxed text-white/70">
                <span className="text-aqua-300">0,40</span> × L
                <span className="mx-1.5 text-white/25">+</span>
                <span className="text-aqua-300">0,25</span> × S
                <br />
                <span className="mx-1.5 text-white/25">+</span>
                <span className="text-aqua-300">0,25</span> × E
                <span className="mx-1.5 text-white/25">+</span>
                <span className="text-aqua-300">0,10</span> × R
              </div>
              <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-[9px]">
                {[
                  ["L", "Tutupan lahan"],
                  ["S", "Kemiringan"],
                  ["E", "Elevasi"],
                  ["R", "Jarak sungai"],
                ].map(([key, label]) => (
                  <div key={key} className="flex items-center gap-2 text-white/45">
                    <span className="font-mono text-aqua-300">{key}</span>
                    {label}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[8.5px] text-white/35">
                <Info size={11} className="text-aqua-300" />
                Bobot mengikuti analisis asli.
              </div>
            </div>
          </Reveal>
        </div>
      </PageShell>
    </section>
  );
}

function WeightCards() {
  const { metadata } = useData();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metadata.weights.map((weight, index) => (
        <Reveal key={weight.key} delay={index * 0.06}>
          <div className="group h-full rounded-[24px] border border-mist-200/70 bg-white p-4 transition-shadow hover:shadow-[0_18px_50px_-28px_rgba(4,30,51,.4)]">
            <div className="flex items-start justify-between">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-mist-50 text-blue-700">
                {weightIcons[weight.key]}
              </span>
              <span className="font-mono text-[9px] text-ink-faint">
                0{index + 1}
              </span>
            </div>
            <p className="mt-4 text-[32px] font-bold leading-none tracking-[-0.06em] text-ink">
              {weight.weight}
              <span className="ml-0.5 text-[12px] font-medium tracking-normal text-ink-faint">
                %
              </span>
            </p>
            <p className="mt-1 text-[11px] font-bold text-ink">{weight.label}</p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-ink-soft">
              {weight.description}
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mist-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-aqua-400"
                style={{ width: `${weight.weight}%` }}
              />
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function ScoreMatrix() {
  const { metadata, summary } = useData();
  const classesByKey: Record<string, SummaryValue[]> = {
    landcover: summary.landcover.classes,
    slope: summary.factors.slope,
    elevation: summary.factors.elevation,
    river: summary.factors.riverDistance,
  };

  return (
    <Reveal className="mt-3">
      <div className="rounded-[26px] border border-mist-200/70 bg-white p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
              <Stack size={12} weight="fill" className="text-blue-600" />
              Skor parameter
            </p>
            <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
              Nilai kelas dari shapefile QGIS.
            </h3>
          </div>
          <Badge tone="blue">field skor · 1–5</Badge>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {metadata.weights.map((weight) => {
            const items = classesByKey[weight.key] ?? [];
            return (
              <div key={weight.key} className="rounded-2xl bg-mist-50/75 p-3">
                <p className="text-[10px] font-bold text-ink">{weight.label}</p>
                <div className="mt-2 space-y-1.5">
                  {items.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-2"
                    >
                      <span
                        className="min-w-0 truncate text-[9.5px] text-ink-soft"
                        title={item.label}
                      >
                        {displayClassLabel(weight.key as FactorLayerId, item.label)}
                      </span>
                      <span className="shrink-0 rounded-md bg-blue-500/10 px-1.5 py-0.5 font-mono text-[8px] font-semibold text-blue-700">
                        skor {item.score ?? "—"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-mist-50 px-3 py-2.5 text-[9px] leading-relaxed text-ink-soft">
          <Info size={12} className="mt-0.5 shrink-0 text-blue-600" />
          <span>
            Skor 5 menunjukkan kelas yang paling mendukung BGI. Skor parameter
            bukan skor akhir prioritas: nilai akhir dihitung melalui weighted
            overlay dengan bobot 40% / 25% / 25% / 10%.
          </span>
        </div>
      </div>
    </Reveal>
  );
}

function Steps() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {steps.map((step, index) => (
        <Reveal key={step.number} delay={index * 0.06}>
          <div className="relative h-full rounded-[24px] border border-mist-200/70 bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ocean-950 font-mono text-[8.5px] font-semibold text-aqua-300">
                {step.number}
              </span>
              <span className="h-px flex-1 bg-mist-200" />
              {index < steps.length - 1 && (
                <ArrowUpRight size={12} className="text-mist-300" />
              )}
            </div>
            <p className="mt-4 text-[11.5px] font-bold tracking-[-0.02em] text-ink">
              {step.title}
            </p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-ink-soft">
              {step.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function DataNotes() {
  const { summary } = useData();
  return (
    <div className="grid gap-3 lg:grid-cols-12">
      <Reveal className="lg:col-span-7">
        <div className="h-full rounded-[26px] border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-white p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-[#99610c]">
              <Warning size={18} weight="fill" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[17px] font-bold tracking-[-0.035em] text-ink">
                  Duplikasi tutupan lahan
                </h3>
                <Badge tone="amber">{summary.landcover.duplicateGroups} pasang</Badge>
              </div>
              <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
                Data sumber memuat {summary.landcover.sourceFeatures} fitur
                tutupan lahan, tetapi hanya {summary.landcover.uniqueFeatures}{" "}
                geometri unik. Sebanyak {summary.landcover.duplicateGroups}{" "}
                pasang geometri muncul dengan dua kelas berbeda. Jumlah luas
                atribut sumber ({formatArea(summary.landcover.sourceAreaHa)})
                karenanya lebih besar dari luas geometri unik (
                {formatArea(summary.landcover.uniqueAreaHa)}).
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/65 px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink-faint">
                    Aturan tampilan
                  </p>
                  <p className="mt-1 text-[9.5px] font-semibold text-ink">
                    Kelas fitur teratas
                  </p>
                </div>
                <div className="rounded-xl bg-white/65 px-3 py-2">
                  <p className="font-mono text-[8px] uppercase tracking-[0.1em] text-ink-faint">
                    Status
                  </p>
                  <p className="mt-1 text-[9.5px] font-semibold text-[#8b5b0f]">
                    Perlu validasi
                  </p>
                </div>
              </div>
              <p className="mt-3 text-[9px] leading-relaxed text-[#99610c]/85">
                Atlas mengikuti kelas dari fitur terakhir pada ekspor asli agar
                mendekati visual qgis2web. Ini bukan penyelesaian atas
                ketidakpastian data sumber.
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="lg:col-span-5">
        <div className="h-full rounded-[26px] border border-mist-200/70 bg-white p-5">
          <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
            <Database size={12} weight="fill" className="text-blue-600" />
            Batas analisis
          </p>
          <div className="mt-4 space-y-3">
            <div className="flex items-start justify-between gap-3 border-b border-mist-100 pb-3">
              <div>
                <p className="text-[10px] font-semibold text-ink">
                  Area administrasi
                </p>
                <p className="mt-0.5 text-[9px] text-ink-faint">
                  Setelah simplifikasi geometri untuk web
                </p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-ink">
                {formatArea(summary.analyzed.adminAreaHa)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 border-b border-mist-100 pb-3">
              <div>
                <p className="text-[10px] font-semibold text-ink">
                  Area dianalisis
                </p>
                <p className="mt-0.5 text-[9px] text-ink-faint">
                  Total luas fitur prioritas
                </p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-ink">
                {formatArea(summary.analyzed.totalAreaHa)}
              </span>
            </div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold text-ink">
                  Selisih tepi
                </p>
                <p className="mt-0.5 text-[9px] text-ink-faint">
                  Area administrasi yang tidak tercakup
                </p>
              </div>
              <span className="font-mono text-[11px] font-semibold text-[#8b5b0f]">
                {formatArea(summary.analyzed.gapAreaHa)}
              </span>
            </div>
          </div>
          <p className="mt-4 rounded-xl bg-mist-50 px-3 py-2.5 text-[9px] leading-relaxed text-ink-soft">
            Geometri disederhanakan untuk performa peta. Angka luas pada
            atribut dipertahankan dari data asli, sehingga dapat berbeda tipis
            dari hasil hitung geometri web.
          </p>
        </div>
      </Reveal>
    </div>
  );
}

function Limitations() {
  const { summary } = useData();
  const items = [
    {
      title: `Kelas ${formatPercent(summary.priority.highPriorityPct, 1)} tinggi`,
      text: "Proporsi kelas tinggi dan sangat tinggi cukup besar. Ini dapat mencerminkan karakter data atau metode klasifikasi; tidak otomatis berarti seluruh area harus dibangun.",
    },
    {
      title: "Bukan rekomendasi desain",
      text: "Atlas menunjukkan prioritas berbasis parameter. Pemilihan jenis BGI, dimensi, dan kelayakan teknis memerlukan analisis lanjutan.",
    },
    {
      title: "Data mentah tidak lengkap",
      text: "Skor parameter mengikuti shapefile QGIS yang disediakan. Proyek QGIS lengkap tidak disertakan, sehingga proses weighted overlay belum dapat dijalankan ulang secara independen.",
    },
    {
      title: "Skala dan sumber",
      text: "Peta menggunakan basemap Esri, geometri yang disederhanakan, dan layer jalan RBI 25K. Gunakan untuk eksplorasi dan diskusi, bukan pengukuran presisi.",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {items.map((item, index) => (
        <Reveal key={item.title} delay={index * 0.05}>
          <div className="flex h-full gap-3 rounded-[22px] border border-mist-200/70 bg-white p-4">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mist-50 font-mono text-[8px] font-semibold text-blue-700">
              0{index + 1}
            </span>
            <div>
              <p className="text-[11px] font-bold text-ink">{item.title}</p>
              <p className="mt-1 text-[9.5px] leading-relaxed text-ink-soft">
                {item.text}
              </p>
            </div>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function MethodologyPage() {
  const { metadata, summary } = useData();
  return (
    <div>
      <Hero />
      <PageShell className="pb-12 pt-10 sm:pt-12">
        <section>
          <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
                <span className="text-blue-600">01</span>
                <span className="h-px w-5 bg-mist-300" />
                Parameter
              </p>
              <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
                Empat variabel yang membentuk skor.
              </h2>
            </div>
            <p className="max-w-[360px] text-[11px] leading-relaxed text-ink-soft">
              Bobot diambil dari analisis asli. Setiap parameter memiliki peran
              berbeda dalam menentukan prioritas.
            </p>
          </div>
          <WeightCards />
          <ScoreMatrix />
        </section>

        <section className="mt-14">
          <div className="mb-7">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-blue-600">02</span>
              <span className="h-px w-5 bg-mist-300" />
              Alur
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
              Dari layer mentah ke kelas prioritas.
            </h2>
          </div>
          <Steps />
        </section>

        <section className="mt-14">
          <div className="relative overflow-hidden rounded-[30px] bg-ocean-950 p-6 text-white sm:p-8">
            <ContourBackground className="-right-20 -top-28 h-[480px] w-[640px] text-aqua-300/12" />
            <div className="relative grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <Eyebrow tone="light">Interpretasi</Eyebrow>
                <h2 className="mt-4 text-[clamp(1.7rem,3.6vw,2.8rem)] font-extrabold leading-[1.02] tracking-[-0.05em]">
                  Skor adalah pintu masuk, bukan jawaban akhir.
                </h2>
                <p className="mt-3 max-w-[560px] text-[11px] leading-relaxed text-white/50">
                  Weighted overlay membantu mengurutkan prioritas ruang. Namun,
                  keputusan BGI perlu mempertimbangkan kondisi drainase,
                  kepemilikan lahan, kesesuaian fungsi, dan keterlibatan warga.
                  Gunakan peta sebagai bahasa bersama untuk diskusi itu.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  ["Total dianalisis", formatArea(summary.analyzed.totalAreaHa)],
                  ["Kelas tinggi", formatPercent(summary.priority.highPriorityPct, 1)],
                  ["Kecamatan", `${summary.priority.kecamatan.length} wilayah`],
                  ["Kelas", `${summary.priority.classes.length} tingkat`],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-white/10 bg-white/[0.045] p-3"
                  >
                    <p className="font-mono text-[7.5px] uppercase tracking-[0.12em] text-white/35">
                      {label}
                    </p>
                    <p className="mt-1.5 text-[15px] font-bold tracking-[-0.03em] text-white">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-7">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-blue-600">03</span>
              <span className="h-px w-5 bg-mist-300" />
              Catatan data
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
              Hal yang harus dibaca sebelum mengambil kesimpulan.
            </h2>
          </div>
          <DataNotes />
        </section>

        <section className="mt-14">
          <div className="mb-7">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-blue-600">04</span>
              <span className="h-px w-5 bg-mist-300" />
              Batas interpretasi
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
              Transparan tentang apa yang belum bisa dijawab.
            </h2>
          </div>
          <Limitations />
        </section>

        <section className="mt-14">
          <div className="rounded-[26px] border border-mist-200/70 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
                  <Database size={12} weight="fill" className="text-blue-600" />
                  Sumber & alat
                </p>
                <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
                  Jejak data dan perangkat.
                </h3>
              </div>
              <Badge tone="mist">v{metadata.version}</Badge>
            </div>
            <div className="mt-4 grid gap-2 md:grid-cols-2">
              {metadata.sources.map((source) => (
                <div
                  key={source}
                  className="flex items-start gap-2 rounded-xl bg-mist-50 px-3 py-2.5 text-[9.5px] leading-relaxed text-ink-soft"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-aqua-500" />
                  {source}
                </div>
              ))}
              <div className="flex items-start gap-2 rounded-xl bg-mist-50 px-3 py-2.5 text-[9.5px] leading-relaxed text-ink-soft">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                Ekspor qgis2web / Leaflet sebagai sumber geometri dan atribut
              </div>
              <div className="flex items-start gap-2 rounded-xl bg-mist-50 px-3 py-2.5 text-[9.5px] leading-relaxed text-ink-soft">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                React, MapLibre GL, dan Vite untuk antarmuka atlas
              </div>
            </div>
            <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#ff66ff]/25 bg-[#ff66ff]/[0.05] px-3 py-2.5">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#ff66ff]/12 text-[#a800a8]">
                <RoadHorizon size={14} weight="fill" />
              </span>
              <p className="text-[9.5px] leading-relaxed text-ink-soft">
                <span className="font-semibold text-ink">Simbol peta.</span>{" "}
                Unsur rupa bumi mengikuti SNI 6502.2:2010: tutupan lahan memakai
                tint tinta SNI (permukiman oranye 30%, sawah cyan 30%, kebun
                hijau 30%, hutan/semak hijau 40%, tegal kuning 40%, tanah kosong
                tanpa tinta, dan perairan cyan 100%), jalan arteri/kolektor
                magenta dengan casing hitam, lokal hitam-putih, serta jalan
                lain/setapak magenta 40% (setapak putus-putus), dan batas
                kecamatan garis hitam berpola. SNI tidak mengatur kelas tematik
                BGI, sehingga prioritas memakai ramp hijau dan bahaya banjir
                kuning–oranye–merah sebagai palet tematik tersendiri. Tema
                antarmuka web tetap biru.
              </p>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-mist-100 pt-3">
              <p className="max-w-[520px] text-[8.5px] leading-relaxed text-ink-faint">
                Catatan lengkap tersedia di repositori. Atlas ini tidak
                menggantikan dokumen perencanaan resmi.
              </p>
              <Button asChild size="sm" variant="outline">
                <Link to="/tentang">
                  Tentang atlas
                  <ArrowUpRight size={13} weight="bold" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-4 rounded-[26px] border border-mist-200/70 bg-white p-5 sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-700">
                <Sparkle size={19} weight="fill" />
              </span>
              <div>
                <p className="text-[12px] font-bold text-ink">
                  Sudah paham metodenya?
                </p>
                <p className="mt-0.5 text-[9.5px] text-ink-soft">
                  Buka peta dan mulai dari layer prioritas BGI.
                </p>
              </div>
            </div>
            <Button asChild>
              <Link to="/">
                <MapTrifold size={15} weight="fill" />
                Buka peta
                <ArrowUpRight size={13} weight="bold" />
              </Link>
            </Button>
          </div>
        </Reveal>
      </PageShell>
    </div>
  );
}
