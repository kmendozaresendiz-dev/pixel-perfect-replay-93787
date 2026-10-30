import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Heart } from "lucide-react";
import { PageHeader } from "@/components/AppShell";
import { usePersisted } from "@/lib/store";

export const Route = createFileRoute("/tiempo")({
  head: () => ({
    meta: [
      { title: "Tiempo para mí · MindfulBox" },
      { name: "description", content: "Ideas de pasatiempos, creatividad, descanso y actividades al aire libre." },
      { property: "og:title", content: "Tiempo para mí · MindfulBox" },
      { property: "og:description", content: "Descubre actividades para dedicarte tiempo." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Tiempo,
});

const IDEAS = [
  { id: "i1", cat: "Pasatiempos", emoji: "🧶", title: "Tejer algo pequeño", desc: "Un llavero o una bufanda mini.", time: "30 min" },
  { id: "i2", cat: "Pasatiempos", emoji: "📚", title: "Leer un capítulo", desc: "Con té y luz cálida.", time: "20 min" },
  { id: "i3", cat: "Creatividad", emoji: "🎨", title: "Pintar con acuarela", desc: "Flores, nubes o lo que sientas.", time: "45 min" },
  { id: "i4", cat: "Creatividad", emoji: "✂️", title: "Hacer scrapbook", desc: "Recorta fotos y recuerdos.", time: "1 h" },
  { id: "i5", cat: "Descanso", emoji: "🛁", title: "Baño relajante", desc: "Velas y música suave.", time: "40 min" },
  { id: "i6", cat: "Descanso", emoji: "🧘‍♀️", title: "Meditación guiada", desc: "Respira y suelta.", time: "10 min" },
  { id: "i7", cat: "Aire libre", emoji: "🌳", title: "Paseo por el parque", desc: "Observa los colores a tu alrededor.", time: "30 min" },
  { id: "i8", cat: "Aire libre", emoji: "🧺", title: "Picnic sencillo", desc: "Fruta, manta y un buen libro.", time: "1 h" },
];
const CATS = [
  { name: "Todas", tone: "bg-card" },
  { name: "Pasatiempos", tone: "bg-cream" },
  { name: "Creatividad", tone: "bg-rose" },
  { name: "Descanso", tone: "bg-baby" },
  { name: "Aire libre", tone: "bg-mint" },
];
const toneOf = (c: string) => CATS.find((x) => x.name === c)?.tone ?? "bg-card";

function Tiempo() {
  const [favs, setFavs] = usePersisted<string[]>("favs", ["i3", "i6"]);
  const [cat, setCat] = useState("Todas");
  const toggle = (id: string) => setFavs(favs.includes(id) ? favs.filter((f) => f !== id) : [...favs, id]);
  const list = IDEAS.filter((i) => cat === "Todas" || i.cat === cat);

  const Card = ({ i }: { i: (typeof IDEAS)[number] }) => (
    <article className={`card-soft relative p-5 ${toneOf(i.cat)}`}>
      <button onClick={() => toggle(i.id)} aria-pressed={favs.includes(i.id)} aria-label={favs.includes(i.id) ? `Quitar ${i.title} de favoritos` : `Agregar ${i.title} a favoritos`}
        className="absolute right-3 top-3 rounded-full bg-card p-2 shadow-soft">
        <Heart className={`h-4 w-4 ${favs.includes(i.id) ? "fill-rose-deep text-rose-deep" : ""}`} />
      </button>
      <span className="text-4xl" aria-hidden>{i.emoji}</span>
      <h3 className="mt-3 text-lg">{i.title}</h3>
      <p className="text-muted-foreground">{i.desc}</p>
      <div className="mt-3 flex gap-2 text-xs font-bold">
        <span className="rounded-full bg-card px-2 py-0.5">{i.cat}</span>
        <span className="rounded-full bg-card px-2 py-0.5">⏱ {i.time}</span>
      </div>
    </article>
  );

  return (
    <div>
      <PageHeader title="Tiempo para mí" subtitle="Ideas bonitas para dedicarte un ratito." deco="🌷" />
      <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Categorías">
        {CATS.map((c) => (
          <button key={c.name} onClick={() => setCat(c.name)} aria-pressed={cat === c.name}
            className={`rounded-full px-4 py-1.5 text-sm font-bold shadow-soft ${c.tone} ${cat === c.name ? "ring-2 ring-primary" : ""}`}>{c.name}</button>
        ))}
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{list.map((i) => <Card key={i.id} i={i} />)}</div>

      <h2 className="mb-3 mt-10 text-xl">Mis favoritos 💗</h2>
      {favs.length === 0 ? (
        <p className="card-soft p-5 text-muted-foreground">Toca el corazón en una idea para guardarla aquí.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{IDEAS.filter((i) => favs.includes(i.id)).map((i) => <Card key={i.id} i={i} />)}</div>
      )}
    </div>
  );
}
