// theme.js — returns theme object based on dark/light mode
// User colors stay consistent, backgrounds flip

export function getTheme(dark) {
  return {
    // Page
    bg:        dark ? "#111210" : "#FAFAF8",
    surface:   dark ? "#1A1C19" : "#FFFFFF",
    hover:     dark ? "#222420" : "#F5F4F0",
    border:    dark ? "#2C2E2A" : "#E8E4DC",
    borderHi:  dark ? "#444840" : "#C8C0B0",

    // Text
    text:      dark ? "#E8EDE4" : "#1A1916",
    sub:       dark ? "#7A8070" : "#7A7567",
    muted:     dark ? "#4A5046" : "#B0A898",

    // Jatin — forest green
    jatin:       "#3A7A50",
    jatinLight:  "#52A870",
    jatinSoft:   dark ? "#142018" : "#EEF4F0",
    jatinMid:    dark ? "#285A38" : "#A8C8B2",
    jatinBorder: dark ? "#2A4A32" : "#C4DCC8",

    // Hema — terracotta
    hema:        "#C25F3A",
    hemaLight:   "#D87A50",
    hemaSoft:    dark ? "#201410" : "#FBF0EB",
    hemaMid:     dark ? "#5A2A18" : "#E0A88C",
    hemaBorder:  dark ? "#4A2818" : "#ECC4AC",

    // Bad (skipped)
    bad:         "#8B5A2B",
    badSoft:     dark ? "#1A1208" : "#FBF5EE",
    badBorder:   dark ? "#3A2A12" : "#DEC4A0",
  };
}

// Default light theme export for components that still use static T
const T = getTheme(true);
export default T;
