import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "styles/theme";
import GlobalStyle from "styles/GlobalStyle";
import Routes from "pages/Routes";
import { useRecoilValue } from "recoil";
import { toggleThemeAtom } from "atoms";
import { useEffect, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl } from "@solana/web3.js";
import { Outlet } from "react-router-dom";

const App = () => {
  const isDark = useRecoilValue(toggleThemeAtom);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  useEffect(() => {
    if (wallets) {
      console.log(wallets);
    }
  }, [wallets]);
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>
            <Routes />
            <GlobalStyle />
            <Outlet />
            {/* <WalletMultiButton /> */}
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
