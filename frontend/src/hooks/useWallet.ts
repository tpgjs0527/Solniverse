import { useRecoilState } from "recoil";
import { userInfoAtom } from "atoms";
import Swal from "sweetalert2";
import { getProvider } from "../utils/getProvider";
import { fetchWallet } from "utils/fetcher";

function useWallet() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  // phantom wallet extension 가져오기
  const getWallet = async () => {
    const provider = getProvider();

    if (provider) {
      const response = await provider.connect();
      try {
        const res = await fetchWallet(response.publicKey.toString());
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          return data;
        } else {
          const error = new Error(res.statusText);
          throw error;
        }
      } catch (error) {
        const res = await fetchWallet(response.publicKey.toString(), "POST");
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          return data;
        } else {
          const error = new Error(res.statusText);
          console.log(error);
          Swal.fire({
            icon: "error",
            title: "지갑 연결 실패",
            text: "올바르지 않은 요청이 진행됐습니다.",
            footer: '<a href="/service">서비스 안내 바로가기</a>',
          });
        }
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "지갑 발견 실패",
        text: "지갑이 연결되지 않았습니다. 새로고침 혹은 팬텀 월렛을 확인해주세요 😊",
        footer: '<a href="/service">서비스 안내 바로가기</a>',
      });
    }
  };

  // phantom wallet extension 연결
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
    } else {
      return Swal.fire({
        icon: "error",
        title: "Connect issue!",
        text: "  The wallet is not found.  Please check the wallet program!",
        footer: '<a href="/service">서비스 안내 바로가기</a>',
      });
    }
  };

  return [getWallet, connectWallet];
}

export default useWallet;
