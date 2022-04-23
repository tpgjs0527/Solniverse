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
  key: "wallet",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

export const twitchAtom = atom({
  key: "twitch",
  default: { id: "", display_name: "", profile_img_url: "" },
  effects_UNSTABLE: [persistAtom],
});
