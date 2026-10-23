import { Link } from "react-router-dom";
import { ArrowLeft, Compass, MapTrifold } from "@phosphor-icons/react";
import {
  ContourBackground,
  Eyebrow,
  PageShell,
} from "@/components/common/PagePrimitives";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <div className="relative flex min-h-[calc(100dvh-84px)] items-center overflow-hidden">
      <ContourBackground className="left-1/2 top-1/2 h-[720px] w-[980px] -translate-x-1/2 -translate-y-1/2 text-blue-600/12" />
      <PageShell className="relative py-16">
        <div className="mx-auto max-w-[560px] text-center">
          <Eyebrow>404 · Halaman tidak ditemukan</Eyebrow>
          <p className="mt-6 font-mono text-[clamp(4rem,12vw,8rem)] font-semibold leading-none tracking-[-0.08em] text-mist-300">
            404
          </p>
          <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.8rem)] font-extrabold leading-[1.05] tracking-[-0.05em] text-ink">
            Sepertinya Anda keluar dari peta.
          </h1>
          <p className="mx-auto mt-3 max-w-[400px] text-[11.5px] leading-relaxed text-ink-soft">
            Halaman yang Anda cari tidak tersedia. Kembali ke atlas untuk
            menjelajahi prioritas BGI Kota Cirebon.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link to="/">
                <MapTrifold size={16} weight="fill" />
                Buka peta
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/ringkasan">
                <Compass size={16} weight="bold" />
                Ringkasan
              </Link>
            </Button>
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1.5 text-[10px] font-semibold text-ink-faint transition-colors hover:text-blue-700"
          >
            <ArrowLeft size={12} />
            Kembali ke awal
          </Link>
        </div>
      </PageShell>
    </div>
  );
}
