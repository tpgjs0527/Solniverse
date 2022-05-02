import { accessTokenAtom, userInfoAtom } from "atoms";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { checkWallet } from "utils/checkWallet";
import { getAccessToken } from "utils/getAccessToken";
import { getTokens } from "utils/getTokens";
import { getWallet } from "utils/getWallet";

function Home() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenAtom);
  const [isWallet, setIsWallet] = useState(false);
  const navigate = useNavigate();
  const [UUID, setUUID] = useState("");
  // 기존에 지갑 있으면 연결 ㅇㅋ
  const checkIfWalletIsConnected = async () => {
    const data = await checkWallet();
    if (data && data.result === "success") {
      setIsWallet(true);
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
      alert("지갑을 연결해주세요");
    }
  };
  // 지갑연결
  const connectWallet = async () => {
    const data = await getWallet();
    if (data.result === "success") {
      setIsWallet(true);
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

  // 버튼 눌렀을 때, 권한인증하고 fetch요청해서 블러 해제
  const getUuid = async () => {
    // accessToken

    const res = await (
      await fetch(`${process.env.REACT_APP_BASE_URL}/auth/userKey`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    ).json();
    console.log(res);
    setUUID(res.userKey);
    // ${process.env.REACT_APP_SOCKET_URL}/donation/alertbox/${res.userKey}
    navigate({
      pathname: `/donation/alertbox/${res.userKey}`,
    });
    console.log(res);
  };

  const enterMain = () => {
    navigate("/main");
  };
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);
  return (
    <Base>
      <div>
        <WalletBtn isWallet={isWallet} onClick={connectWallet}>
          {!isWallet ? "지갑연결" : "연결완료"}
        </WalletBtn>
      </div>
      <div>
        <EnterBtn hidden={!isWallet} onClick={enterMain}>
          입장하기
        </EnterBtn>
      </div>
    </Base>
  );
}

export default Home;

const Base = styled.div`
  margin: 0 auto;
  padding: 60px 24px 172px;
  max-width: 364px;

  @media screen and (min-width: 767px) {
    max-width: 630px;
    padding: 60px 0 172px;
  }
  @media screen and (min-width: 1024px) {
    padding-top: 72px;
    max-width: 952px;
  }
  @media screen and (min-width: 1439px) {
    max-width: 1296px;
  }

  display: flex;
  flex-direction: column;

  align-items: center;
  min-height: 100vh;
`;

const WalletBtn = styled.div<{ isWallet: boolean }>`
  width: 143px;
  align-items: center;
  text-align: center;
  margin-top: 140%;
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: 550;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  border: none;
  cursor: ${(props) => (props.isWallet ? "" : "pointer")};
  transition: transform ease-in 200ms;
  background-color: ${(props) => (props.isWallet ? "#404144" : "#512da8")};
  color: ${(props) => (props.isWallet ? "#999" : "#fff")};

  &:hover {
    transform: scale(1.03);
    background-color: "#20134190";
  }
  transition: transform ease-in 170ms;
`;

const EnterBtn = styled.div`
  width: 143px;
  text-align: center;
  margin-bottom: 10px;
  font-size: 19px;
  font-weight: 550;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 4px 12px 30px 6px rgb(0 0 0 / 9%);
  border: none;
  &:hover {
    cursor: pointer;
    transform: scale(1.05);
  }
  transition: transform ease-in 150ms;
`;
