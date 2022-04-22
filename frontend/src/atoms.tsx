// 상태관리

import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist(); // 쿠키 저장
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

export const walletAtom = atom({
  key: "walletAtom",
  default: { twitch: "", wallet_address: "", created_at: "" },
  effects_UNSTABLE: [persistAtom],
});
