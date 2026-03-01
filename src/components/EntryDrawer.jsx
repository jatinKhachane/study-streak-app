import { useState, useEffect } from "react";
import { getTheme } from "../theme";

export default function EntryDrawer({ user, todayEntry, onSave, onClear, onClose, dark }) {
  const T = getTheme(dark);
  const [step, setStep]       = useState(todayEntry ? "view" : "pick");
  const [studied, setStudied] = useState(null);
  const [note, setNote]       = useState("");

  useEffect(() => {
    setStep(todayEntry ? "view" : "pick");
    setNote("");
  }, [todayEntry]);

  const accent = user.accent;
  const soft   = user.soft(dark);
  const border = user.border(dark);

  const primaryBtn = (extra = {}) => ({
    flex:1, padding:"12px", border:"none", borderRadius:10,
    background:accent, color:"#fff",
    fontSize:12, fontWeight:600, letterSpacing:"0.03em",
    cursor:"pointer", fontFamily:"'Sora', sans-serif",
    transition:"opacity 0.15s", ...extra,
  });
  const ghostBtn = (extra = {}) => ({
    padding:"12px 16px", border:`1px solid ${T.border}`, borderRadius:10,
    background:"transparent", color:T.sub,
    fontSize:12, cursor:"pointer", fontFamily:"'Sora', sans-serif", ...extra,
  });

  return (
    <div style={{
      position:"fixed", inset:0,
      background:"rgba(0,0,0,0.5)",
      display:"flex", alignItems:"flex-end", justifyContent:"center",
      zIndex:200, backdropFilter:"blur(8px)",
    }} onClick={onClose}>
      <div style={{
        background:T.surface,
        borderRadius:"20px 20px 0 0",
        border:`1px solid ${T.border}`,
        borderBottom:"none",
        padding:"20px 20px 44px",
        width:"100%", maxWidth:380,
        animation:"slideUp 0.25s cubic-bezier(.32,.72,0,1)",
      }} onClick={e => e.stopPropagation()}>

        <div style={{ width:36, height:3.5, borderRadius:4, background:T.border, margin:"0 auto 20px" }} />

        {step === "pick" && (
          <>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize:20, fontWeight:300, color:T.text, marginBottom:4 }}>
              Log today, {user.name}
            </div>
            <div style={{ fontSize:12, color:T.sub, marginBottom:20 }}>How did your session go?</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => { setStudied(true); setStep("note"); }} style={primaryBtn()}>Studied</button>
              <button onClick={() => { setStudied(false); setStep("note"); }} style={ghostBtn({flex:1})}>Not Studied</button>
            </div>
          </>
        )}

        {step === "note" && (
          <>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize:20, fontWeight:300, color:T.text, marginBottom:4 }}>
              {studied ? "What did you cover?" : "What happened?"}
            </div>
            <div style={{ fontSize:12, color:T.sub, marginBottom:14 }}>Optional — shown on the calendar</div>
            <textarea
              autoFocus value={note} onChange={e => setNote(e.target.value)}
              placeholder={studied ? "e.g. Chapter 5, solved 20 problems..." : "e.g. Wasn't feeling well today..."}
              maxLength={120}
              style={{
                width:"100%", border:`1px solid ${T.border}`, borderRadius:10,
                padding:"12px 14px", fontSize:13, color:T.text, background:T.hover,
                resize:"none", height:80, fontFamily:"'Sora', sans-serif",
                outline:"none", lineHeight:1.5, transition:"border-color 0.15s",
              }}
              onFocus={e => (e.target.style.borderColor = accent)}
              onBlur={e  => (e.target.style.borderColor = T.border)}
            />
            <div style={{ fontSize:10, color:T.muted, textAlign:"right", marginTop:4, marginBottom:16 }}>{note.length}/120</div>
            <div style={{ display:"flex", gap:8 }}>
              <button onClick={() => setStep("pick")} style={ghostBtn()}>Back</button>
              <button onClick={() => { onSave(studied ? "studied" : "skipped", note.trim()); onClose(); }} style={primaryBtn()}>
                Save entry
              </button>
            </div>
          </>
        )}

        {step === "view" && todayEntry && (
          <>
            <div style={{ fontFamily:"'Fraunces', serif", fontSize:20, fontWeight:300, color:T.text, marginBottom:16 }}>Today's entry</div>
            <div style={{
              background: todayEntry.status === "studied" ? soft : T.badSoft,
              borderRadius:12, padding:"14px 16px",
              border:`1px solid ${todayEntry.status === "studied" ? border : T.badBorder}`,
            }}>
              <div style={{
                fontSize:12, fontWeight:600, letterSpacing:"0.04em", textTransform:"uppercase",
                color: todayEntry.status === "studied" ? accent : T.bad,
                marginBottom: todayEntry.note ? 6 : 0,
              }}>
                {todayEntry.status === "studied" ? "Studied" : "Not Studied"}
              </div>
              {todayEntry.note && <div style={{ fontSize:12, color:T.sub, lineHeight:1.6 }}>"{todayEntry.note}"</div>}
            </div>
            <button onClick={() => { onClear(); onClose(); }} style={{ ...ghostBtn(), width:"100%", marginTop:12, textAlign:"center" }}>
              Remove entry
            </button>
          </>
        )}
      </div>
    </div>
  );
}
