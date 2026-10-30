import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { usePersisted, demoMoods, MOODS, uid, fmtDate, type MoodEntry } from "@/lib/store";

export const Route = createFileRoute("/registro")({
  head: () => ({
    meta: [
      { title: "Mi registro · MindfulBox" },
      { name: "description", content: "Registra cómo te sientes y revisa tu historial de emociones." },
      { property: "og:title", content: "Mi registro · MindfulBox" },
      { property: "og:description", content: "Registra tus emociones día a día." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Registro,
});

function Registro() {
  const [entries, setEntries] = usePersisted<MoodEntry[]>("moods", demoMoods);
  const [mood, setMood] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mood) return;
    setEntries([{ id: uid(), mood, note, date: new Date().toISOString().slice(0, 10) }, ...entries]);
    setMood(null); setNote("");
  };

  return (
    <div>
      <PageHeader title="Mi registro" subtitle="¿Cómo te sientes hoy? Todas las emociones son válidas." deco="♡" />
      <form onSubmit={save} className="card-soft space-y-5 p-5 sm:p-6">
        <fieldset>
          <legend className="mb-3 font-display text-lg font-semibold">Elige tu emoción</legend>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {MOODS.map((m) => (
              <button type="button" key={m.id} onClick={() => setMood(m.id)} aria-pressed={mood === m.id}
                className={`flex flex-col items-center gap-1 rounded-2xl border-2 p-3 font-bold transition ${m.tone} ${mood === m.id ? "border-primary shadow-pop" : "border-transparent"}`}>
                <span className="text-3xl" aria-hidden>{m.emoji}</span>
                <span className="text-sm">{m.label}</span>
              </button>
            ))}
          </div>
        </fieldset>
        <div>
          <label htmlFor="note" className="mb-2 block font-bold">Notas personales</label>
          <textarea id="note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} className="input-soft" placeholder="¿Qué pasó hoy? ¿Qué te hizo sentir así?" />
        </div>
        <button type="submit" disabled={!mood} className="btn-primary disabled:opacity-50">Guardar registro ✨</button>
      </form>

      <h2 className="mb-3 mt-8 text-xl">Historial</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {entries.map((e) => {
          const m = MOODS.find((x) => x.id === e.mood)!;
          return (
            <li key={e.id} className={`card-soft flex items-start gap-3 p-4 ${m?.tone}`}>
              <span className="text-3xl" aria-hidden>{m?.emoji}</span>
              <div className="min-w-0 flex-1">
                <p className="font-bold">{m?.label} <span className="font-semibold text-muted-foreground">· {fmtDate(e.date)}</span></p>
                {e.note && <p className="text-muted-foreground">{e.note}</p>}
              </div>
              <button aria-label="Eliminar registro" onClick={() => setEntries(entries.filter((x) => x.id !== e.id))} className="rounded-full p-2 hover:bg-card">
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
