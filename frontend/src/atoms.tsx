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
});
// 액세스 토큰 있으면 들어가
// 액세스 토큰 없으면 액세스 토큰을 재발급 -> 리프레쉬 토큰으로 재발급받기
// 1. 리프레쉬 토큰 있어서 액세스토큰 재발급받아가지고 들어갈 수 있음
// 2. 리프레쉬 토큰 없어서 시그니처 검증한 후, 토큰 받아서 들어갈 수 있음
