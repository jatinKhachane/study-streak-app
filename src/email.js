// Email notifications via EmailJS (free tier — 200 emails/month)
// Setup:
//   1. Go to https://emailjs.com and create a free account
//   2. Add an Email Service (Gmail works) → copy Service ID
//   3. Create an Email Template with these variables:
//      {{to_email}}, {{subject}}, {{user_name}}, {{action}}, {{note}}, {{streak}}, {{date}}
//   4. Copy your Public Key from Account → API Keys
//   5. Fill in the three constants below

const EMAILJS_SERVICE_ID  = "service_7xh67cj";   // e.g. "service_abc123"
const EMAILJS_TEMPLATE_ID = "template_0bv8lzm";  // e.g. "template_xyz789"
const EMAILJS_PUBLIC_KEY  = "N3V-WVtuGbp2Z61Td";   // e.g. "abcDEF123456"

const NOTIFY_EMAIL_1 = "jatin.khachane.1997@gmail.com";
const NOTIFY_EMAIL_2 = "jatinkhachane@gmail.com";

let emailjsLoaded = false;

function loadEmailJS() {
  return new Promise((resolve, reject) => {
    if (emailjsLoaded || window.emailjs) { emailjsLoaded = true; resolve(); return; }
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js";
    s.onload = () => {
      window.emailjs.init(EMAILJS_PUBLIC_KEY);
      emailjsLoaded = true;
      resolve();
    };
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export async function sendUpdateEmail({ userName, otherName, action, note, streak, date }) {
  // Skip if not configured
  if (EMAILJS_SERVICE_ID === "YOUR_SERVICE_ID") {
    console.log("[EmailJS] Not configured — skipping email. See src/email.js for setup.");
    return;
  }

  try {
    await loadEmailJS();

    const actionText = action === "studied"
      ? `${userName} studied today! 📚`
      : action === "skipped"
      ? `${userName} skipped today.`
      : `${userName} removed their entry.`;

    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:  NOTIFY_EMAIL_1,
      subject:   `Study Streak — ${actionText}`,
      user_name: userName,
      action:    action === "studied" ? "Studied ✅" : action === "skipped" ? "Not Studied ❌" : "Entry removed",
      note:      note || "No note added",
      date,
    });

    await window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      to_email:  NOTIFY_EMAIL_2,
      subject:   `Study Streak — ${actionText}`,
      user_name: userName,
      action:    action === "studied" ? "Studied ✅" : action === "skipped" ? "Not Studied ❌" : "Entry removed",
      note:      note || "No note added",
      date,
    });

    console.log("[EmailJS] Email sent to both");
  } catch (err) {
    console.warn("[EmailJS] Failed to send email:", err);
  }
}
