import * as React from "react";
import { Link } from "react-router-dom";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import {
  ArrowUpRight,
  ChartDonut,
  Database,
  Info,
  MapPin,
  Ruler,
  TrendUp,
  Warning,
} from "@phosphor-icons/react";
import { Badge } from "@/components/ui/badge";
import { useData } from "@/providers/DataProvider";
import { PRIORITY_ORDER } from "@/lib/constants";
import { formatArea, formatNumber, formatPercent } from "@/lib/format";
import { cn } from "@/lib/format";
import { SectionLabel } from "@/features/panel/panelPrimitives";
import { useAppStore } from "@/stores/useAppStore";

function StatCard({
  label,
  value,
  suffix,
  icon,
  tone = "blue",
}: {
  label: string;
  value: string;
  suffix?: string;
  icon: React.ReactNode;
  tone?: "blue" | "aqua" | "amber" | "ink";
}) {
  const tones = {
    blue: "bg-blue-500/10 text-blue-700",
    aqua: "bg-aqua-500/10 text-aqua-500",
    amber: "bg-amber-500/12 text-[#99610c]",
    ink: "bg-ocean-950 text-white",
  };
  return (
    <div className="rounded-2xl border border-mist-200/70 bg-white p-2.5 shadow-[0_8px_20px_-18px_rgba(4,30,51,.3)]">
      <div className="flex items-start justify-between gap-1">
        <span className={cn("flex h-6 w-6 items-center justify-center rounded-lg", tones[tone])}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-[17px] font-bold leading-none tracking-[-0.04em] text-ink">
        {value}
        {suffix && (
          <span className="ml-0.5 text-[9.5px] font-medium tracking-normal text-ink-faint">
            {suffix}
          </span>
        )}
      </p>
      <p className="mt-1 text-[8.5px] font-medium uppercase tracking-[0.05em] text-ink-faint">
        {label}
      </p>
    </div>
  );
}

