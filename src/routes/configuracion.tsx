import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/AppShell";
import { usePersisted } from "@/lib/store";

export const Route = createFileRoute("/configuracion")({
  head: () => ({
    meta: [
      { title: "Configuración · MindfulBox" },
      { name: "description", content: "Preferencias de visualización, notificaciones y privacidad." },
      { property: "og:title", content: "Configuración · MindfulBox" },
      { property: "og:description", content: "Ajusta MindfulBox a tu gusto." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Config,
});

type Settings = Record<string, boolean | string>;
const DEFAULTS: Settings = {
  size: "Normal", startDay: "Lunes", animations: true, emoji: true,
  dailyReminder: true, reminderTime: "20:00", goalAlerts: true, weeklySummary: false,
  lockDiary: false, privateProfile: true, analytics: false,
};

function Toggle({ id, label, desc, checked, onChange }: { id: string; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <div><label htmlFor={id} className="font-bold">{label}</label><p className="text-sm text-muted-foreground">{desc}</p></div>
      <button id={id} role="switch" aria-checked={checked} onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${checked ? "bg-primary" : "bg-border"}`}>
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-card shadow-soft transition-all ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

function Config() {
  const [s, setS] = usePersisted<Settings>("settings", DEFAULTS);
  const set = (k: string, v: boolean | string) => setS({ ...s, [k]: v });
  const sect = "card-soft divide-y p-5";

  return (
    <div>
      <PageHeader title="Configuración" subtitle="Haz que este espacio se sienta tuyo." deco="⚙︎" />
      <div className="grid gap-6 lg:grid-cols-2">
        <section className={sect}>
          <h2 className="pb-2 text-xl">🎨 Visualización</h2>
          <div className="flex items-center justify-between gap-4 py-3">
            <label htmlFor="size" className="font-bold">Tamaño de texto</label>
            <select id="size" className="input-soft !w-36" value={s.size as string} onChange={(e) => set("size", e.target.value)}>
              <option>Pequeño</option><option>Normal</option><option>Grande</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-4 py-3">
            <label htmlFor="sd" className="font-bold">Inicio de semana</label>
            <select id="sd" className="input-soft !w-36" value={s.startDay as string} onChange={(e) => set("startDay", e.target.value)}>
              <option>Lunes</option><option>Domingo</option>
            </select>
          </div>
          <Toggle id="anim" label="Animaciones suaves" desc="Pequeños movimientos en la interfaz." checked={!!s.animations} onChange={(v) => set("animations", v)} />
          <Toggle id="emo" label="Decoraciones" desc="Mostrar flores, estrellas y corazones." checked={!!s.emoji} onChange={(v) => set("emoji", v)} />
        </section>

        <section className={sect}>
          <h2 className="pb-2 text-xl">🔔 Notificaciones</h2>
          <Toggle id="dr" label="Recordatorio diario" desc="Te avisamos para registrar tu día." checked={!!s.dailyReminder} onChange={(v) => set("dailyReminder", v)} />
          <div className="flex items-center justify-between gap-4 py-3">
            <label htmlFor="rt" className="font-bold">Hora del recordatorio</label>
            <input id="rt" type="time" className="input-soft !w-36" value={s.reminderTime as string} onChange={(e) => set("reminderTime", e.target.value)} />
          </div>
          <Toggle id="ga" label="Alertas de metas" desc="Aviso cuando se acerca una fecha límite." checked={!!s.goalAlerts} onChange={(v) => set("goalAlerts", v)} />
          <Toggle id="ws" label="Resumen semanal" desc="Recibe tu progreso cada domingo." checked={!!s.weeklySummary} onChange={(v) => set("weeklySummary", v)} />
        </section>

        <section className={`${sect} lg:col-span-2`}>
          <h2 className="pb-2 text-xl">🔒 Privacidad</h2>
          <Toggle id="ld" label="Bloquear diario" desc="Pedir código para abrir tu diario." checked={!!s.lockDiary} onChange={(v) => set("lockDiary", v)} />
          <Toggle id="pp" label="Perfil privado" desc="Solo tú puedes ver tu información." checked={!!s.privateProfile} onChange={(v) => set("privateProfile", v)} />
          <Toggle id="an" label="Compartir datos de uso" desc="Ayúdanos a mejorar de forma anónima." checked={!!s.analytics} onChange={(v) => set("analytics", v)} />
          <div className="flex flex-wrap gap-2 pt-4">
            <button className="btn-soft" onClick={() => setS(DEFAULTS)}>Restablecer preferencias</button>
            <button className="btn-soft !bg-destructive/10 !text-destructive" onClick={() => { Object.keys(localStorage).filter((k) => k.startsWith("mb:")).forEach((k) => localStorage.removeItem(k)); location.reload(); }}>Borrar mis datos</button>
          </div>
        </section>
      </div>
    </div>
  );
}
