import Features from "components/Home/Features";
import BasicSection from "components/Home/Tag/BasicSection";

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Logo, Main, Menu } from "./Home";

export const Service = () => {
  return (
    <Wrapper>
      <NavBar>
        <Logo>
          <img src="" alt="" />
        </Logo>
        <Menu>
          <ul>
            <li>
              <Link to={"/service"}>서비스</Link>
            </li>
            <li>
              <Link to={"/"}>홈</Link>
            </li>
          </ul>
        </Menu>
      </NavBar>
      <ServiceWrapper>
        <Features />
        <BasicSection imageUrl="/demo-illustration-1.svg">
          <p>
            저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
            있습니다.{" "}
            <Phantom>
              <Link to="/">팬텀 월렛 확장 프로그램이 아직 없으신가요?</Link>
            </Phantom>{" "}
            당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다 예
            제생각에는 겟핍의 소개 내용을 좀 많이 차용해야겠군요
          </p>
        </BasicSection>
      </ServiceWrapper>
    </Wrapper>
  );
};
const Wrapper = styled.div`
  overflow-x: hidden;
`;
const Phantom = styled.span`
  color: ${(props) => props.theme.ownColor};
  :hover {
    background-color: ${(props) => props.theme.ownColor};
    color: white;
  }
  transition-duration: 300ms;
`;
const NavBar = styled.div`
  width: 100vw;
  position: sticky;
  top: 0%;
`;

const ServiceWrapper = styled.div`
  /* padding: 4rem; */
  padding-top: 4rem;

  /* & > :last-child {
    margin-bottom: 15rem;
  } */
`;
