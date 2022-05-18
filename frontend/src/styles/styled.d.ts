// declaration file
// TypeScript와 styled components theme 연결

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    ownColor: string;
    ownColorHover: string;
    bgColor: string;
    textColor: string;
    subTextColor: string;
    borderColor: string;
    boxColor: string;
    subBoxColor: string;
    subBoxColor2: string;
  }
}
