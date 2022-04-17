import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "styles/theme";
import GlobalStyle from "styles/GlobalStyle";
import Routes from "pages/Routes";
import { useRecoilValue } from "recoil";
import { toggleThemeAtom } from "atoms";

function App() {
  const isDark = useRecoilValue(toggleThemeAtom);

  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <GlobalStyle />
      <Routes />
    </ThemeProvider>
  );
}

export default App;