function DonutChart() {
  const { summary } = useData();
  const data = summary.priority.classes.map((item) => ({
    name: item.label,
    value: item.areaHa,
    pct: item.pct,
    color: item.color,
  }));

  return (
    <div className="rounded-[20px] border border-mist-200/70 bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
          <ChartDonut size={12} weight="fill" className="text-blue-600" />
          Komposisi prioritas
        </span>
        <span className="font-mono text-[8.5px] text-ink-faint">ha</span>
      </div>
      <div className="relative mt-1 h-[158px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={72}
              paddingAngle={3}
              cornerRadius={7}
              stroke="none"
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <RechartsTooltip
              cursor={false}
              content={({ active, payload }: any) => {
                if (!active || !payload?.length) return null;
                const item = payload[0].payload;
                return (
                  <div className="rounded-xl border border-white bg-white/95 px-2.5 py-1.5 shadow-lg backdrop-blur">
                    <p className="flex items-center gap-1.5 text-[10px] font-bold text-ink">
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </p>
                    <p className="mt-0.5 font-mono text-[9px] text-ink-faint">
                      {formatArea(item.value)} · {formatPercent(item.pct)}
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[17px] font-bold leading-none tracking-[-0.04em] text-ink">
            {formatNumber(summary.priority.totalAreaHa, 0)}
          </span>
          <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.12em] text-ink-faint">
            hektare
          </span>
        </div>
      </div>
      <div className="mt-1 space-y-1.5">
        {summary.priority.classes.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span
              className="h-2 w-2 shrink-0 rounded-full ring-1 ring-inset ring-black/10"
              style={{ backgroundColor: item.color }}
            />
            <span className="flex-1 text-[9.5px] font-medium text-ink-soft">
              {item.label}
            </span>
            <span className="font-mono text-[8.5px] text-ink-faint">
              {formatArea(item.areaHa)} · {formatPercent(item.pct, 1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function KecamatanStack() {
  const { summary } = useData();
  const max = Math.max(...summary.priority.kecamatan.map((item) => item.totalAreaHa));

  return (
    <div className="rounded-[20px] border border-mist-200/70 bg-white p-3">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[9.5px] font-bold uppercase tracking-[0.13em] text-ink-faint">
          <MapPin size={12} weight="fill" className="text-blue-600" />
          Luas per kecamatan
        </span>
        <span className="font-mono text-[8.5px] text-ink-faint">ha</span>
      </div>
      <div className="mt-3 space-y-2.5">
        {summary.priority.kecamatan.map((kecamatan) => (
          <div key={kecamatan.name}>
            <div className="mb-1 flex items-center justify-between">
              <span className="text-[9.5px] font-semibold text-ink">
                {kecamatan.name}
              </span>
              <span className="font-mono text-[8.5px] text-ink-faint">
                {formatNumber(kecamatan.totalAreaHa, 0)}
              </span>
            </div>
            <div className="flex h-2 w-full gap-px overflow-hidden rounded-full bg-mist-100">
              <span
                className="h-full rounded-l-full bg-mist-300/50"
                style={{ width: `${(kecamatan.totalAreaHa / max) * 100}%` }}
              >
                <span className="flex h-full">
                  {PRIORITY_ORDER.map((label) => {
                    const classData = summary.priority.classes.find(
                      (item) => item.label === label
                    );
                    const value = kecamatan.classes[label.toLowerCase().replace(" ", "-")] ?? 0;
                    if (!value) return null;
                    return (
                      <span
                        key={label}
                        className="h-full first:rounded-l-full"
                        style={{
                          width: `${(value / kecamatan.totalAreaHa) * 100}%`,
                          backgroundColor: classData?.color,
                        }}
                        title={`${label}: ${formatArea(value)}`}
                      />
                    );
                  })}
                </span>
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-x-2.5 gap-y-1 border-t border-mist-100 pt-2">
        {summary.priority.classes.map((item) => (
          <span key={item.label} className="flex items-center gap-1 text-[8px] text-ink-faint">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}

export function StatsTab() {
  const { summary } = useData();
  const setActiveTab = useAppStore((state) => state.setActiveTab);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-1.5">
        <StatCard
          label="Area dianalisis"
          value={formatNumber(summary.analyzed.totalAreaHa, 1)}
          suffix="ha"
          icon={<Ruler size={13} weight="bold" />}
        />
        <StatCard
          label="Prioritas tinggi"
          value={formatNumber(summary.priority.highPriorityPct, 1)}
          suffix="%"
          icon={<TrendUp size={13} weight="bold" />}
          tone="aqua"
        />
        <StatCard
          label="Kecamatan"
          value={String(summary.priority.kecamatan.length)}
          suffix="wilayah"
          icon={<MapPin size={13} weight="bold" />}
          tone="ink"
        />
        <StatCard
          label="Duplikat data"
          value={String(summary.landcover.duplicateGroups)}
          suffix="pasang"
          icon={<Warning size={13} weight="bold" />}
          tone="amber"
        />
      </div>

      <DonutChart />
      <KecamatanStack />

      <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-ocean-950 to-[#073b5f] p-4 text-white">
        <div className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full border border-white/10" />
        <div className="flex items-center gap-1.5">
          <Badge tone="glass" className="px-1.5 py-0.5 text-[8px]">
            Insight
          </Badge>
          <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-white/40">
            Kota Cirebon
          </span>
        </div>
        <p className="mt-2 text-[14px] font-bold leading-snug tracking-[-0.02em]">
          {formatPercent(summary.priority.highPriorityPct, 1)} area yang dianalisis
          berada pada kelas tinggi dan sangat tinggi.
        </p>
        <p className="mt-1.5 text-[9.5px] leading-relaxed text-white/50">
          {summary.priority.kecamatan[0]?.name} menyumbang area terbesar (
          {formatArea(summary.priority.kecamatan[0]?.totalAreaHa ?? 0)}), diikuti{" "}
          {summary.priority.kecamatan[1]?.name}.
        </p>
        <Link
          to="/ringkasan"
          onClick={() => setActiveTab("layers")}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1.5 text-[9.5px] font-semibold text-white ring-1 ring-inset ring-white/15 transition-colors hover:bg-white/15"
        >
          Baca ringkasan lengkap
          <ArrowUpRight size={12} weight="bold" />
        </Link>
      </div>

      <div className="rounded-[18px] border border-amber-500/18 bg-amber-500/[0.055] p-3">
        <div className="flex items-start gap-2">
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-[#99610c]">
            <Database size={13} weight="fill" />
          </span>
          <div>
            <p className="text-[10px] font-bold text-[#8b5b0f]">Catatan kualitas data</p>
            <p className="mt-1 text-[9px] leading-relaxed text-[#99610c]/85">
              Tutupan lahan memiliki {summary.landcover.duplicateGroups} pasang
              geometri duplikat. Selisih area administrasi dan area dianalisis:{" "}
              {formatArea(summary.analyzed.gapAreaHa)}.
            </p>
            <Link
              to="/metodologi"
              className="mt-1.5 inline-flex items-center gap-1 text-[9px] font-bold text-[#8b5b0f] underline decoration-[#8b5b0f]/20 underline-offset-2"
            >
              <Info size={10} />
              Baca catatan lengkap
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
