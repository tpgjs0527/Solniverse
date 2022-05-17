// 상태관리
import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

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

export const accessTokenAtom = atom({
  key: "accessToken",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
