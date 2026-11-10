import { useColorScheme } from "react-native";

const light = {
  paper: "#EEF3F0", card: "#FFFFFF", ink: "#13201A", muted: "#5A6B63", rule: "#CFDAD4",
  accent: "#1C7A52", accentSoft: "#DDF0E6", red: "#B93A2E", redSoft: "#F8E1DD",
};
const dark: Theme = {
  paper: "#0E1512", card: "#16201B", ink: "#E4EDE8", muted: "#8FA199", rule: "#2A3832",
  accent: "#4CC28C", accentSoft: "#173A2A", red: "#F07161", redSoft: "#3D1F1B",
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === "dark" ? dark : light;
}
