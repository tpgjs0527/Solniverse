import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "styles/theme";
import GlobalStyle from "styles/GlobalStyle";
import Routes from "pages/Routes";
import { useRecoilState, useRecoilValue } from "recoil";
import { toggleThemeAtom, userInfoAtom } from "atoms";
import { useEffect, useMemo, useState } from "react";
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

const App = () => {
  const isDark = useRecoilValue(toggleThemeAtom);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  const provider = useMemo(() => getProvider(), []);
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [data, setData] = useState<any>();
  const connectWallet = async () => {
    await provider?.connect();
  };
  useEffect(() => {
    if (wallets) {
    }
  }, [wallets]);
  console.log("원래 유저", userInfo);

  useEffect(() => {
    if (!provider) return;
    if (provider) {
      provider.connect({ onlyIfTrusted: true }).catch((err) => {});
      provider.on("disconnect", () => {
        console.log("연결이 끊겼어요");
      });
      provider.on("accountChanged", async (publicKey: PublicKey) => {
        console.log("지갑변경", publicKey.toBase58());
        const rs = publicKey;
        if (publicKey) {
          const data = await getWallet(rs);
          setData(data);
          console.log("백 통신 결과", data);
          if (data.result === "success") {
            console.log("유저바꼈다1");
            console.log("유저가 지갑 바꾼 직후 userInfo", userInfo);
            console.log("유저가 지갑 바꾼 직후 data.user", data.user);
            if (data.user.twitch) {
              console.log("유저 세팅~~");
              console.log(data.user);
              setUserInfo({
                twitch: {
                  id: data.user.twitch.id,
                  displayName: data.user.twitch.displayName,
                  profileImageUrl: data.user.twitch.profileImageUrl,
                },
                walletAddress: data.user.walletAddress,
                createdAt: data.user.createdAt,
              });
            } else {
              console.log("트위치 연동 X");
              console.log(data.user);
              setUserInfo({
                twitch: {
                  id: "",
                  displayName: "",
                  profileImageUrl: "",
                },
                walletAddress: data.user.walletAddress,
                createdAt: data.user.createdAt,
              });
              console.log(
                "유저가 지갑 바꾸고 아톰 변경 후(No twitch, userInfo)",
                userInfo
              );
            }
          } else {
            alert("지갑연결이 실패했습니다");
          }
        } else {
          provider
            ?.connect()
            .then(() => console.log("유저 데이터 갱신"))
            .catch((err) => {
              console.log("에러");
            });
        }
      });

      return () => {
        provider.disconnect();
      };
    }
  }, [provider]);

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
