import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Pencil, Search, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { usePersisted, demoEntries, uid, fmtDate, type Entry } from "@/lib/store";

export const Route = createFileRoute("/diario")({
  head: () => ({
    meta: [
      { title: "Mi diario · MindfulBox" },
      { name: "description", content: "Escribe tus experiencias personales y guarda tus entradas del diario." },
      { property: "og:title", content: "Mi diario · MindfulBox" },
      { property: "og:description", content: "Tu diario digital, bonito y privado." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Diario,
});

const TONES = ["bg-peach/40", "bg-card"];

function Diario() {
  const [entries, setEntries] = usePersisted<Entry[]>("entries", demoEntries);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editing, setEditing] = useState<string | null>(null);
  const [q, setQ] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    if (editing) setEntries(entries.map((x) => (x.id === editing ? { ...x, title, body } : x)));
    else setEntries([{ id: uid(), title, body, date: new Date().toISOString().slice(0, 10) }, ...entries]);
    setTitle(""); setBody(""); setEditing(null);
  };
  const filtered = entries.filter((e) => (e.title + e.body).toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <PageHeader title="Mi diario" subtitle="Escribe lo que sientes, lo que viviste y lo que sueñas." deco="🎀" />
      <form onSubmit={submit} className="space-y-3 border-l-4 border-peach bg-peach/20 p-5 sm:p-6">
        <label htmlFor="t" className="sr-only">Título</label>
        <input id="t" value={title} onChange={(e) => setTitle(e.target.value)} className="input-soft !bg-card font-display text-lg" placeholder="Título de tu entrada" />
        <label htmlFor="b" className="sr-only">Contenido</label>
        <textarea id="b" rows={5} value={body} onChange={(e) => setBody(e.target.value)} className="input-soft notebook !bg-card" placeholder="Querido diario..." />
        <div className="flex flex-wrap gap-2">
          <Button variant="ghost" className="btn-primary">{editing ? "Guardar cambios" : "Guardar entrada"} ✍️</Button>
          {editing && <Button variant="ghost" type="button" className="btn-soft" onClick={() => { setEditing(null); setTitle(""); setBody(""); }}>Cancelar</Button>}
        </div>
      </form>

      <div className="mb-4 mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl">Entradas guardadas ({filtered.length})</h2>
        <div className="relative sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
          <label htmlFor="q" className="sr-only">Buscar entradas</label>
          <input id="q" value={q} onChange={(e) => setQ(e.target.value)} className="input-soft !pl-9" placeholder="Buscar..." />
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((e, i) => (
          <article key={e.id} className={`card-soft flex flex-col p-5 ${TONES[i % TONES.length]}`}>
            <p className="text-xs font-bold text-muted-foreground">{fmtDate(e.date)}</p>
            <h3 className="mt-1 text-lg">{e.title}</h3>
            <p className="mt-2 flex-1 text-muted-foreground">{e.body}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="btn-soft !bg-card !px-3 !py-1.5 text-sm" onClick={() => { setEditing(e.id); setTitle(e.title); setBody(e.body); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                <Pencil className="h-3.5 w-3.5" /> Editar
              </Button>
              <Button variant="ghost" className="btn-soft !bg-card !px-3 !py-1.5 text-sm" onClick={() => setEntries(entries.filter((x) => x.id !== e.id))}>
                <Trash2 className="h-3.5 w-3.5" /> Eliminar
              </Button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="text-muted-foreground">No hay entradas que coincidan.</p>}
      </div>
    </div>
  );
}
