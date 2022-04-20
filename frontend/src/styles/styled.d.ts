// declaration file
// TypeScript와 styled components theme 연결

import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    ownColor: string;
    bgColor: string;
    textColor: string;
    subTextColor: string;
    borderColor: string;
  }
}
