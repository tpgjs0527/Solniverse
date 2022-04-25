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

export const userInfoAtom = atom({
  key: "userInfo",
  default: {
    twitch: { id: "", displayName: "", profileImageUrl: "" },
    walletAddress: "",
    createdAt: "",
  },
  effects_UNSTABLE: [persistAtom],
});
