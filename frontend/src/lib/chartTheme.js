const DARK = {
  grid: "#26262a",
  axis: "#8a8a8e",
  tooltipBg: "#0b0b0c",
  tooltipBorder: "#26262a",
  tooltipText: "#c9c9cc",
  neutral: "#d4d4d6", // primary / non-critical series
  danger: "#e0293e", // high-risk / alert series
  dangerSoft: "#8a3540",
  mid: "#8a8a8e",
  dim: "#4a4a4e",
};

const LIGHT = {
  grid: "#e4e4e6",
  axis: "#6b6b70",
  tooltipBg: "#ffffff",
  tooltipBorder: "#e4e4e6",
  tooltipText: "#2a2a2d",
  neutral: "#3a3a3d",
  danger: "#d81b32",
  dangerSoft: "#c9838d",
  mid: "#8a8a8e",
  dim: "#c9c9cc",
};

export function getChartColors(theme) {
  return theme === "light" ? LIGHT : DARK;
}
