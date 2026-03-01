export function getToday() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

export function calcStreak(entries, userId) {
  const studied = Object.entries(entries)
    .filter(([, v]) => v?.[userId]?.status === "studied")
    .map(([k]) => k)
    .sort()
    .reverse();
  if (!studied.length) return 0;
  const today = getToday();
  const yd = new Date(); yd.setDate(yd.getDate() - 1);
  const yesterday = `${yd.getFullYear()}-${String(yd.getMonth()+1).padStart(2,"0")}-${String(yd.getDate()).padStart(2,"0")}`;
  if (studied[0] !== today && studied[0] !== yesterday) return 0;
  let streak = 0, cursor = studied[0];
  for (const d of studied) {
    if (d === cursor) {
      streak++;
      const p = new Date(cursor); p.setDate(p.getDate()-1);
      cursor = `${p.getFullYear()}-${String(p.getMonth()+1).padStart(2,"0")}-${String(p.getDate()).padStart(2,"0")}`;
    } else break;
  }
  return streak;
}
