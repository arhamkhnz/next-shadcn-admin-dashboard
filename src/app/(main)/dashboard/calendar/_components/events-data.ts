import { setDate, setHours, setMinutes, startOfMonth } from "date-fns";

const monthStart = startOfMonth(new Date());
const currentYear = new Date().getFullYear();
const d = (day: number) => setDate(monthStart, day);
const dt = (day: number, hour: number, min = 0) => setMinutes(setHours(setDate(monthStart, day), hour), min);

export const demoEvents = [
  { title: "Planejamento mensal", start: dt(1, 9, 30), end: dt(1, 10, 30) },
  { title: "Revisão de design", start: dt(3, 11), end: dt(3, 12) },
  { title: "Check-in de cliente", start: dt(4, 15), end: dt(4, 15, 45) },
  { title: "Workshop de produto", start: d(7), end: d(9), allDay: true },
  { groupId: "standup", title: "Daily da equipe", start: dt(9, 10) },
  { title: "Alinhamento do financeiro", start: dt(10, 14, 30), end: dt(10, 15) },
  { title: "Bloco de foco", start: dt(12, 9), end: dt(12, 12), display: "background" },
  { title: "Planejamento de sprint", start: dt(15, 9, 30), end: dt(15, 11) },
  { groupId: "standup", title: "Daily da equipe", start: dt(16, 10) },
  { title: "Transição de operações", start: dt(18, 16), end: dt(18, 16, 45) },
  { title: "Prazo do relatório trimestral", start: d(24), allDay: true },
  { title: "Dia de recomeço", start: d(28), allDay: true },
  { title: "Aniversário de Arham Khan", start: new Date(currentYear, 8, 6), allDay: true },
];
