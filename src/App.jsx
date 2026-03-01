import { useState, useEffect } from "react";
import { saveEntry, clearEntry, subscribeAll } from "./firebase";
import { getToday, calcStreak } from "./utils";
import { getTheme } from "./theme";
import { sendUpdateEmail } from "./email";
import WhoAreYou, { USERS } from "./components/WhoAreYou";
import Calendar from "./components/Calendar";
import EntryDrawer from "./components/EntryDrawer";

export default function App() {
  const [user, setUser]       = useState(null);
  const [entries, setEntries] = useState({});
  const [drawer, setDrawer]   = useState(false);
  const [tab, setTab]         = useState("me");
  const [toast, setToast]     = useState(null);
  const [dark, setDark]       = useState(true);
  const [vm, setVm]           = useState({
    year:  new Date().getFullYear(),
    month: new Date().getMonth(),
  });

  const T = getTheme(dark);

  useEffect(() => {
    const unsub = subscribeAll(setEntries);
    return unsub;
  }, []);

  if (!user) return <WhoAreYou onSelect={u => { setUser(u); setTab("me"); }} dark={dark} />;

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2000); };

  const today   = getToday();
  const other   = USERS.find(u => u.id !== user.id);
  const meId    = user.id;
  const otherId = other.id;

  const viewUser = tab === "me" ? user : other;
  const viewId   = viewUser.id;

  const myEntry    = entries[today]?.[meId];
  const otherEntry = entries[today]?.[otherId];

  const myStreak    = calcStreak(entries, meId);
  const otherStreak = calcStreak(entries, otherId);
  const viewStreak  = tab === "me" ? myStreak : otherStreak;

  const daysInViewMonth  = new Date(vm.year, vm.month + 1, 0).getDate();
  const studiedThisMonth = Array.from({ length: daysInViewMonth }, (_, i) => {
    const key = `${vm.year}-${String(vm.month+1).padStart(2,"0")}-${String(i+1).padStart(2,"0")}`;
    return entries[key]?.[viewId]?.status === "studied";
  }).filter(Boolean).length;

  const handleSave = async (status, note) => {
    await saveEntry(today, meId, status, note);
    showToast(status === "studied" ? "Logged. Keep going!" : "Logged.");

    // Email notification
    const newStreak = calcStreak(
      { ...entries, [today]: { ...(entries[today] || {}), [meId]: { status, note } } },
      meId
    );
    sendUpdateEmail({
      userName:  user.name,
      otherName: other.name,
      action:    status,
      note,
      streak:    newStreak,
      date:      new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" }),
    });
  };

  const handleClear = async () => {
    await clearEntry(today, meId);
    showToast("Entry removed.");
    sendUpdateEmail({
      userName:  user.name,
      otherName: other.name,
      action:    "removed",
      note:      "",
      streak:    myStreak,
      date:      new Date().toLocaleDateString("en-IN", { weekday:"long", year:"numeric", month:"long", day:"numeric" }),
    });
  };

  const motivational =
    myStreak > otherStreak  ? `You lead ${other.name} by ${myStreak - otherStreak}d` :
    otherStreak > myStreak  ? `${other.name} leads by ${otherStreak - myStreak}d — keep up!` :
    myStreak === 0          ? "No streak yet — start today" :
                              `Tied at ${myStreak} days`;

  return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", justifyContent:"center" }}>
      <div style={{ width:"100%", maxWidth:360, paddingBottom:48 }}>

        {/* Toast */}
        {toast && (
          <div style={{
            position:"fixed", top:16, left:"50%", transform:"translateX(-50%)",
            background:T.text, color:T.bg,
            padding:"8px 20px", borderRadius:100,
            fontSize:11, fontWeight:500, zIndex:999, whiteSpace:"nowrap",
            animation:"slideDown 0.2s ease",
            boxShadow:"0 4px 24px rgba(0,0,0,0.2)",
          }}>{toast}</div>
        )}

        {drawer && tab === "me" && (
          <EntryDrawer
            user={user} todayEntry={myEntry}
            onSave={handleSave} onClear={handleClear}
            onClose={() => setDrawer(false)} dark={dark}
          />
        )}

        {/* ── Header ── */}
        <div style={{ padding:"24px 18px 0", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize:22, fontWeight:300, color:T.text, letterSpacing:"-0.3px" }}>
              Study Streak
            </div>
            <div style={{ fontSize:11, color:T.sub, marginTop:3 }}>{motivational}</div>
          </div>

          <div style={{ display:"flex", alignItems:"center", gap:6, paddingTop:2 }}>
            {/* Dark/light toggle */}
            <button onClick={() => setDark(d => !d)} title="Toggle theme" style={{
              background:T.hover, border:`1px solid ${T.border}`,
              borderRadius:8, padding:"6px 9px",
              cursor:"pointer", fontSize:14, lineHeight:1,
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {dark ? "☀️" : "🌙"}
            </button>

            {/* User badge */}
            <div style={{
              display:"flex", alignItems:"center", gap:6,
              background:user.soft(dark), border:`1px solid ${user.border(dark)}`,
              borderRadius:20, padding:"5px 11px 5px 7px",
            }}>
              <div style={{
                width:20, height:20, borderRadius:6,
                background:user.accent, color:"#fff",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:700, fontFamily:"'Fraunces', serif",
              }}>{user.initial}</div>
              <span style={{ fontSize:11, fontWeight:500, color:user.accent }}>{user.name}</span>
            </div>

            {/* Switch */}
            <button onClick={() => setUser(null)} style={{
              background:T.hover, border:`1px solid ${T.border}`,
              borderRadius:8, padding:"6px 9px",
              cursor:"pointer", color:T.sub, fontSize:11,
              fontFamily:"'Sora', sans-serif",
            }}>Switch</button>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div style={{ padding:"14px 18px 0" }}>
          <div style={{ background:T.surface, border:`1px solid ${T.border}`, borderRadius:12, padding:4, display:"flex" }}>
            {[["me", user.name, user], ["them", other.name, other]].map(([key, label, u]) => {
              const active = tab === key;
              return (
                <button key={key} onClick={() => setTab(key)} style={{
                  flex:1, padding:"9px 0", border:"none", cursor:"pointer",
                  borderRadius:9, fontSize:12, fontWeight: active ? 600 : 400,
                  transition:"all 0.18s", fontFamily:"'Sora', sans-serif",
                  background: active ? u.soft(dark) : "transparent",
                  color: active ? u.accent : T.sub,
                  borderBottom: active ? `2px solid ${u.accent}` : "2px solid transparent",
                }}>
                  {label}
                  {key === "them" && otherEntry && (
                    <span style={{
                      display:"inline-block", width:5, height:5, borderRadius:"50%",
                      background: otherEntry.status === "studied" ? other.accent : "#B85C5C",
                      marginLeft:5, verticalAlign:"middle", marginBottom:1,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{ padding:"10px 18px 0" }}>

          {/* ── Streak + month stat ── */}
          <div style={{
            background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:14, padding:"14px 16px", marginBottom:10,
            display:"flex", alignItems:"center", justifyContent:"space-between",
          }}>
            <div>
              <div style={{ fontSize:10, color:T.sub, letterSpacing:"0.1em", textTransform:"uppercase", marginBottom:4 }}>
                {viewUser.name}'s streak
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:5 }}>
                <span style={{ fontFamily:"'Fraunces', serif", fontSize:42, fontWeight:600, lineHeight:1, color:viewUser.accent }}>
                  {viewStreak}
                </span>
                <span style={{ fontSize:12, color:T.sub }}>days</span>
              </div>
            </div>

            <div style={{ width:1, height:44, background:T.border }} />

            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:10, color:T.sub, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:4 }}>
                This month
              </div>
              <div style={{ display:"flex", alignItems:"baseline", gap:3, justifyContent:"center" }}>
                <span style={{ fontFamily:"'Fraunces', serif", fontSize:28, fontWeight:600, lineHeight:1, color:viewUser.accent }}>
                  {studiedThisMonth}
                </span>
                <span style={{ fontSize:13, color:T.muted, fontWeight:300 }}>/{daysInViewMonth}</span>
              </div>
            </div>
          </div>

          {/* ── Today log / entry ── */}
          {tab === "me" ? (
            !myEntry ? (
              <button onClick={() => setDrawer(true)} style={{
                width:"100%", padding:"11px", marginBottom:10,
                border:`1.5px dashed ${user.mid(dark)}`,
                borderRadius:12, background:user.soft(dark),
                color:user.accent, fontSize:12, fontWeight:500,
                cursor:"pointer", fontFamily:"'Sora', sans-serif", transition:"all 0.15s",
              }}
                onMouseEnter={e => { e.target.style.borderColor=user.accent; e.target.style.borderStyle="solid"; }}
                onMouseLeave={e => { e.target.style.borderColor=user.mid(dark); e.target.style.borderStyle="dashed"; }}
              >
                + Log today
              </button>
            ) : (
              <div onClick={() => setDrawer(true)} style={{
                background: myEntry.status === "studied" ? user.soft(dark) : T.badSoft,
                border:`1px solid ${myEntry.status === "studied" ? user.border(dark) : T.badBorder}`,
                borderRadius:12, padding:"11px 14px", marginBottom:10, cursor:"pointer",
                display:"flex", justifyContent:"space-between", alignItems:"center",
                transition:"opacity 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.opacity="0.8")}
                onMouseLeave={e => (e.currentTarget.style.opacity="1")}
              >
                <div>
                  <div style={{
                    fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase",
                    color: myEntry.status === "studied" ? user.accent : "#B85C5C",
                    marginBottom: myEntry.note ? 3 : 0,
                  }}>
                    {myEntry.status === "studied" ? "Studied" : "Not studied"}
                  </div>
                  {myEntry.note && <div style={{ fontSize:11, color:T.sub, lineHeight:1.4 }}>"{myEntry.note}"</div>}
                </div>
                <span style={{ fontSize:10, color:T.muted }}>edit</span>
              </div>
            )
          ) : (
            <div style={{
              background:T.surface, border:`1px solid ${otherEntry ? other.border(dark) : T.border}`,
              borderRadius:12, padding:"11px 14px", marginBottom:10,
              fontSize:12, color:T.sub, lineHeight:1.5,
            }}>
              {otherEntry ? (
                <>
                  <span style={{ color:other.accent, fontWeight:600 }}>{other.name}</span>
                  {" "}{otherEntry.status === "studied" ? "studied today" : "didn't study today"}
                  {otherEntry.note && <span style={{ color:T.muted }}> — "{otherEntry.note}"</span>}
                </>
              ) : (
                <span>{other.name} hasn't logged today yet</span>
              )}
            </div>
          )}

          {/* ── Calendar ── */}
          <Calendar
            entries={entries} year={vm.year} month={vm.month} dark={dark}
            onPrev={() => setVm(v => { const d=new Date(v.year,v.month-1); return {year:d.getFullYear(),month:d.getMonth()}; })}
            onNext={() => setVm(v => { const d=new Date(v.year,v.month+1); return {year:d.getFullYear(),month:d.getMonth()}; })}
          />

          <div style={{ textAlign:"center", marginTop:12, fontSize:10, color:T.muted, letterSpacing:"0.06em" }}>
            Live sync · Firebase Firestore
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideDown { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes slideUp   { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        button { outline:none; }
        button:active { opacity:0.7 !important; }
        * { box-sizing:border-box; }
      `}</style>
    </div>
  );
}
