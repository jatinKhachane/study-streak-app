import { getTheme } from "../theme";

export const USERS = [
  {
    id:      "user1",
    name:    "Jatin",
    initial: "J",
    accent:  "#3A7A50",
    light:   "#52A870",
    soft:    (dark) => dark ? "#142018" : "#EEF4F0",
    mid:     (dark) => dark ? "#285A38" : "#A8C8B2",
    border:  (dark) => dark ? "#2A4A32" : "#C4DCC8",
  },
  {
    id:      "user2",
    name:    "Hema",
    initial: "H",
    accent:  "#C25F3A",
    light:   "#D87A50",
    soft:    (dark) => dark ? "#201410" : "#FBF0EB",
    mid:     (dark) => dark ? "#5A2A18" : "#E0A88C",
    border:  (dark) => dark ? "#4A2818" : "#ECC4AC",
  },
];

export default function WhoAreYou({ onSelect, dark }) {
  const T = getTheme(dark);

  return (
    <div style={{
      minHeight:"100vh", background:T.bg,
      display:"flex", flexDirection:"column",
      alignItems:"center", justifyContent:"center", padding:"24px",
    }}>
      <div style={{ width:48, height:4, borderRadius:2, background:T.border, marginBottom:40 }} />

      <div style={{ fontFamily:"'Fraunces', serif", fontSize:32, fontWeight:300, color:T.text, letterSpacing:"-0.5px", marginBottom:8, textAlign:"center" }}>
        Study Streak
      </div>
      <div style={{ fontSize:13, color:T.sub, marginBottom:48, textAlign:"center" }}>
        Who's checking in?
      </div>

      <div style={{ display:"flex", flexDirection:"column", gap:12, width:"100%", maxWidth:320 }}>
        {USERS.map(u => (
          <button key={u.id} onClick={() => onSelect(u)} style={{
            display:"flex", alignItems:"center", gap:16,
            padding:"18px 20px",
            background:T.surface, border:`1.5px solid ${T.border}`,
            borderRadius:16, cursor:"pointer", textAlign:"left",
            transition:"all 0.18s", fontFamily:"'Sora', sans-serif",
          }}
            onMouseEnter={e => {
              const el = e.currentTarget;
              el.style.borderColor = u.border(dark);
              el.style.background  = u.soft(dark);
              el.style.transform   = "translateY(-1px)";
              el.style.boxShadow   = `0 4px 20px ${u.accent}22`;
            }}
            onMouseLeave={e => {
              const el = e.currentTarget;
              el.style.borderColor = T.border;
              el.style.background  = T.surface;
              el.style.transform   = "translateY(0)";
              el.style.boxShadow   = "none";
            }}
          >
            <div style={{
              width:44, height:44, borderRadius:12,
              background:u.soft(dark), border:`1.5px solid ${u.border(dark)}`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, fontFamily:"'Fraunces', serif", fontWeight:600,
              color:u.accent, flexShrink:0,
            }}>{u.initial}</div>
            <div>
              <div style={{ fontSize:16, fontWeight:600, color:T.text, marginBottom:2 }}>{u.name}</div>
              <div style={{ fontSize:11, color:T.sub }}>Tap to continue as {u.name}</div>
            </div>
            <div style={{ marginLeft:"auto", fontSize:16, color:T.muted }}>→</div>
          </button>
        ))}
      </div>

      <div style={{ marginTop:40, fontSize:11, color:T.muted, textAlign:"center" }}>
        Both of you share the same data in real-time
      </div>
    </div>
  );
}
