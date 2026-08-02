export function timeToMinutes(time: string) {
  const [t, period] = time.trim().split(" ");
  let [h, m] = t.split(":").map(Number);

  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;

  return h * 60 + m;
}

export function getOrder(week: number, time: string) {
  return week * 1000 + timeToMinutes(time);
}