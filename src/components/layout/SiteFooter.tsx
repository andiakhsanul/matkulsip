import { Link } from "react-router-dom";
import { ArrowUpRight, GithubLogo, MapTrifold } from "@phosphor-icons/react";
import { BrandLockup } from "@/components/brand/BrandMark";
import { NAV_ITEMS } from "@/lib/navigation";
import { PageShell } from "@/components/common/PagePrimitives";
import { useData } from "@/providers/DataProvider";
import { formatDate } from "@/lib/format";

export function SiteFooter() {
  const { summary } = useData();
  return (
    <footer className="mt-24 border-t border-mist-200/70 bg-white/55">
      <PageShell className="py-12 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_1fr]">
          <div>
            <BrandLockup />
            <p className="mt-4 max-w-[330px] text-[11.5px] leading-relaxed text-ink-soft">
              Atlas digital prioritas pengembangan Blue-Green Infrastructure di
              Kota Cirebon. Dibangun dari analisis spasial empat parameter untuk
              mendukung pembacaan peluang resapan, konektivitas air, dan ruang
              terbuka hijau.
            </p>
            <Link
              to="/"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-ocean-950 px-3.5 py-2.5 text-[10.5px] font-semibold text-white transition-colors hover:bg-ocean-800"
            >
              <MapTrifold size={14} weight="fill" />
              Buka peta interaktif
              <ArrowUpRight size={13} weight="bold" />
            </Link>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-ink-faint">
              Navigasi
            </p>
            <nav className="mt-3 flex flex-col gap-2.5">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="w-fit text-[11px] font-medium text-ink-soft transition-colors hover:text-blue-700"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="text-[9px] font-bold uppercase tracking-[0.17em] text-ink-faint">
              Data & kredit
            </p>
            <p className="mt-3 text-[10.5px] leading-relaxed text-ink-soft">
              Analisis weighted overlay BGI Kota Cirebon. Geometri dan atribut
              mengikuti ekspor qgis2web asli. Basemap oleh Esri dan
              OpenStreetMap.
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href="https://github.com/andiakhsanul/matkulsip"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-mist-200 bg-white px-2.5 py-1.5 text-[9.5px] font-semibold text-ink-soft transition-colors hover:border-mist-300 hover:text-ink"
              >
                <GithubLogo size={13} weight="fill" />
                Repositori
              </a>
              <span className="font-mono text-[8.5px] text-ink-faint">
                v1.0 · {formatDate(summary.generatedAt)}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-mist-200/70 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[9px] text-ink-faint">
            © 2026 BGI Cirebon Atlas. Dibuat untuk pembelajaran dan diskusi
            perencanaan.
          </p>
          <p className="text-[9px] text-ink-faint">
            Bukan dokumen keputusan perencanaan final.
          </p>
        </div>
      </PageShell>
    </footer>
  );
}
