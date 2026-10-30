import { useEffect, useState } from "react";

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("mb:" + key);
      if (raw) setValue(JSON.parse(raw));
    } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (loaded) localStorage.setItem("mb:" + key, JSON.stringify(value));
  }, [key, value, loaded]);
  return [value, setValue] as const;
}

export const uid = () => Math.random().toString(36).slice(2, 9);

export type Mood = { id: string; emoji: string; label: string; tone: string };
export const MOODS: Mood[] = [
  { id: "feliz", emoji: "😊", label: "Feliz", tone: "bg-cream" },
  { id: "tranquila", emoji: "😌", label: "Tranquila", tone: "bg-mint" },
  { id: "emocionada", emoji: "🤩", label: "Emocionada", tone: "bg-rose" },
  { id: "cansada", emoji: "😴", label: "Cansada", tone: "bg-baby" },
  { id: "triste", emoji: "😢", label: "Triste", tone: "bg-lavender" },
  { id: "ansiosa", emoji: "😰", label: "Ansiosa", tone: "bg-peach" },
];

export type MoodEntry = { id: string; mood: string; note: string; date: string };
export const demoMoods: MoodEntry[] = [
  { id: "m1", mood: "feliz", note: "Tomé café con mi mejor amiga ☕", date: "2026-10-30" },
  { id: "m2", mood: "tranquila", note: "Leí un capítulo antes de dormir.", date: "2026-10-29" },
  { id: "m3", mood: "cansada", note: "Mucho trabajo, pero lo logré.", date: "2026-10-28" },
  { id: "m4", mood: "emocionada", note: "¡Empecé mi curso de acuarela!", date: "2026-10-27" },
];

export type Entry = { id: string; title: string; body: string; date: string };
export const demoEntries: Entry[] = [
  { id: "e1", title: "Un día de lluvia bonito", body: "Hoy llovió toda la tarde y me quedé en casa con una manta, té de manzanilla y mi playlist favorita. Me sentí en paz.", date: "2026-10-30" },
  { id: "e2", title: "Pequeños logros", body: "Terminé el proyecto que me preocupaba. Quiero recordar que puedo con más de lo que creo.", date: "2026-10-27" },
  { id: "e3", title: "Paseo en el parque", body: "Caminé 40 minutos y vi muchas hojas de otoño. Tomé fotos para mi scrapbook.", date: "2026-10-24" },
];

export const CATEGORIES = ["Personal", "Estudio", "Trabajo", "Salud", "Hogar"] as const;
export type Task = { id: string; title: string; date: string; category: string; done: boolean };
export const demoTasks: Task[] = [
  { id: "t1", title: "Regar mis plantitas", date: "2026-10-30", category: "Hogar", done: false },
  { id: "t2", title: "Yoga 20 minutos", date: "2026-10-30", category: "Salud", done: true },
  { id: "t3", title: "Repasar apuntes de diseño", date: "2026-10-31", category: "Estudio", done: false },
  { id: "t4", title: "Enviar reporte semanal", date: "2026-11-01", category: "Trabajo", done: false },
  { id: "t5", title: "Llamar a mamá", date: "2026-10-30", category: "Personal", done: false },
  { id: "t6", title: "Organizar escritorio", date: "2026-10-29", category: "Hogar", done: true },
];

export type Goal = { id: string; title: string; deadline: string; subtasks: { id: string; title: string; done: boolean }[] };
export const demoGoals: Goal[] = [
  { id: "g1", title: "Leer 12 libros este año", deadline: "2026-12-31", subtasks: [
    { id: "s1", title: "Elegir lista de libros", done: true },
    { id: "s2", title: "Leer 20 páginas diarias", done: true },
    { id: "s3", title: "Terminar libro #10", done: false },
  ] },
  { id: "g2", title: "Aprender acuarela", deadline: "2027-02-15", subtasks: [
    { id: "s4", title: "Comprar materiales", done: true },
    { id: "s5", title: "Completar 5 lecciones", done: false },
    { id: "s6", title: "Pintar un paisaje", done: false },
  ] },
  { id: "g3", title: "Dormir 8 horas", deadline: "2026-11-30", subtasks: [
    { id: "s7", title: "Sin pantallas tras las 22:00", done: false },
    { id: "s8", title: "Rutina de noche", done: true },
  ] },
];

export const fmtDate = (d: string) =>
  new Date(d + "T12:00:00").toLocaleDateString("es-MX", { day: "numeric", month: "short" });
