import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, Trash2, CalendarHeart } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { usePersisted, demoGoals, uid, fmtDate, type Goal } from "@/lib/store";

export const Route = createFileRoute("/objetivos")({
  head: () => ({
    meta: [
      { title: "Mis objetivos · MindfulBox" },
      { name: "description", content: "Crea metas con fecha límite, subtareas y barras de progreso." },
      { property: "og:title", content: "Mis objetivos · MindfulBox" },
      { property: "og:description", content: "Tus metas, paso a paso." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Objetivos,
});

const TONES = ["bg-baby/40", "bg-card"];

function Objetivos() {
  const [goals, setGoals] = usePersisted<Goal[]>("goals", demoGoals);
  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("2026-12-31");
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const update = (id: string, fn: (g: Goal) => Goal) => setGoals(goals.map((g) => (g.id === id ? fn(g) : g)));
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setGoals([...goals, { id: uid(), title, deadline, subtasks: [] }]);
    setTitle("");
  };

  return (
    <div>
      <PageHeader title="Mis objetivos" subtitle="Sueña en grande, avanza en pequeño." deco="🌟" />
      <form onSubmit={add} className="card-soft mb-6 grid gap-3 bg-baby p-5 sm:grid-cols-[1fr_auto_auto] sm:items-end">
        <div>
          <label htmlFor="gt" className="mb-1 block text-sm font-bold">Nueva meta</label>
          <input id="gt" value={title} onChange={(e) => setTitle(e.target.value)} className="input-soft !bg-card" placeholder="Ej. Correr 5 km" />
        </div>
        <div>
          <label htmlFor="gd" className="mb-1 block text-sm font-bold">Fecha límite</label>
          <input id="gd" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="input-soft !bg-card" />
        </div>
        <Button variant="ghost" className="btn-primary"><Plus className="h-4 w-4" /> Crear meta</Button>
      </form>

      <div className="grid gap-5 md:grid-cols-2">
        {goals.map((g, i) => {
          const done = g.subtasks.filter((s) => s.done).length;
          const pct = g.subtasks.length ? Math.round((done / g.subtasks.length) * 100) : 0;
          return (
            <article key={g.id} className={`card-soft p-5 ${TONES[i % TONES.length]}`}>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-xl">{g.title}</h2>
                  <p className="flex items-center gap-1 text-sm text-muted-foreground"><CalendarHeart className="h-4 w-4" /> Hasta el {fmtDate(g.deadline)}</p>
                </div>
                <Button variant="ghost" aria-label={`Eliminar meta ${g.title}`} onClick={() => setGoals(goals.filter((x) => x.id !== g.id))} className="rounded-full p-2 hover:bg-card"><Trash2 className="h-4 w-4" /></Button>
              </div>
              <div className="mt-4">
                <div className="mb-1 flex justify-between text-sm font-bold"><span>Progreso</span><span>{pct}%</span></div>
                <div className="h-3 overflow-hidden rounded-full bg-card" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`Progreso de ${g.title}`}>
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <ul className="mt-4 space-y-1.5">
                {g.subtasks.map((s) => (
                  <li key={s.id}>
                    <label className="flex cursor-pointer items-center gap-2 rounded-xl bg-card/70 px-3 py-2">
                      <input type="checkbox" className="sr-only" checked={s.done}
                        onChange={() => update(g.id, (x) => ({ ...x, subtasks: x.subtasks.map((y) => (y.id === s.id ? { ...y, done: !y.done } : y)) }))} />
                      <span className={`grid h-5 w-5 place-items-center rounded-md border-2 ${s.done ? "border-primary bg-primary text-primary-foreground" : "border-ring"}`}>{s.done && <Check className="h-3 w-3" />}</span>
                      <span className={s.done ? "line-through opacity-60" : "font-semibold"}>{s.title}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <form className="mt-3 flex gap-2" onSubmit={(e) => {
                e.preventDefault();
                const t = drafts[g.id]?.trim();
                if (!t) return;
                update(g.id, (x) => ({ ...x, subtasks: [...x.subtasks, { id: uid(), title: t, done: false }] }));
                setDrafts({ ...drafts, [g.id]: "" });
              }}>
                <label htmlFor={`sub-${g.id}`} className="sr-only">Nueva subtarea</label>
                <input id={`sub-${g.id}`} value={drafts[g.id] ?? ""} onChange={(e) => setDrafts({ ...drafts, [g.id]: e.target.value })} className="input-soft !bg-card !py-2" placeholder="Agregar subtarea" />
                <Button variant="ghost" className="btn-soft !bg-card" aria-label="Agregar subtarea"><Plus className="h-4 w-4" /></Button>
              </form>
            </article>
          );
        })}
      </div>
    </div>
  );
}
