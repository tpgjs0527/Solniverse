import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import BasicSection, { Title } from "./Tag/BasicSection";

export const Intro = () => {
  return (
    <BasicSection
      size={200}
      introTitle="SOLNIVERSE"
      introContent="SOLNIVERSE는 SOL(Solana)와 UNIVERSE 의 합성어입니다."
      imageUrl="/favicon.ico"
      title="솔니버스에 오신것을 환영합니다"
    >
      <p>
        저희 솔니버스(SOLNIVERSE)는 Solana 블록체인 네트워크와 Universe가 합쳐져
        세상 모든 곳에서 손쉽게 사용할 수 있는 블록체인 결제 시스템을
        의미합니다. 현재는 팬텀 월렛을 통해 서비스를 제공합니다.
        <br />
        <Phantom>
          <a href="https://phantom.app/">
            팬텀 월렛 확장 프로그램이 아직 없으신가요?{" "}
          </a>
        </Phantom>
        <br />
        쉽고 빠르게 월렛은 설치하시고 함께 솔니버스와 함께 하세요 !
      </p>
    </BasicSection>
  );
};
const Phantom = styled.span`
  color: ${(props) => props.theme.ownColor};
  :hover {
    background-color: ${(props) => props.theme.ownColor};
    color: white;
  }
  transition-duration: 300ms;
`;
