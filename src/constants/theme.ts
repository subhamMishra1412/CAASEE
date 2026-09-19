const tintColorLight = "#000";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#000",
    textSecondary: "#999",
    background: "#fff",
    cardBackground: "#f5f5f5",
    border: "#f0f0f0",
    tint: tintColorLight,
    icon: "#999",
    insightBackground: "#f0f9ff",
    backgroundElement: "#f5f5f5",
    backgroundSelected: "#e8e8e8",
    tabIconDefault: "#999",
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: "#fff",
    textSecondary: "#999",
    background: "#000",
    cardBackground: "#1a1a1a",
    border: "#333",
    tint: tintColorDark,
    icon: "#999",
    insightBackground: "#0f172a",
    backgroundElement: "#1a1a1a",
    backgroundSelected: "#333",
    tabIconDefault: "#999",
    tabIconSelected: tintColorDark,
  },
};

export type ThemeColor = keyof (typeof Colors)["light"];

export const Fonts = {
  mono: "monospace",
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
};

export const MaxContentWidth = 768;
export const BottomTabInset = 56;
