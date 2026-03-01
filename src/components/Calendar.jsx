import { getTheme } from "../theme";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS   = ["S","M","T","W","T","F","S"];

function getKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

// J or H letter — green if studied, red if skipped, gray if no entry
function UserBadge({ letter, status }) {
  const color =
    status === "studied" ? "#3A7A50" :
    status === "skipped" ? "#B85C5C" :
    "#BBBBBB";
  return (
    <span style={{
      fontSize: 7,
      fontWeight: 700,
      color,
      lineHeight: 1,
      fontFamily: "'Fraunces', serif",
      letterSpacing: 0,
    }}>
      {letter}
    </span>
  );
}

export default function Calendar({ entries, year, month, onPrev, onNext, dark }) {
  const T        = getTheme(dark);
  const todayKey = getKey(new Date());
  const firstDay = new Date(year, month, 1).getDay();
  const daysIn   = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysIn; d++) {
    cells.push({ day: d, key: getKey(new Date(year, month, d)) });
  }

  const navBtn = {
    background: T.hover, border: `1px solid ${T.border}`,
    borderRadius: 7, width: 28, height: 28,
    fontSize: 15, cursor: "pointer", color: T.sub,
    display: "flex", alignItems: "center", justifyContent: "center",
  };

  return (
    <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "14px 12px" }}>

      {/* Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <button onClick={onPrev} style={navBtn}>‹</button>
        <span style={{ fontSize: 12, fontWeight: 600, color: T.sub, letterSpacing: "0.06em" }}>
          {MONTHS[month].toUpperCase()} {year}
        </span>
        <button onClick={onNext} style={navBtn}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 3 }}>
        {DAYS.map((d, i) => (
          <div key={i} style={{ textAlign: "center", fontSize: 9, fontWeight: 600, color: T.muted, letterSpacing: "0.05em" }}>{d}</div>
        ))}
      </div>

      {/* Cells */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
        {cells.map((cell, i) => {
          if (!cell) return <div key={`e${i}`} />;

          const e       = entries[cell.key] || {};
          const jStatus = e.user1?.status;  // "studied" | "skipped" | undefined
          const hStatus = e.user2?.status;
          const isToday = cell.key === todayKey;

          return (
            <div key={cell.key} style={{
              borderRadius: 7,
              background: T.hover,
              border: isToday ? `1.5px solid ${T.jatin}` : `1px solid ${T.border}`,
              minHeight: 38,
              padding: "3px 2px 2px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}>
              {/* Day number */}
              <span style={{
                fontSize: 10,
                fontWeight: isToday ? 700 : 400,
                color: T.sub,
                lineHeight: 1.2,
              }}>
                {cell.day}
              </span>

              {/* J and H badges side by side */}
              {(jStatus || hStatus) && (
                <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
                  {jStatus && <UserBadge letter="J" status={jStatus} />}
                  {hStatus && <UserBadge letter="H" status={hStatus} />}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 10, justifyContent: "center" }}>
        {[
          { color: "#3A7A50", label: "Studied" },
          { color: "#B85C5C", label: "Skipped" },
          { color: "#BBBBBB", label: "No log"  },
        ].map(l => (
          <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span style={{ fontSize: 9, fontWeight: 700, color: l.color, fontFamily: "'Fraunces', serif" }}>J</span>
            <span style={{ fontSize: 9, color: T.sub }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
