import { accessTokenAtom, userInfoAtom } from "atoms";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getAccessToken } from "utils/getAccessToken";
import { getProvider } from "utils/getProvider";
import { getTokens } from "utils/getTokens";
import { getWallet } from "utils/getWallet";

function Home() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [wallet, setWallet] = useState(false);

  // 기존에 지갑 있으면 연결 ㅇㅋ
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana }: any = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("지갑찾음");
          const res = await solana.connect({ onlyIfTrusted: true });

          console.log("지갑연결", res.publicKey.toString());
          setWallet(!wallet);
        } else {
          alert("팬텀지갑 설치하세요");
        }
      }
    } catch (error) {}
  };
  // 지갑연결
  const connectWallet = async () => {
    const data = await getWallet();
    if (data.result === "success") {
      if (data.user.twitch) {
        setUserInfo({
          twitch: {
            id: data.user.twitch.id,
            displayName: data.user.twitch.displayName,
            profileImageUrl: data.user.twitch.profileImageUrl,
          },
          walletAddress: data.user.wallet_address,
          createdAt: data.user.createdAt,
        });
        console.log("twitch true", userInfo);
      } else {
        setUserInfo({
          ...userInfo,
          walletAddress: data.user.wallet_address,
          createdAt: data.user.createdAt,
        });
        console.log("twitch false", userInfo);
      }
    } else {
      alert("지갑연결이 실패했습니다");
    }
  };
  // refreshToken과 accessToken받기
  const getToken = async (walletAddress: string) => {
    const res = await getTokens(walletAddress);
    setAccessToken(res);
  };
  // accessToken 재발급
  const reGetToken = async (walletAddress: string) => {
    console.log(accessToken, "before");
    const res = await getAccessToken(walletAddress);
    setAccessToken(res);
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return (
    <div className="App">
      <div className="container">
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWallet}
        >
          {!wallet ? "지갑연결" : "연결완료"}
        </button>
        {userInfo.walletAddress ? (
          <button onClick={() => getToken(userInfo.walletAddress)}>
            연동하기
          </button>
        ) : null}
        <button onClick={() => reGetToken(userInfo.walletAddress)}>
          토큰 재발급
        </button>
      </div>
    </div>
  );
}

export default Home;
