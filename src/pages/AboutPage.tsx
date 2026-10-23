import * as React from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Buildings,
  Drop,
  GithubLogo,
  Info,
  Leaf,
  MapPin,
  MapTrifold,
  Sparkle,
  Waves,
} from "@phosphor-icons/react";
import {
  ContourBackground,
  Eyebrow,
  PageShell,
  Reveal,
} from "@/components/common/PagePrimitives";
import { BrandMark } from "@/components/brand/BrandMark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useData } from "@/providers/DataProvider";
import { formatArea } from "@/lib/format";

const bgiPillars = [
  {
    key: "blue",
    title: "Biru",
    subtitle: "Air sebagai sistem",
    text: "Retensi, resapan, kanal, dan ruang air yang memberi limpasan tempat untuk bergerak dan tersimpan.",
    icon: <Drop size={19} weight="fill" />,
    className: "bg-blue-500/10 text-blue-700",
  },
  {
    key: "green",
    title: "Hijau",
    subtitle: "Vegetasi sebagai jaring",
    text: "Pohon, taman, dan ruang terbuka hijau yang memperlambat air, meneduhkan kota, dan menghubungkan habitat.",
    icon: <Leaf size={19} weight="fill" />,
    className: "bg-emerald-600/10 text-emerald-600",
  },
  {
    key: "hybrid",
    title: "Hibrida",
    subtitle: "Ruang yang bekerja bersama",
    text: "Solusi yang menyatukan fungsi air dan vegetasi, seperti rain garden, bioswale, dan tepian sungai yang hidup.",
    icon: <Waves size={19} weight="fill" />,
    className: "bg-aqua-500/10 text-aqua-500",
  },
];

function Hero() {
  const { metadata, summary } = useData();
  return (
    <section className="relative overflow-hidden border-b border-mist-200/60 bg-gradient-to-b from-white to-mist-50">
      <ContourBackground className="-right-32 -top-40 h-[680px] w-[900px] text-aqua-500/14" />
      <PageShell className="relative py-12 sm:py-16 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal>
            <Eyebrow>Tentang atlas</Eyebrow>
            <h1 className="mt-5 max-w-[700px] text-[clamp(2.5rem,5.4vw,5rem)] font-extrabold leading-[0.95] tracking-[-0.065em] text-ink text-balance">
              Ruang kota yang membaca{" "}
              <span className="bg-gradient-to-r from-blue-700 to-aqua-500 bg-clip-text text-transparent">
                air dan hijau.
              </span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[13px] leading-relaxed text-ink-soft sm:text-[14px]">
              BGI Cirebon adalah atlas digital untuk membaca prioritas
              pengembangan Blue-Green Infrastructure di Kota Cirebon. Dibangun
              dari ekspor analisis spasial, dirancang ulang sebagai peta
              interaktif yang lebih ringan dan mudah dipahami.
            </p>
            <div className="mt-7 flex flex-wrap gap-2.5">
              <Button asChild size="lg">
                <Link to="/">
                  <MapTrifold size={17} weight="fill" />
                  Buka peta
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/metodologi">
                  Metodologi
                  <ArrowUpRight size={15} weight="bold" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:justify-self-end">
            <div className="relative w-full max-w-[440px] overflow-hidden rounded-[32px] border border-white/10 bg-ocean-950 p-6 text-white shadow-[0_32px_90px_-30px_rgba(4,30,51,.6)]">
              <div className="pointer-events-none absolute -bottom-20 -right-16 h-52 w-52 rounded-full bg-aqua-300/10 blur-3xl" />
              <div className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full border border-white/8" />
              <div className="relative flex items-start justify-between">
                <BrandMark className="h-14 w-14" />
                <Badge tone="glass">2026 · v{metadata.version}</Badge>
              </div>
              <p className="relative mt-6 font-mono text-[8.5px] uppercase tracking-[0.17em] text-white/35">
                Blue-Green Infrastructure
              </p>
              <p className="relative mt-1.5 text-[22px] font-bold leading-tight tracking-[-0.045em]">
                Kota Cirebon, dari empat parameter.
              </p>
              <p className="relative mt-2 text-[10px] leading-relaxed text-white/45">
                {formatArea(summary.analyzed.totalAreaHa)} area dianalisis
                melalui tutupan lahan, kemiringan, elevasi, dan jarak dari
                sungai.
              </p>
              <div className="relative mt-5 grid grid-cols-3 gap-2 border-t border-white/10 pt-4">
                <div>
                  <p className="text-[18px] font-bold tracking-[-0.04em] text-aqua-300">
                    {summary.priority.kecamatan.length}
                  </p>
                  <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-white/35">
                    kecamatan
                  </p>
                </div>
                <div>
                  <p className="text-[18px] font-bold tracking-[-0.04em] text-aqua-300">
                    40%
                  </p>
                  <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-white/35">
                    bobot lahan
                  </p>
                </div>
                <div>
                  <p className="text-[18px] font-bold tracking-[-0.04em] text-aqua-300">
                    4
                  </p>
                  <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.1em] text-white/35">
                    kelas
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </PageShell>
    </section>
  );
}

