import { accessTokenAtom, userInfoAtom } from "atoms";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { checkWallet } from "utils/checkWallet";
import { getAccessToken } from "utils/getAccessToken";
import { getTokens } from "utils/getTokens";
import { getWallet } from "utils/getWallet";

function Home() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [wallet, setWallet] = useState(false);

  // 기존에 지갑 있으면 연결 ㅇㅋ
  const checkIfWalletIsConnected = async () => {
    const data = await checkWallet();
    if (data && data.result === "success") {
      setWallet(true);
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
        setUserInfo({
          ...userInfo,
          walletAddress: data.user.walletAddress,
          createdAt: data.user.createdAt,
        });
      }
      setWallet(true);
    } else {
      alert("지갑을 연결해주세요");
    }
  };
  // 지갑연결
  const connectWallet = async () => {
    const data = await getWallet();
    if (data.result === "success") {
      setWallet(true);
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
        setUserInfo({
          ...userInfo,
          walletAddress: data.user.walletAddress,
          createdAt: data.user.createdAt,
        });
      }
      setWallet(true);
    } else {
      alert("지갑연결이 실패했습니다");
    }
  };
  // refreshToken과 accessToken받기
  const getToken = async () => {
    const res = await getTokens(userInfo?.walletAddress);
    setAccessToken(res);
  };
  // accessToken 재발급
  const reGetToken = async () => {
    console.log(accessToken, "before");
    const res = await getAccessToken(userInfo?.walletAddress);
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
          <button onClick={() => getToken()}>연동하기</button>
        ) : null}
        <button onClick={() => reGetToken()}>토큰 재발급</button>
      </div>
    </div>
  );
}

export default Home;
