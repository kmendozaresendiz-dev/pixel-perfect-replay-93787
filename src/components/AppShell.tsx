import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { Home, Smile, BookHeart, ListChecks, Flower2, Target, BarChart3, User, Settings, Menu, X, Heart, Bell, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePersisted, demoTasks, type Task } from "@/lib/store";

export const NAV = [
  { to: "/", label: "Mi espacio", icon: Home, tone: "bg-lavender" },
  { to: "/registro", label: "Mi registro", icon: Smile, tone: "bg-rose" },
  { to: "/diario", label: "Mi diario", icon: BookHeart, tone: "bg-peach" },
  { to: "/actividades", label: "Mis actividades", icon: ListChecks, tone: "bg-mint" },
  { to: "/tiempo", label: "Tiempo para mí", icon: Flower2, tone: "bg-cream" },
  { to: "/objetivos", label: "Mis objetivos", icon: Target, tone: "bg-baby" },
  { to: "/progreso", label: "Mi progreso", icon: BarChart3, tone: "bg-lavender" },
  { to: "/perfil", label: "Mi perfil", icon: User, tone: "bg-rose" },
  { to: "/configuracion", label: "Configuración", icon: Settings, tone: "bg-mint" },
] as const;

function Brand() {
  return <Link to="/" className="flex items-center gap-3">
    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-card shadow-soft"><Heart className="h-6 w-6 text-primary" /></span>
    <span className="leading-tight"><span className="block font-display text-xl font-semibold">MindfulBox</span><span className="mt-1 block text-[11px] text-muted-foreground">A little space for yourself</span></span>
  </Link>;
}
function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return <nav aria-label="Navegación principal"><ul className="space-y-1.5">{NAV.map((n) => {
    const active = path === n.to;
    return <li key={n.to}><Link to={n.to} onClick={onNavigate} aria-current={active ? "page" : undefined} className={`relative flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-bold transition-colors ${active ? "bg-card text-primary shadow-soft" : "text-muted-foreground hover:bg-card/60"}`}>
      {active && <span className="absolute inset-y-3 left-0 w-1 rounded-full bg-primary" />}
      <n.icon className="h-[18px] w-[18px] shrink-0" />{n.label}{active && <ChevronRight className="ml-auto h-3.5 w-3.5" />}
    </Link></li>;
  })}</ul></nav>;
}
export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(false);
  const [date, setDate] = useState("");
  const path = useRouterState({ select: (s) => s.location.pathname });
  const section = NAV.find((n) => n.to === path);
  const [tasks] = usePersisted<Task[]>("tasks", demoTasks);
  const pending = tasks.filter((t) => !t.done);
  useEffect(() => setDate(new Date().toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })), []);
  useEffect(() => { setOpen(false); setNotifications(false); }, [path]);
  return <div className="flex min-h-screen w-full">
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r bg-secondary/40 px-5 py-8 lg:flex">
      <Brand /><p className="mb-4 mt-10 px-4 text-[11px] font-bold uppercase text-muted-foreground">Tu espacio personal</p>
      <div className="flex-1 overflow-y-auto"><NavList /></div>
      <div className="my-5 border-t pt-5 text-center"><Flower2 className="mx-auto mb-2 h-6 w-6 text-primary/60" /><p className="text-xs text-muted-foreground">Pequeños pasos, grandes cambios.</p></div>
      <Link to="/perfil" className="flex items-center gap-3 rounded-lg bg-card/70 p-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-rose"><User className="h-4 w-4" /></span><span className="flex-1 text-xs"><strong className="block">Mi perfil</strong><span className="text-muted-foreground">Cuenta de demostración</span></span><ChevronRight className="h-4 w-4" /></Link>
    </aside>
    <div className="flex min-w-0 flex-1 flex-col">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-3 px-4 sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" aria-label="Abrir menú" onClick={() => setOpen(true)}><Menu /></Button><div><p className="font-display text-lg font-medium">{section?.label ?? "MindfulBox"}</p><p className="hidden text-xs text-muted-foreground sm:block">Un pequeño espacio para ti</p></div></div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-4"><span className="hidden items-center gap-2 text-xs text-muted-foreground md:flex"><CalendarDays className="h-4 w-4" />{date}</span>
            <div className="relative"><Button variant="ghost" size="icon" aria-label="Notificaciones" aria-expanded={notifications} title="Notificaciones" onClick={() => setNotifications(!notifications)}><Bell /></Button>
              {notifications && <div className="absolute right-0 top-12 w-72 max-w-[85vw] rounded-lg border bg-card p-4 shadow-pop"><h2 className="mb-3 text-base">Notificaciones</h2>{pending.slice(0, 3).map((t) => <Link key={t.id} to="/actividades" className="mb-2 block border-b pb-2 text-sm">{t.title}<span className="block text-xs text-muted-foreground">Actividad pendiente</span></Link>)}{pending.length === 0 && <p className="text-sm text-muted-foreground">No tienes actividades pendientes.</p>}</div>}
            </div>
            <Link to="/perfil" aria-label="Mi perfil" className="grid h-10 w-10 place-items-center rounded-full border border-card bg-rose"><User className="h-4 w-4" /></Link>
          </div>
        </div>
      </header>
      {open && <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú"><div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} /><div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col gap-8 overflow-y-auto bg-background p-5 shadow-pop"><div className="flex items-center justify-between"><Brand /><Button variant="ghost" size="icon" aria-label="Cerrar menú" onClick={() => setOpen(false)}><X /></Button></div><NavList onNavigate={() => setOpen(false)} /></div></div>}
      <main className={`mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-7 lg:px-10 lg:py-8 lg:pb-10 ${path === "/" ? "" : "module-content"}`}>{children}</main>
      <nav aria-label="Accesos rápidos" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">{NAV.slice(0, 4).concat(NAV[5]).map((n) => <Link key={n.to} to={n.to} activeOptions={{ exact: true }} className="flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground data-[status=active]:text-primary"><n.icon className="h-5 w-5" /><span>{n.label.replace(/^Mis? /, "")}</span></Link>)}</nav>
    </div>
  </div>;
}
export function PageHeader({ title, subtitle, deco = "✿" }: { title: string; subtitle: string; deco?: string }) {
  return <div className="mb-7"><div className="flex items-center gap-3"><h1 className="text-3xl sm:text-4xl">{title}</h1><span className="text-xl text-rose-deep" aria-hidden>{deco}</span></div><p className="mt-2 max-w-2xl text-sm text-muted-foreground">{subtitle}</p></div>;
}
