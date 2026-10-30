import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Smile, BookHeart, ListChecks, Flower2, Sparkles, Check } from "lucide-react";
import { usePersisted, demoTasks, demoMoods, MOODS, type Task, type MoodEntry } from "@/lib/store";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Mi espacio · MindfulBox" },
      { name: "description", content: "Tu resumen diario: actividades, emociones y frase del día en MindfulBox." },
      { property: "og:title", content: "Mi espacio · MindfulBox" },
      { property: "og:description", content: "Tu pequeño espacio para organizarte y cuidarte." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const QUOTES = [
  "Florecer también lleva su tiempo. 🌷",
  "Hoy elige ser amable contigo. 💗",
  "Los pequeños pasos también cuentan. ⭐",
  "Tu calma es tu superpoder. ☁️",
];

function Index() {
  const [tasks, setTasks] = usePersisted<Task[]>("tasks", demoTasks);
  const [moods] = usePersisted<MoodEntry[]>("moods", demoMoods);
  const [today, setToday] = useState("");
  const [quote, setQuote] = useState(QUOTES[0]);
  useEffect(() => {
    const d = new Date();
    setToday(d.toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" }));
    setQuote(QUOTES[d.getDate() % QUOTES.length]);
  }, []);
  const pending = tasks.filter((t) => !t.done);
  const doneCount = tasks.length - pending.length;
  const lastMood = MOODS.find((m) => m.id === moods[0]?.mood);

  const quick = [
    { to: "/registro", label: "Registrar emoción", icon: Smile, tone: "bg-rose" },
    { to: "/diario", label: "Escribir en diario", icon: BookHeart, tone: "bg-peach" },
    { to: "/actividades", label: "Nueva actividad", icon: ListChecks, tone: "bg-mint" },
    { to: "/tiempo", label: "Ideas para mí", icon: Flower2, tone: "bg-cream" },
  ] as const;

  return (
    <div className="space-y-6">
      <section className="card-soft relative overflow-hidden bg-lavender p-6 sm:p-8">
        <span className="absolute right-6 top-4 text-3xl" aria-hidden>☁️</span>
        <span className="absolute bottom-3 right-20 text-xl" aria-hidden>⭐</span>
        <p className="text-sm font-bold capitalize text-muted-foreground">{today}</p>
        <h1 className="mt-1 text-3xl sm:text-4xl">¡Hola, Keyri! 🎀</h1>
        <p className="mt-2 max-w-lg text-muted-foreground">Qué alegría verte. Este es tu pequeño espacio para ti hoy.</p>
      </section>

      <div className="grid gap-4 sm:grid-cols-3">
        <Stat tone="bg-mint" label="Completadas hoy" value={`${doneCount}/${tasks.length}`} />
        <Stat tone="bg-rose" label="Último ánimo" value={lastMood ? `${lastMood.emoji} ${lastMood.label}` : "—"} />
        <Stat tone="bg-cream" label="Racha de registro" value="5 días 🔥" />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <section className="card-soft p-5 lg:col-span-3">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl">Pendientes ♡</h2>
            <Link to="/actividades" className="text-sm font-bold text-primary">Ver todo</Link>
          </div>
          {pending.length === 0 && <p className="text-muted-foreground">¡Todo listo por hoy! 🌸</p>}
          <ul className="space-y-2">
            {pending.slice(0, 5).map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-muted p-3">
                <button
                  aria-label={`Completar ${t.title}`}
                  onClick={() => setTasks(tasks.map((x) => (x.id === t.id ? { ...x, done: true } : x)))}
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-ring hover:bg-mint"
                >
                  <Check className="h-3 w-3 opacity-0 hover:opacity-100" />
                </button>
                <span className="flex-1 font-semibold">{t.title}</span>
                <span className="rounded-full bg-card px-2 py-0.5 text-xs font-bold">{t.category}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="card-soft flex flex-col justify-between bg-rose p-6 lg:col-span-2">
          <div>
            <p className="flex items-center gap-1 text-sm font-bold text-muted-foreground"><Sparkles className="h-4 w-4" /> Frase del día</p>
            <p className="mt-3 font-display text-2xl leading-snug">“{quote}”</p>
          </div>
          <p className="mt-6 text-right text-2xl" aria-hidden>🌷💗✨</p>
        </section>
      </div>

      <section>
        <h2 className="mb-3 text-xl">Accesos rápidos</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {quick.map((q) => (
            <Link key={q.to} to={q.to} className={`card-soft flex flex-col items-start gap-3 p-4 transition-transform hover:-translate-y-0.5 ${q.tone}`}>
              <span className="grid h-10 w-10 place-items-center rounded-2xl bg-card"><q.icon className="h-5 w-5" aria-hidden /></span>
              <span className="font-bold">{q.label}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ tone, label, value }: { tone: string; label: string; value: string }) {
  return (
    <div className={`card-soft p-5 ${tone}`}>
      <p className="text-sm font-bold text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl font-semibold">{value}</p>
    </div>
  );
}
