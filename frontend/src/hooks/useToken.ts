import { getProvider } from "../utils/getProvider";
import base58 from "bs58";
import { useRecoilState } from "recoil";
import { userInfoAtom } from "atoms";
import Swal from "sweetalert2";

// signature 전달해서 refresthToken 및 accessToken 받기

interface IuserData {
  walletAddress: string;
  signature: string;
}
let phantom = "";
function useToken() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);

  // accessToken과 refreshToken을 받는 함수
  const getTokens = async (walletAddress: string) => {
    if (!walletAddress)
      return Swal.fire({
        icon: "error",
        title: "지갑 발견 실패",
        html: "지갑이 연결되지 않았습니다.<br>팬텀 월렛을 확인해주세요 😊",
        footer: '<a href="/service">서비스 안내 바로가기</a>',
      });
    const provider = getProvider();

    if (provider) {
      // 현재 지갑 연결되어있으면 연결하기
      try {
        phantom = await (
          await provider.connect({ onlyIfTrusted: true })
        ).publicKey.toString();
        console.log(phantom);
        // 지갑 연결 끊겨있으면 수동으로 연결하기
      } catch (error) {
        phantom = await (await provider.connect()).publicKey.toString();
      }
      // 지금 연결된 지갑과 아톱의 지갑이 다르면 로그아웃
      if (phantom !== userInfo.walletAddress) {
        Swal.fire(
          "지갑 변경 감지",
          "지갑을 변경하셨군요! <br> 변경한 지갑으로 재입장해주시기 바랍니다 😊",
          "question"
        );
        setUserInfo({
          twitch: {
            id: "",
            displayName: "",
            profileImageUrl: "",
          },
          walletAddress: "",
          createdAt: "",
        });
        return;
      }
      // sign message 받기
      const res = await (
        await fetch(`${process.env.REACT_APP_BASE_URL}/auth/sign/${phantom}`, {
          method: "GET",
        })
      ).json();

      const messageBytes = new TextEncoder().encode(res.signMessage);
      const signRes = await provider?.signMessage(messageBytes);
      const signature = base58.encode(signRes.signature);

      const userData: IuserData = {
        walletAddress: walletAddress,
        signature: signature,
      };

      const response = await (
        await fetch(`${process.env.REACT_APP_BASE_URL}/auth/connect`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(userData),
        })
      ).json();
      // accessToken 반환
      // refreshToken은 자동으로 cookie에 저장됨
      return response.accessToken;
    }
  };

  // refreshToken을 사용하여 accessToken 재발급 받는 함수
  async function getAccessToken(walletAddress: string) {
    if (!walletAddress)
      return Swal.fire({
        icon: "error",
        title: "지갑 발견 실패",
        text: "지갑이 연결되지 않았습니다. 팬텀 월렛을 확인해주세요 😊",
        footer: '<a href="/service">서비스 안내 바로가기</a>',
      });
    else {
      const response = await (
        await fetch(`${process.env.REACT_APP_BASE_URL}/auth/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          // cookie 같이 넘겨주려면 include해야함
          credentials: "include",
          body: JSON.stringify({ walletAddress }),
        })
      ).json();
      if (response.result === "success") {
        return response.accessToken;
      } else {
        try {
          const token = await getTokens(walletAddress);
          return token;
        } catch (error) {}
      }
    }
  }

  async function checkToken(accessToken: string, walletAddress: string) {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BASE_URL}/auth/accessToken`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.status === 200 || res.status === 304) {
        // 토큰 정상
        return accessToken;
      } else if (res.status === 400) {
        // 토큰 없음
        const newAccessToken = await getAccessToken(walletAddress);
        return newAccessToken;
      } else if (res.status === 401) {
        // 토큰 만료
        const newAccessToken = await getAccessToken(walletAddress);
        return newAccessToken;
      } else {
        // 그 외
        const error = new Error(res.statusText);
        throw error;
      }
    } catch (error) {
      console.log("그 외 error");
    }
  }
  return [getTokens, getAccessToken, checkToken];
}

export default useToken;
