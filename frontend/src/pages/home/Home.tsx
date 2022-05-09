import { useLocalStorage } from "@solana/wallet-adapter-react";
import {
  WalletConnectButton,
  WalletModalButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { Button } from "@solana/wallet-adapter-react-ui/lib/types/Button";
import { userInfoAtom } from "atoms";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useMatch, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { checkWallet } from "utils/checkWallet";

import { getWallet } from "utils/getWallet";
// import picture1 from "../../styles/1.png";
// import picture2 from "../../styles/2.png";

function Home() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [isWallet, setIsWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const homeMatch = useMatch("/");
  const serviceMatch = useMatch("/service");
  const navigate = useNavigate();

  // 기존에 지갑 있으면 연결함
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
      navigate("/main");
    } else {
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
      navigate("/main");
    } else {
      alert("지갑연결이 실패했습니다");
    }
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  });
  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);
  return (
    <Main>
      {isLoading ? (
        <Loading>
          <Spinner />
        </Loading>
      ) : null}
      <Box1></Box1>
      <Box2>
        <TextArea>
          WELCOME <br /> SOLNIVERSE <br />
          <WalletMultiBtn isWallet={isWallet} onClick={connectWallet}>
            <Wrapper onClick={connectWallet}>입장하기</Wrapper>
            {/* 입장하기 */}
          </WalletMultiBtn>
        </TextArea>
      </Box2>
      <Box3>
        <Container>
          <Logo>
            <img src="" alt="" />
          </Logo>
          <Menu>
            <ul>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/service"}>Service</Link>
              </li>
            </ul>
          </Menu>
        </Container>
      </Box3>
    </Main>
  );
}

export default Home;

export const Main = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  overflow: hidden;
`;

const Wrapper = styled.div``;

const anim = keyframes`
    from {
        bottom: -100%;
      }
      to {
        bottom: 0%;
      }
`;
const anim2 = keyframes`
  from {
        left: 30%;
        width: 530px;
      }
      to {
        width: 0px;
        left: 50%;
      }
`;

const Loading = styled.div`
  /* position: absolute; */
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
  /* margin-top: 45vh; */
  @media screen and (min-width: 1000px) {
    display: none;
  }
`;

const Box1 = styled.div`
  width: 530px;
  height: 625px;
  background-image: url("1.png");
  position: absolute;
  bottom: -100%;
  left: 30%;
  animation: ${anim} 2s forwards, ${anim2} 3s forwards 2.5s;
  @media screen and (max-width: 1000px) {
    display: none;
  }

  &:after {
    content: "";
    position: absolute;
    width: 530px;
    height: 625px;
    background-image: url("2.png");
    left: 0px;
    z-index: -1;
  }
`;

const Box2 = styled.div`
  width: auto;
  height: auto;
  font-family: "Gill Sans", "Gill Sans MT", Calibri, "Trebuchet MS", sans-serif;
  color: white;
  font-size: 8em;
  font-weight: 500;
  line-height: 130px;
  position: absolute;
  color: ${(props) => props.theme.textColor};
  top: 250px;
  left: 100px;
  overflow: hidden;
  @media screen and (max-width: 800px) {
    font-size: 6em;
    line-height: 90px;
    left: 80px;
  }
  @media screen and (max-width: 550px) {
    font-size: 4em;
    line-height: 90px;
    left: 80px;
  }
`;

const anim3 = keyframes`
    from {
          left: -100%;
        }
        to {
          left: 0%;
        }
`;
const TextArea = styled.div`
  position: relative;
  left: -100%;
  color: black;
  animation: ${anim3} 2s forwards 3s;
`;
const Box3 = styled.div`
  overflow: hidden;
`;
const anim4 = keyframes`
    from {
          top: -100%;
        }
        to {
          top: 0%;
        }
`;
const Container = styled.div`
  width: 100%;
  position: absolute;
  top: -100%;
  animation: ${anim4} 2s forwards 2.5s;
`;

export const Logo = styled.div`
  float: left;
  margin-left: 100px;
  margin-top: 20px;
  img {
    width: 50px;
  }
`;
export const Menu = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  color: black;

  letter-spacing: 2px;
  margin-right: 150px;
  margin-top: 20px;
  float: right;
  ul {
    list-style: none;
    li {
      display: inline-block;
      margin-left: 100px;
    }
  }
`;

const WalletMultiBtn = styled(WalletConnectButton)<{ isWallet: boolean }>`
  width: 143px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

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
