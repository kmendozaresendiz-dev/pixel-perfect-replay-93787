import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smile, BookHeart, ListChecks, Flower2, Sparkles, Check, ArrowUpRight, Target, CalendarDays } from "lucide-react";
import { usePersisted, demoTasks, demoMoods, demoGoals, MOODS, fmtDate, type Task, type MoodEntry, type Goal } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { MiniCalendar, localDay } from "@/components/MiniCalendar";
import stationery from "@/assets/welcome-stationery.jpg";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Mi espacio · MindfulBox" },
    { name: "description", content: "Tu agenda de bienestar: calendario, actividades, emociones y objetivos en MindfulBox." },
    { property: "og:title", content: "Mi espacio · MindfulBox" },
    { property: "og:description", content: "Un pequeño espacio para organizar tu día y cuidarte." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }), component: Index,
});
const QUOTES = ["Florecer también lleva su tiempo.", "Hoy elige ser amable contigo.", "Los pequeños pasos también cuentan.", "Tu calma es tu superpoder."];
function Index() {
  const [tasks, setTasks] = usePersisted<Task[]>("tasks", demoTasks);
  const [moods] = usePersisted<MoodEntry[]>("moods", demoMoods);
  const [goals] = usePersisted<Goal[]>("goals", demoGoals);
  const [today, setToday] = useState("");
  const [selected, setSelected] = useState("");
  const [quote, setQuote] = useState(QUOTES[0]);
  useEffect(() => { const d = new Date(); setToday(localDay(d)); setSelected(localDay(d)); setQuote(QUOTES[d.getDate() % QUOTES.length]); }, []);
  const dayTasks = tasks.filter((t) => t.date === selected);
  const pending = tasks.filter((t) => !t.done).sort((a, b) => a.date.localeCompare(b.date));
  const lastMood = MOODS.find((m) => m.id === moods[0]?.mood);
  const activeGoals = goals.filter((g) => g.subtasks.length === 0 || g.subtasks.some((s) => !s.done));
  const quick = [
    { to: "/registro", label: "Registrar emoción", icon: Smile, tone: "bg-rose" },
    { to: "/diario", label: "Escribir en diario", icon: BookHeart, tone: "bg-lavender" },
    { to: "/actividades", label: "Nueva actividad", icon: ListChecks, tone: "bg-mint" },
    { to: "/tiempo", label: "Tiempo para mí", icon: Flower2, tone: "bg-rose" },
  ] as const;
  return <div className="space-y-7">
    <section className="relative overflow-hidden border-b pb-6">
      <img src={stationery} alt="Cuaderno, té y una flor de papelería pastel" width={1024} height={768} className="pointer-events-none absolute inset-y-0 right-0 h-full w-full object-contain object-right opacity-20 sm:w-1/2 sm:opacity-100" />
      <div className="relative z-10 max-w-xl py-5 sm:max-w-[60%] sm:py-7"><p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase text-primary"><Sparkles className="h-3.5 w-3.5" /> Mi pequeño refugio</p><h1 className="text-3xl leading-tight sm:text-4xl">¡Hola! Bienvenido/a<br className="hidden sm:block" /> a tu espacio</h1><p className="mt-4 max-w-sm text-sm text-muted-foreground">Hoy no tienes que hacerlo todo.<br />Un paso a la vez también es avanzar.</p><Button asChild variant="soft" className="mt-5"><Link to="/registro"><Smile /> ¿Cómo te sientes hoy?</Link></Button></div>
    </section>
    <div className="grid gap-7 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 space-y-7">
        <div className="grid grid-cols-3 gap-3">
          <Stat icon={ListChecks} label="Actividades hoy" value={`${tasks.filter((t) => t.date === today && t.done).length}/${tasks.filter((t) => t.date === today).length}`} tone="bg-mint" />
          <Stat icon={Smile} label="Último ánimo" value={lastMood?.label ?? "Sin registro"} tone="bg-rose" />
          <Stat icon={Target} label="Metas en curso" value={String(activeGoals.length)} tone="bg-lavender" />
        </div>
        <section><div className="mb-4 flex items-center justify-between gap-3"><h2 className="text-xl">{selected === today ? "Tu agenda de hoy" : `Agenda · ${selected ? fmtDate(selected) : "Hoy"}`}</h2><Link to="/actividades" className="flex items-center gap-1 text-xs font-bold text-primary">Ver todas <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>
          <ul className="space-y-2">{dayTasks.map((t) => <li key={t.id} className="flex items-center gap-3 rounded-lg border bg-card p-4"><Button variant="task" size="icon" className={`h-6 w-6 shrink-0 ${t.done ? "bg-primary text-primary-foreground" : ""}`} aria-label={t.done ? `Marcar pendiente ${t.title}` : `Completar ${t.title}`} onClick={() => setTasks(tasks.map((x) => x.id === t.id ? { ...x, done: !x.done } : x))}>{t.done && <Check />}</Button><div className="min-w-0 flex-1"><p className={`text-sm font-bold ${t.done ? "line-through opacity-60" : ""}`}>{t.title}</p><p className="text-xs text-muted-foreground">{fmtDate(t.date)}</p></div><span className="rounded-md bg-mint px-2 py-1 text-[10px] font-bold">{t.category}</span></li>)}</ul>
          {dayTasks.length === 0 && <div className="flex items-center gap-3 border-y py-6 text-sm text-muted-foreground"><Flower2 className="h-6 w-6 text-primary/60" /><p>Un día con espacio para ti. No hay actividades programadas.</p></div>}
        </section>
        <section><div className="mb-4 flex items-center justify-between"><h2 className="text-xl">Objetivos en progreso</h2><Link to="/objetivos" className="text-xs font-bold text-primary">Ver todos ↗</Link></div><div className="grid gap-3 sm:grid-cols-2">{activeGoals.slice(0, 2).map((g) => {
          const pct = g.subtasks.length ? Math.round(g.subtasks.filter((s) => s.done).length / g.subtasks.length * 100) : 0;
          return <Link key={g.id} to="/objetivos" className="rounded-lg border bg-card p-4"><Target className="mb-3 h-5 w-5 text-primary" /><h3 className="text-base">{g.title}</h3><div className="mb-2 mt-3 flex justify-between text-xs text-muted-foreground"><span>Paso a paso</span><strong>{pct}%</strong></div><progress value={pct} max={100} aria-label={`Progreso de ${g.title}`} className="h-1.5 w-full overflow-hidden rounded-full accent-primary" /></Link>;
        })}</div>{activeGoals.length === 0 && <p className="text-sm text-muted-foreground">Cada nuevo comienzo puede ser una meta.</p>}</section>
        <section><h2 className="mb-4 text-xl">Accesos rápidos</h2><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{quick.map((q) => <Link key={q.to} to={q.to} className="group flex min-h-28 flex-col items-start gap-3 rounded-lg border bg-card p-4 transition-transform hover:-translate-y-1"><span className={`grid h-9 w-9 place-items-center rounded-lg ${q.tone}`}><q.icon className="h-4 w-4" /></span><span className="text-xs font-bold">{q.label}</span></Link>)}</div></section>
      </div>
      <aside className="space-y-6 border-t pt-6 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
        <section><h2 className="mb-3 flex items-center gap-2 text-lg"><CalendarDays className="h-4 w-4 text-primary" /> Mi calendario</h2><MiniCalendar dates={tasks.map((t) => t.date)} selected={selected} onSelect={setSelected} /></section>
        <section className="border-t pt-5"><h2 className="mb-3 text-lg">Próximas actividades</h2><ul className="space-y-4">{pending.slice(0, 3).map((t) => <li key={t.id} className="flex gap-3"><span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-mint-deep" /><div><Link to="/actividades" className="text-xs font-bold">{t.title}</Link><p className="text-[11px] text-muted-foreground">{fmtDate(t.date)} · {t.category}</p></div></li>)}</ul>{pending.length === 0 && <p className="text-xs text-muted-foreground">Todo está al día.</p>}</section>
        <section className="border-t pt-5"><h2 className="mb-3 text-lg">Tu último registro</h2>{lastMood ? <div className="flex gap-3"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-rose text-2xl">{lastMood.emoji}</span><div><p className="text-sm font-bold">{lastMood.label}</p><p className="text-xs text-muted-foreground">{moods[0]?.note}</p></div></div> : <Link to="/registro" className="text-sm text-primary">Registrar mi emoción</Link>}</section>
        <section className="border-t pt-5"><p className="flex items-center gap-2 text-xs font-bold text-primary"><Sparkles className="h-4 w-4" /> Frase del día</p><p className="mt-3 font-display text-xl leading-relaxed">“{quote}”</p><Flower2 className="ml-auto mt-3 h-6 w-6 text-rose-deep" /></section>
      </aside>
    </div>
  </div>;
}
function Stat({ icon: Icon, tone, label, value }: { icon: typeof Smile; tone: string; label: string; value: string }) {
  return <div className="min-w-0 border-b pb-4"><span className={`mb-3 grid h-9 w-9 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></span><p className="text-[11px] text-muted-foreground">{label}</p><p className="mt-1 font-display text-lg font-medium sm:text-2xl">{value}</p></div>;
}
