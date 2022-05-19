import Spinner from "components/Spinner";
import useWallet from "hooks/useWallet";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [, connectWallet] = useWallet();
  const [isReload, setIsReload] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  useEffect(() => {
    window.addEventListener("load", () => setIsReload(true));

    return () => {
      window.removeEventListener("load", () => setIsReload(false));
    };
  });
  return (
    <Main>
      {isLoading ? (
        <Loading>
          <Spinner />
        </Loading>
      ) : null}
      <Hand></Hand>
      <TextBox>
        <TextArea>
          ENJOY
          <br /> SOLNIVERSE <br />
          <Pushable>
            <span className="shadow"></span>
            <span className="edge"></span>
            <WalletMultiBtn className="front" onClick={connectWallet}>
              입장하기
            </WalletMultiBtn>
          </Pushable>
        </TextArea>
      </TextBox>
      <NavBox>
        <Container>
          <Logo>
            <Link to={"/"}>
              <img
                src={`${process.env.PUBLIC_URL}/images/SNV토큰.png`}
                alt=""
              />
            </Link>
          </Logo>
          <Menu>
            <ul>
              <li>
                <Link to={"/"}>홈</Link>
              </li>
              <li>
                <Link to={"/service"}>서비스 안내</Link>
              </li>
            </ul>
          </Menu>
        </Container>
      </NavBox>
    </Main>
  );
}

export default Home;

export const Main = styled.div`
  width: 100%;
  height: 100%;

  position: absolute;
  overflow: hidden;
  /* iPhone 가로 스크롤 방지 */
  overflow-x: hidden;
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

const Hand = styled.div`
  width: 700px;
  height: 500px;

  background-image: url("1.png");
  position: absolute;
  bottom: -100%;
  left: 30%;
  animation: ${anim} 1.3s forwards, ${anim2} 2s forwards 1.2s;
  @media screen and (max-width: 1000px) {
    display: none;
  }
  @media screen and (min-width: 1600px) {
    height: 750px;
    background-image: url("큰1.png");
    width: 600px;
  }
  &:after {
    content: "";
    position: absolute;
    width: 700px;
    height: 600px;
    background-image: url("2.png");
    left: 0px;
    z-index: -1;
    @media screen and (min-width: 1600px) {
      height: 750px;
      background-image: url("큰2.png");
      width: 600px;
    }
  }
`;

const TextBox = styled.div`
  width: auto;
  height: auto;

  color: white;
  font-size: 7em;
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
const NavBox = styled.div`
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
  display: flex;
  align-items: center;
  width: 100%;
  position: absolute;
  top: -100%;
  animation: ${anim4} 1.5s forwards 0.5s;
`;

export const Logo = styled.div`
  float: left;

  margin-left: 40px;
  margin-right: 40px;
  margin-top: 10px;
  img {
    width: 60px;
  }
  @media screen and (min-width: 0px) and (max-width: 499px) {
    margin-left: 5px;
    margin-right: 10px;
  }
  @media screen and (min-width: 500px) and (max-width: 1000px) {
    margin-left: 15px;
    margin-right: 30px;
  }
`;
export const Menu = styled.div`
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => props.theme.textColor};

  letter-spacing: 1px;
  /* margin-right: 150px; */

  @media screen and (min-width: 1500px) {
    margin-left: 2px;
  }

  ul {
    list-style: none;
    li {
      display: inline-block;
      margin-right: 25px;
      @media screen and (max-width: 600px) {
        margin-right: 10px;
      }
      &:hover {
        color: ${(props) => props.theme.ownColor};
      }
    }
  }
  @media screen and (max-width: 600px) {
    margin-right: 0px;
    margin-top: 0px;
    letter-spacing: 0px;
  }
`;

const WalletMultiBtn = styled.span`
  display: block;
  position: relative;
  padding: 12px 42px;
  border-radius: 12px;
  border-color: #67676b;
  font-size: 1.25rem;
  font-weight: 800;
  color: white;
  background: hsl(345deg 100% 47%);
  will-change: transform;
  transform: translateY(-4px);
  transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  cursor: "pointer";
  background-color: ${(props) => props.theme.ownColor};
  color: "#fff";
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
    background: ${(props) => "#5496fa"};
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
