import { Button } from "@/components/ui/button";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/AppShell";
import { usePersisted } from "@/lib/store";

export const Route = createFileRoute("/perfil")({
  head: () => ({
    meta: [
      { title: "Mi perfil · MindfulBox" },
      { name: "description", content: "Tu avatar e información básica en MindfulBox." },
      { property: "og:title", content: "Mi perfil · MindfulBox" },
      { property: "og:description", content: "Personaliza tu perfil." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Perfil,
});

const AVATARS = ["🐰", "🐱", "🐻", "🦊", "🐼", "🦄", "🐥", "🌸"];
type Profile = { name: string; email: string; birthday: string; bio: string; avatar: string };

function Perfil() {
  const [profile, setProfile] = usePersisted<Profile>("profile-demo", {
    name: "Usuario de demostración", email: "demo@example.com", birthday: "", bio: "Amo la papelería bonita, el té y los atardeceres. 🌅", avatar: "🐰",
  });
  const [form, setForm] = useState<Profile | null>(null);
  const f = form ?? profile;
  const set = (k: keyof Profile, v: string) => setForm({ ...f, [k]: v });
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <PageHeader title="Mi perfil" subtitle="Así te ves en tu pequeño espacio." deco="🎀" />
      <div className="grid gap-6 lg:grid-cols-3">
        <section className="card-soft flex flex-col items-center bg-rose p-6 text-center">
          <div className="grid h-28 w-28 place-items-center rounded-full bg-card text-6xl shadow-pop" aria-hidden>{f.avatar}</div>
          <h2 className="mt-4 text-2xl">{f.name}</h2>
          <p className="text-muted-foreground">{f.email}</p>
          <p className="mt-3">{f.bio}</p>
          <div className="mt-5 grid w-full grid-cols-3 gap-2 text-sm">
            {[["42", "Registros"], ["17", "Entradas"], ["3", "Metas"]].map(([v, l]) => (
              <div key={l} className="border-t p-2"><p className="font-display text-xl font-semibold">{v}</p><p className="text-muted-foreground">{l}</p></div>
            ))}
          </div>
        </section>

        <form className="card-soft space-y-4 p-6 lg:col-span-2" onSubmit={(e) => { e.preventDefault(); setProfile(f); setForm(null); setSaved(true); setTimeout(() => setSaved(false), 2000); }}>
          <fieldset>
            <legend className="mb-2 font-bold">Elige tu avatar</legend>
            <div className="flex flex-wrap gap-2">
              {AVATARS.map((a) => (
                <Button variant="ghost" type="button" key={a} onClick={() => set("avatar", a)} aria-label={`Avatar ${a}`} aria-pressed={f.avatar === a}
                  className={`grid h-12 w-12 place-items-center rounded-2xl bg-lavender text-2xl ${f.avatar === a ? "ring-2 ring-primary" : ""}`}>{a}</Button>
              ))}
            </div>
          </fieldset>
          <div className="grid gap-4 sm:grid-cols-2">
            <div><label htmlFor="pn" className="mb-1 block text-sm font-bold">Nombre</label><input id="pn" className="input-soft" value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div><label htmlFor="pe" className="mb-1 block text-sm font-bold">Correo</label><input id="pe" type="email" className="input-soft" value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div><label htmlFor="pb" className="mb-1 block text-sm font-bold">Cumpleaños</label><input id="pb" type="date" className="input-soft" value={f.birthday} onChange={(e) => set("birthday", e.target.value)} /></div>
          </div>
          <div><label htmlFor="pbio" className="mb-1 block text-sm font-bold">Sobre mí</label><textarea id="pbio" rows={3} className="input-soft" value={f.bio} onChange={(e) => set("bio", e.target.value)} /></div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="btn-primary">Guardar perfil</Button>
            {saved && <span role="status" className="font-bold text-mint-deep">¡Guardado! 💗</span>}
          </div>
        </form>
      </div>
    </div>
  );
}
