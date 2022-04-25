import { accessTokenAtom, userInfoAtom } from "atoms";
import { useRecoilState } from "recoil";
import { getAccessToken } from "utils/getAccessToken";
import { getWallet } from "utils/getWallet";

function Home() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);

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
          createdAt: data.user.created_at,
        });
        console.log("twitch true", userInfo);
      } else {
        setUserInfo({
          ...userInfo,
          walletAddress: data.user.wallet_address,
          createdAt: data.user.created_at,
        });
      }
    } else {
      alert("지갑연결이 실패했습니다");
    }
  };
  // refreshToken과 accessToken받기
  const getToken = async (walletAddress: string) => {
    const res = await getAccessToken(walletAddress);
    setAccessToken(res);
  };
  // accessToken 재발급
  const reGetToken = async (walletAddress: string) => {
    console.log(accessToken, "before");
    const res = await getAccessToken(walletAddress);
    setAccessToken(res);
  };
  console.log(accessToken, "after");

  return (
    <div className="App">
      <div className="container">
        <button
          className="cta-button connect-wallet-button"
          onClick={connectWallet}
        >
          {!userInfo.walletAddress ? "지갑연결" : "연결완료"}
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
