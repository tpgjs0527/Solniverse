// theme 정의

import { DefaultTheme } from "styled-components";

// 밝은 테마
export const lightTheme: DefaultTheme = {
  bgColor: "white",
  textColor: "black",
  subTextColor: "#666666",
  borderColor: "#eeeeee",
};

// 어두운 테마
export const darkTheme: DefaultTheme = {
  bgColor: "black",
  textColor: "white",
  subTextColor: "#777777",
  borderColor: "#333333",
};
