import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const localDay = (date: Date) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

export function MiniCalendar({ dates = [], selected, onSelect }: { dates?: string[]; selected?: string; onSelect?: (day: string) => void }) {
  const [month, setMonth] = useState(new Date(2026, 9, 1));
  const [today, setToday] = useState("");
  useEffect(() => { const d = new Date(); setMonth(new Date(d.getFullYear(), d.getMonth(), 1)); setToday(localDay(d)); }, []);
  const offset = (month.getDay() + 6) % 7;
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return <div className="min-w-0">
    <div className="mb-4 flex items-center justify-between gap-2">
      <h3 className="capitalize text-base">{month.toLocaleDateString("es-MX", { month: "long", year: "numeric" })}</h3>
      <div className="flex gap-1">
        <Button variant="ghost" size="icon" aria-label="Mes anterior" title="Mes anterior" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}><ChevronLeft /></Button>
        <Button variant="ghost" size="icon" aria-label="Mes siguiente" title="Mes siguiente" onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}><ChevronRight /></Button>
      </div>
    </div>
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {["L", "M", "X", "J", "V", "S", "D"].map((d) => <span key={d} className="pb-2 font-bold text-muted-foreground">{d}</span>)}
      {Array.from({ length: offset }, (_, i) => <span key={`empty-${i}`} />)}
      {Array.from({ length: days }, (_, i) => {
        const day = localDay(new Date(month.getFullYear(), month.getMonth(), i + 1));
        return <Button key={day} variant="ghost" aria-label={day} aria-pressed={selected === day} onClick={() => onSelect?.(day)} className={`calendar-day relative h-9 min-w-0 p-0 text-xs ${selected === day ? "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground" : day === today ? "bg-lavender font-bold" : ""}`}>
          {i + 1}{dates.includes(day) && <span className="absolute bottom-1 h-1 w-1 rounded-full bg-rose-deep" />}
        </Button>;
      })}
    </div>
  </div>;
}