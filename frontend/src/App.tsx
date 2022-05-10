import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "styles/theme";
import GlobalStyle from "styles/GlobalStyle";
import Routes from "pages/Routes";
import { useRecoilState, useRecoilValue } from "recoil";
import { toggleThemeAtom, userInfoAtom } from "atoms";
import { useEffect, useMemo } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Outlet } from "react-router-dom";
import { getProvider } from "utils/getProvider";
import { getWallet } from "utils/solanaWeb3";
import { fetchWallet } from "utils/fetcher";

const App = () => {
  const isDark = useRecoilValue(toggleThemeAtom);
  const provider = getProvider();
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  useEffect(() => {
    if (wallets) {
      console.log(wallets);
    }
  }, [wallets]);
  useEffect(() => {
    console.log(provider);
  }, []);
  useEffect(() => {
    console.log("dpd");
    provider?.on("accountChanged", async (publicKey: PublicKey) => {
      console.log("지갑변경", publicKey);
      // const res = await fetchWallet(publicKey.toBase58());
      // const data = await res.json()
      // if (data.result === "success") {
      //   if (data.user.twitch) {
      //     setUserInfo({
      //       twitch: {
      //         id: data.user.twitch.id,
      //         displayName: data.user.twitch.displayName,
      //         profileImageUrl: data.user.twitch.profileImageUrl,
      //       },
      //       walletAddress: data.user.walletAddress,
      //       createdAt: data.user.createdAt,
      //     });
      //   } else {
      //     setUserInfo({
      //       ...userInfo,
      //       walletAddress: data.user.walletAddress,
      //       createdAt: data.user.createdAt,
      //     });
      //   }
      // }
    });
  }, [provider]);
  // accountChanged 감지 -> 아톱 상태 변경 (유저 정보 변경)
  return (
    <ThemeProvider theme={isDark ? darkTheme : lightTheme}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect={false}>
          <WalletModalProvider>
            <Routes />
            <GlobalStyle />
            <Outlet />
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </ThemeProvider>
  );
};

export default App;
