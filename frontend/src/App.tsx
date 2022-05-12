import { ThemeProvider } from "styled-components";
import { darkTheme, lightTheme } from "styles/theme";
import GlobalStyle from "styles/GlobalStyle";
import Routes from "pages/Routes";
import { useRecoilState, useRecoilValue } from "recoil";
import { toggleThemeAtom, userInfoAtom } from "atoms";
import { useCallback, useEffect, useMemo, useState } from "react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Outlet } from "react-router-dom";
import { getWallet } from "utils/solanaWeb3";
import { clusterApiUrl, PublicKey, Transaction } from "@solana/web3.js";
import { isMobile } from "react-device-detect";
import { checkMobile } from "../src/utils/checkMobile";
import { useProvider } from "hooks/useProvider";

type DisplayEncoding = "utf8" | "hex";
type PhantomEvent = "disconnect" | "connect" | "accountChanged";

type PhantomRequestMethod =
  | "connect"
  | "disconnect"
  | "signTransaction"
  | "signMessage";
interface ConnectOpts {
  onlyIfTrusted: boolean;
}
export interface PhantomProvider {
  publicKey: PublicKey | null;
  isConnected: boolean | null;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
  signMessage: (
    message: Uint8Array | string,
    display?: DisplayEncoding
  ) => Promise<any>;
  connect: (opts?: Partial<ConnectOpts>) => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  on: (event: PhantomEvent, handler: (args: any) => void) => void;
  request: (method: PhantomRequestMethod, params: any) => Promise<unknown>;
}

const App = () => {
  const isDark = useRecoilValue(toggleThemeAtom);
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [network]);
  const provider = useProvider();
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [data, setData] = useState<any>();

  useEffect(() => {
    if (wallets) {
    }
  }, [wallets]);
  console.log("원래 유저", userInfo);

  useEffect(() => {
    if (!provider) {
      alert("지갑연결이 끊겼습니다. 재입장해주세요!");
      setUserInfo({
        twitch: {
          id: "",
          displayName: "",
          profileImageUrl: "",
        },
        walletAddress: "",
        createdAt: "",
      });
    }
    if (provider) {
      provider.connect({ onlyIfTrusted: true }).catch((err) => {});
      provider.on("disconnect", () => {
        console.log("연결이 끊겼어요");
        // provider.connect();
      });
      provider.on("accountChanged", async (publicKey: PublicKey) => {
        // 연결이 끊겨있는 상태에서 주소바꾸면 null값이 나옴
        console.log(publicKey);
        if (!publicKey) {
          provider.connect();
        }
        console.log("지갑변경");
        const rs = publicKey;
        if (publicKey) {
          const data = await getWallet(rs);
          setData(data);

          if (data.result === "success") {
            if (data.user.twitch) {
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
            }
            // window.location.reload();
          } else {
            return;
          }
        } else {
          return;
        }
      });

      return () => {};
    }
  }, [provider]);
  // useEffect(() => {
  //   const onLoad = async () => {
  //     await provider?.connect();
  //   };
  //   window.addEventListener("load", onLoad);
  //   return () => {
  //     window.removeEventListener("load", onLoad);
  //   };
  // }, []);
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