function BgiPillars() {
  return (
    <div className="grid gap-3 md:grid-cols-3">
      {bgiPillars.map((pillar, index) => (
        <Reveal key={pillar.key} delay={index * 0.07}>
          <div className="group h-full rounded-[26px] border border-mist-200/70 bg-white p-5 transition-shadow hover:shadow-[0_20px_50px_-28px_rgba(4,30,51,.4)]">
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${pillar.className}`}
            >
              {pillar.icon}
            </span>
            <p className="mt-4 text-[18px] font-extrabold tracking-[-0.04em] text-ink">
              {pillar.title}
            </p>
            <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.11em] text-ink-faint">
              {pillar.subtitle}
            </p>
            <p className="mt-2 text-[10px] leading-relaxed text-ink-soft">
              {pillar.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

function Credits() {
  const { metadata } = useData();
  return (
    <div className="grid gap-3 lg:grid-cols-12">
      <Reveal className="lg:col-span-7">
        <div className="h-full rounded-[26px] border border-mist-200/70 bg-white p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 font-mono text-[8.5px] uppercase tracking-[0.15em] text-ink-faint">
                <Sparkle size={12} weight="fill" className="text-blue-600" />
                Kredit
              </p>
              <h3 className="mt-1.5 text-[17px] font-bold tracking-[-0.035em] text-ink">
                Dibangun dari kerja analisis spasial.
              </h3>
            </div>
            <Badge tone="blue">{metadata.legacy}</Badge>
          </div>
          <p className="mt-3 text-[10px] leading-relaxed text-ink-soft">
            Geometri berasal dari ekspor qgis2web proyek analisis BGI Kota
            Cirebon, sedangkan skor parameter 1–5 diambil dari field skor
            shapefile QGIS. Antarmuka atlas dikembangkan ulang dengan React,
            MapLibre GL, dan Vite. Basemap disediakan oleh Esri dan
            OpenStreetMap.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-mist-50 px-3 py-2.5">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-ink-faint">
                Analisis asli
              </p>
              <p className="mt-1 text-[9.5px] font-semibold text-ink">
                Weighted overlay BGI Kota Cirebon
              </p>
            </div>
            <div className="rounded-xl bg-mist-50 px-3 py-2.5">
              <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-ink-faint">
                Antarmuka
              </p>
              <p className="mt-1 text-[9.5px] font-semibold text-ink">
                React · MapLibre GL · Vite
              </p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a
              href="https://github.com/andiakhsanul/matkulsip"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-ink-soft transition-colors hover:border-mist-300 hover:text-ink"
            >
              <GithubLogo size={12} weight="fill" />
              Repositori GitHub
              <ArrowUpRight size={10} />
            </a>
            <Link
              to="/metodologi"
              className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 bg-white px-2.5 py-1.5 text-[9px] font-semibold text-ink-soft transition-colors hover:border-mist-300 hover:text-ink"
            >
              Sumber & metode
              <ArrowUpRight size={10} />
            </Link>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="lg:col-span-5">
        <div className="h-full rounded-[26px] border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.07] to-white p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/15 text-[#99610c]">
              <Info size={17} weight="fill" />
            </span>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b5b0f]">
                Disclaimer
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-ink-soft">
                Atlas ini dibuat untuk pembelajaran, eksplorasi data, dan
                diskusi perencanaan. Hasil analisis tidak menggantikan studi
                kelayakan, dokumen perencanaan resmi, atau penilaian lapangan.
              </p>
              <p className="mt-2 text-[9px] leading-relaxed text-[#99610c]/85">
                Kelas prioritas tinggi tidak otomatis berarti suatu area harus
                dibangun. Konteks lokal tetap menjadi pertimbangan utama.
              </p>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function ReadingGuide() {
  const items = [
    {
      number: "01",
      title: "Mulai dari prioritas",
      text: "Layer prioritas BGI adalah pintu masuk. Warna menunjukkan kelas, bukan jenis intervensi.",
    },
    {
      number: "02",
      title: "Uji dengan parameter",
      text: "Buka layer tutupan lahan, lereng, elevasi, atau jarak sungai untuk membaca skor 1–5 dari QGIS di balik setiap kelas.",
    },
    {
      number: "03",
      title: "Baca catatan data",
      text: "Periksa duplikasi tutupan lahan dan selisih area sebelum menarik kesimpulan pada skala detail.",
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {items.map((item, index) => (
        <Reveal key={item.number} delay={index * 0.06}>
          <div className="h-full rounded-[22px] border border-mist-200/70 bg-white p-4">
            <span className="font-mono text-[9px] font-semibold text-blue-600">
              {item.number}
            </span>
            <p className="mt-3 text-[11.5px] font-bold text-ink">{item.title}</p>
            <p className="mt-1.5 text-[9.5px] leading-relaxed text-ink-soft">
              {item.text}
            </p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

export function AboutPage() {
  const { summary } = useData();
  return (
    <div>
      <Hero />
      <PageShell className="pb-12 pt-10 sm:pt-12">
        <section>
          <div className="mb-7">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-blue-600">01</span>
              <span className="h-px w-5 bg-mist-300" />
              Kerangka
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
              Tiga cara membaca BGI.
            </h2>
          </div>
          <BgiPillars />
        </section>

        <section className="mt-14">
          <div className="grid gap-8 rounded-[30px] border border-mist-200/70 bg-white p-6 sm:p-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
            <Reveal>
              <Eyebrow>Mengapa Cirebon</Eyebrow>
              <h2 className="mt-4 text-[clamp(1.7rem,3.4vw,2.7rem)] font-extrabold leading-[1.04] tracking-[-0.05em] text-ink text-balance">
                Kota pesisir dengan ruang air yang padat.
              </h2>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-soft">
                Cirebon memiliki karakter perkotaan yang padat, jaringan sungai
                yang melintas, dan tantangan limpasan air. Dalam konteks ini,
                BGI bukan hanya soal menambah taman, tetapi merancang ruang yang
                bekerja untuk air sekaligus kehidupan kota.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Badge tone="mist">
                  <Buildings size={10} /> {summary.priority.kecamatan.length} kecamatan
                </Badge>
                <Badge tone="mist">
                  <MapPin size={10} /> {formatArea(summary.analyzed.totalAreaHa)}
                </Badge>
                <Badge tone="mist">
                  <Waves size={10} /> 4 parameter
                </Badge>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="grid grid-cols-2 gap-2">
                {[
                  {
                    label: "Area dianalisis",
                    value: formatArea(summary.analyzed.totalAreaHa),
                    accent: "text-blue-700",
                  },
                  {
                    label: "Prioritas tinggi",
                    value: `${summary.priority.highPriorityPct.toLocaleString("id-ID", {
                      maximumFractionDigits: 1,
                    })}%`,
                    accent: "text-aqua-500",
                  },
                  {
                    label: "Kecamatan",
                    value: String(summary.priority.kecamatan.length),
                    accent: "text-ink",
                  },
                  {
                    label: "Kelas prioritas",
                    value: String(summary.priority.classes.length),
                    accent: "text-ink",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[18px] bg-mist-50 p-3.5"
                  >
                    <p className="font-mono text-[7.5px] uppercase tracking-[0.1em] text-ink-faint">
                      {item.label}
                    </p>
                    <p className={`mt-2 text-[20px] font-bold tracking-[-0.04em] ${item.accent}`}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-7">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-blue-600">02</span>
              <span className="h-px w-5 bg-mist-300" />
              Panduan
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
              Mulai dari mana?
            </h2>
          </div>
          <ReadingGuide />
        </section>

        <section className="mt-14">
          <div className="mb-7">
            <p className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-faint">
              <span className="text-blue-600">03</span>
              <span className="h-px w-5 bg-mist-300" />
              Kredit & batasan
            </p>
            <h2 className="mt-2 text-[clamp(1.6rem,3vw,2.35rem)] font-extrabold leading-[1.08] tracking-[-0.045em] text-ink">
              Jelas tentang asal dan batasnya.
            </h2>
          </div>
          <Credits />
        </section>

        <Reveal className="mt-12">
          <div className="flex flex-col items-start justify-between gap-4 rounded-[26px] border border-white/20 bg-gradient-to-br from-ocean-950 to-blue-700 p-5 text-white sm:flex-row sm:items-center">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-aqua-300">
                <Waves size={19} weight="fill" />
              </span>
              <div>
                <p className="text-[12px] font-bold">Atlas ini hidup di peta.</p>
                <p className="mt-0.5 text-[9.5px] text-white/50">
                  Jelajahi prioritas, filter kecamatan, dan baca detail wilayah.
                </p>
              </div>
            </div>
            <Button
              asChild
              className="bg-white text-blue-700 hover:bg-mist-50"
            >
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
