import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { MOODS } from "@/lib/store";

export const Route = createFileRoute("/progreso")({
  head: () => ({
    meta: [
      { title: "Mi progreso · MindfulBox" },
      { name: "description", content: "Gráficas y estadísticas semanales y mensuales de tu bienestar." },
      { property: "og:title", content: "Mi progreso · MindfulBox" },
      { property: "og:description", content: "Mira cuánto has avanzado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Progreso,
});

const DATA = {
  semana: { labels: ["L", "M", "X", "J", "V", "S", "D"], tasks: [3, 5, 2, 6, 4, 7, 5], mood: [3, 4, 2, 4, 5, 5, 4], stats: { tareas: 32, diario: 5, registros: 7, minutos: 210 } },
  mes: { labels: ["S1", "S2", "S3", "S4"], tasks: [18, 24, 21, 32], mood: [3, 4, 3, 4], stats: { tareas: 95, diario: 17, registros: 26, minutos: 820 } },
};
const MOOD_DIST = [
  { id: "feliz", v: 38 }, { id: "tranquila", v: 26 }, { id: "emocionada", v: 14 }, { id: "cansada", v: 12 }, { id: "triste", v: 6 }, { id: "ansiosa", v: 4 },
];

function Progreso() {
  const [range, setRange] = useState<"semana" | "mes">("semana");
  const d = DATA[range];
  const max = Math.max(...d.tasks);
  const pts = d.mood.map((v, i) => `${(i / (d.mood.length - 1)) * 300 + 10},${110 - v * 20}`).join(" ");

  return (
    <div>
      <PageHeader title="Mi progreso" subtitle="Cada pequeño paso suma. ¡Mira todo lo que has logrado!" deco="📈" />
      <div className="mb-6 inline-flex rounded-full bg-card p-1 shadow-soft" role="group" aria-label="Periodo">
        {(["semana", "mes"] as const).map((r) => (
          <Button variant="ghost" key={r} onClick={() => setRange(r)} aria-pressed={range === r}
            className={`rounded-full px-5 py-1.5 font-bold capitalize ${range === r ? "bg-primary text-primary-foreground" : ""}`}>{r === "semana" ? "Semanal" : "Mensual"}</Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { l: "Tareas completadas", v: d.stats.tareas, t: "bg-mint" },
          { l: "Entradas de diario", v: d.stats.diario, t: "bg-card" },
          { l: "Registros de ánimo", v: d.stats.registros, t: "bg-rose" },
          { l: "Minutos para mí", v: d.stats.minutos, t: "bg-card" },
        ].map((s) => (
          <div key={s.l} className={`card-soft p-4 ${s.t}`}>
            <p className="text-sm font-bold text-muted-foreground">{s.l}</p>
            <p className="font-display text-3xl font-semibold">{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="border-t p-5">
          <h2 className="mb-4 text-xl">Actividades completadas</h2>
          <div className="flex h-48 items-end gap-2 sm:gap-3" role="img" aria-label={`Actividades por ${range}: ${d.tasks.join(", ")}`}>
            {d.tasks.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-bold">{v}</span>
                <div className="w-full rounded-t-xl bg-lavender-deep/70" style={{ height: `${(v / max) * 140}px` }} />
                <span className="text-xs font-bold text-muted-foreground">{d.labels[i]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="border-t p-5">
          <h2 className="mb-4 text-xl">Estado de ánimo</h2>
          <svg viewBox="0 0 320 120" className="h-48 w-full" role="img" aria-label="Tendencia de ánimo">
            <polyline points={pts} fill="none" className="stroke-rose-deep" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            {d.mood.map((v, i) => (
              <circle key={i} cx={(i / (d.mood.length - 1)) * 300 + 10} cy={110 - v * 20} r="6" className="fill-rose stroke-rose-deep" strokeWidth="3" />
            ))}
          </svg>
          <div className="flex justify-between px-1 text-xs font-bold text-muted-foreground">{d.labels.map((l) => <span key={l}>{l}</span>)}</div>
        </section>

        <section className="border-t p-5 lg:col-span-2">
          <h2 className="mb-4 text-xl">Emociones del {range}</h2>
          <ul className="space-y-3">
            {MOOD_DIST.map((m) => {
              const mood = MOODS.find((x) => x.id === m.id);
              if (!mood) return null;
              return (
                <li key={m.id} className="flex items-center gap-3">
                  <span className="w-28 shrink-0 font-semibold">{mood.emoji} {mood.label}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary/70" style={{ width: `${m.v}%` }} /></div>
                  <span className="w-10 text-right text-sm font-bold">{m.v}%</span>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
    </div>
  );
}
