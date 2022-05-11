import { userInfoAtom } from "atoms";
import Spinner from "components/Spinner";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { getProvider } from "utils/getProvider";
import { getWallet } from "utils/solanaWeb3";

function Home() {
  const [userInfo, setUserInfo] = useRecoilState(userInfoAtom);
  const [isWallet, setIsWallet] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const provider = getProvider();

  // 지갑연결
  const connectWallet = async () => {
    const res = await provider?.connect();
    const data = await getWallet(res);
    if (data.result === "success") {
      console.log("최초 지갑 로그인!!!!!!!!!!!!!", data);
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
      console.log("최초 지갑 로그인!!!!!!!!!!!!!", userInfo);
      navigate("/main");
    } else {
      alert("지갑연결이 실패했습니다");
    }
  };

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
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
          ENJOY
          <br /> SOLNIVERSE <br />
          <Pushable>
            <span className="shadow"></span>
            <span className="edge"></span>
            <WalletMultiBtn
              className="front"
              isWallet={isWallet}
              onClick={connectWallet}
            >
              입장하기
            </WalletMultiBtn>
          </Pushable>
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
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 50%;
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
  animation: ${anim} 1.3s forwards, ${anim2} 2s forwards 1.2s;
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
    left: 20px;
  }
  @media screen and (max-width: 600px) {
    font-size: 5rem;
    line-height: 90px;
    left: 20px;
  }
  @media screen and (max-width: 375px) {
    font-size: 3.7rem;
    line-height: 90px;
    left: 20px;
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
  margin-bottom: 30px;
  color: ${(props) => props.theme.textColor};
  animation: ${anim3} 1.5s forwards 1.3s;
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
  animation: ${anim4} 1.5s forwards 0.5s;
`;

export const Logo = styled.div`
  float: left;
  margin-left: 100px;
  margin-top: 20px;
  img {
    width: 50px;
  }
  @media screen and (max-width: 600px) {
    margin-left: 40px;
  }
`;
export const Menu = styled.div`
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  color: ${(props) => props.theme.textColor};

  letter-spacing: 2px;
  margin-right: 150px;
  margin-top: 30px;
  float: right;
  ul {
    list-style: none;
    li {
      display: inline-block;
      margin-left: 100px;
    }
  }
  @media screen and (max-width: 600px) {
    margin-right: 40px;
    letter-spacing: 1px;
  }
`;

const WalletMultiBtn = styled.span<{ isWallet: boolean }>`
  display: block;
  position: relative;
  padding: 12px 42px;
  border-radius: 12px;
  border-color: #696868;
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  background: hsl(345deg 100% 47%);
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  cursor: ${(props) => (props.isWallet ? "" : "pointer")};
  background-color: ${(props) =>
    props.isWallet ? "#404144" : props.theme.ownColor};
  color: ${(props) => (props.isWallet ? "#999" : "#fff")};
`;

const Pushable = styled.button`
  position: relative;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline-offset: 4px;
  transition: filter 250ms;

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: hsl(0deg 0% 0% / 0.25);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }
  .edge {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 12px;
    background: ${(props) => "#283250"};
  }
  &:hover {
    filter: brightness(110%);
    .front {
      transform: translateY(-6px);
      transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }
    .shadow {
      transform: translateY(6px);
      transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
    }
  }
  &:active {
    .front {
      transform: translateY(-2px);
      transition: transform 34ms;
    }
    .shadow {
      transform: translateY(1px);
      transition: transform 34ms;
    }
  }
  &:focus:not(:focus-visible) {
    outline: none;
  }
`;
