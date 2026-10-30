import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { usePersisted, demoTasks, CATEGORIES, uid, fmtDate, type Task } from "@/lib/store";

export const Route = createFileRoute("/actividades")({
  head: () => ({
    meta: [
      { title: "Mis actividades · MindfulBox" },
      { name: "description", content: "Organiza tus tareas por fecha y categoría y marca las completadas." },
      { property: "og:title", content: "Mis actividades · MindfulBox" },
      { property: "og:description", content: "Organiza tus tareas con calma." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Actividades,
});

const CAT_TONE: Record<string, string> = { Personal: "bg-rose", Estudio: "bg-baby", Trabajo: "bg-lavender", Salud: "bg-mint", Hogar: "bg-peach" };

function Actividades() {
  const [tasks, setTasks] = usePersisted<Task[]>("tasks", demoTasks);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("2026-10-31");
  const [category, setCategory] = useState<string>("Personal");
  const [filter, setFilter] = useState("Todas");

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setTasks([{ id: uid(), title, date, category, done: false }, ...tasks]);
    setTitle("");
  };
  const toggle = (id: string) => setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const visible = tasks.filter((t) => filter === "Todas" || t.category === filter);
  const pending = visible.filter((t) => !t.done);
  const done = visible.filter((t) => t.done);

  const Row = ({ t }: { t: Task }) => (
    <li className="flex items-center gap-3 rounded-2xl bg-muted p-3">
      <button onClick={() => toggle(t.id)} aria-label={t.done ? `Marcar pendiente ${t.title}` : `Completar ${t.title}`}
        className={`grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 ${t.done ? "border-mint-deep bg-mint-deep text-primary-foreground" : "border-ring"}`}>
        {t.done && <Check className="h-3.5 w-3.5" />}
      </button>
      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${t.done ? "line-through opacity-60" : ""}`}>{t.title}</p>
        <p className="text-xs text-muted-foreground">{fmtDate(t.date)}</p>
      </div>
      <span className={`hidden rounded-full px-2 py-0.5 text-xs font-bold sm:inline ${CAT_TONE[t.category]}`}>{t.category}</span>
      <button aria-label={`Eliminar ${t.title}`} onClick={() => setTasks(tasks.filter((x) => x.id !== t.id))} className="rounded-full p-2 hover:bg-card"><Trash2 className="h-4 w-4" /></button>
    </li>
  );

  return (
    <div>
      <PageHeader title="Mis actividades" subtitle="Un paso a la vez, sin prisa." deco="⭐" />
      <form onSubmit={add} className="card-soft grid gap-3 bg-mint p-5 sm:grid-cols-[1fr_auto_auto_auto] sm:items-end">
        <div>
          <label htmlFor="tt" className="mb-1 block text-sm font-bold">Actividad</label>
          <input id="tt" value={title} onChange={(e) => setTitle(e.target.value)} className="input-soft !bg-card" placeholder="Ej. Salir a caminar" />
        </div>
        <div>
          <label htmlFor="td" className="mb-1 block text-sm font-bold">Fecha</label>
          <input id="td" type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-soft !bg-card" />
        </div>
        <div>
          <label htmlFor="tc" className="mb-1 block text-sm font-bold">Categoría</label>
          <select id="tc" value={category} onChange={(e) => setCategory(e.target.value)} className="input-soft !bg-card">
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn-primary"><Plus className="h-4 w-4" /> Agregar</button>
      </form>

      <div className="my-6 flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        {["Todas", ...CATEGORIES].map((c) => (
          <button key={c} onClick={() => setFilter(c)} aria-pressed={filter === c}
            className={`rounded-full px-4 py-1.5 text-sm font-bold ${filter === c ? "bg-primary text-primary-foreground" : "bg-card shadow-soft"}`}>{c}</button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="card-soft p-5">
          <h2 className="mb-3 text-xl">Pendientes ({pending.length})</h2>
          <ul className="space-y-2">{pending.map((t) => <Row key={t.id} t={t} />)}</ul>
          {pending.length === 0 && <p className="text-muted-foreground">Nada pendiente 🌸</p>}
        </section>
        <section className="card-soft p-5">
          <h2 className="mb-3 text-xl">Completadas ({done.length}) ✓</h2>
          <ul className="space-y-2">{done.map((t) => <Row key={t.id} t={t} />)}</ul>
          {done.length === 0 && <p className="text-muted-foreground">Aún no completas ninguna.</p>}
        </section>
      </div>
    </div>
  );
}
