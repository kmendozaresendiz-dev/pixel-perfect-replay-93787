import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  Home, Smile, BookHeart, ListChecks, Flower2, Target, BarChart3, User, Settings, Menu, X, Heart,
} from "lucide-react";

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
  return (
    <div className="flex items-center gap-2">
      <div className="grid h-10 w-10 place-items-center rounded-2xl bg-rose shadow-soft">
        <Heart className="h-5 w-5 fill-rose-deep text-rose-deep" aria-hidden />
      </div>
      <div className="leading-tight">
        <p className="font-display text-lg font-semibold">MindfulBox</p>
        <p className="text-xs text-muted-foreground">A little space for yourself</p>
      </div>
    </div>
  );
}

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav aria-label="Navegación principal">
      <ul className="space-y-1">
        {NAV.map((n) => {
          const active = path === n.to;
          return (
            <li key={n.to}>
              <Link
                to={n.to}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 font-semibold transition-colors ${
                  active ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:bg-card/70"
                }`}
              >
                <span className={`grid h-8 w-8 place-items-center rounded-xl ${n.tone}`}>
                  <n.icon className="h-4 w-4" aria-hidden />
                </span>
                {n.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex min-h-screen w-full">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 border-r bg-secondary/40 p-5 backdrop-blur lg:flex">
        <Brand />
        <div className="flex-1 overflow-y-auto"><NavList /></div>
        <div className="rounded-3xl bg-cream p-4 text-sm">
          <p className="font-display font-semibold">✿ Recuerda</p>
          <p className="text-muted-foreground">Respira hondo. Vas a tu ritmo.</p>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b bg-background/85 px-4 py-3 backdrop-blur lg:hidden">
          <Brand />
          <button className="btn-soft !p-2.5" aria-label="Abrir menú" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
        </header>

        {open && (
          <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menú">
            <div className="absolute inset-0 bg-foreground/30" onClick={() => setOpen(false)} />
            <div className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col gap-6 overflow-y-auto bg-background p-5 shadow-pop">
              <div className="flex items-center justify-between">
                <Brand />
                <button className="btn-soft !p-2" aria-label="Cerrar menú" onClick={() => setOpen(false)}>
                  <X className="h-4 w-4" />
                </button>
              </div>
              <NavList onNavigate={() => setOpen(false)} />
            </div>
          </div>
        )}

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-10 lg:py-10 lg:pb-10">
          {children}
        </main>

        <nav aria-label="Accesos rápidos" className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t bg-card/95 backdrop-blur lg:hidden">
          {NAV.slice(0, 4).concat(NAV[5]).map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: true }}
              className="flex flex-col items-center gap-0.5 py-2 text-[11px] font-semibold text-muted-foreground data-[status=active]:text-primary">
              <n.icon className="h-5 w-5" aria-hidden />
              <span className="truncate">{n.label.replace(/^Mis? /, "")}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

export function PageHeader({ title, subtitle, deco = "✿" }: { title: string; subtitle: string; deco?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl sm:text-4xl">{title} <span className="text-rose-deep" aria-hidden>{deco}</span></h1>
      <p className="mt-1 text-muted-foreground">{subtitle}</p>
    </div>
  );
}
