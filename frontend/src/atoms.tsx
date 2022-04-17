// 상태관리

import { atom } from "recoil";

// Theme
export const toggleThemeAtom = atom({
  key: "theme",
  default: false,
});

// Sidebar
export const toggleSidebarAtom = atom({
  key: "sidebar",
  default: false,
});
