export const fmtDate = (d = new Date()) => d.toISOString().slice(0, 10); // YYYY-MM-DD

export const isToday = (dateStr: string) => dateStr === fmtDate();
