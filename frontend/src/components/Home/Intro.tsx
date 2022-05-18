import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import BasicSection, { Title } from "./Tag/BasicSection";

export const Intro = () => {
  return (
    <BasicSection
      size={100}
      introTitle="SOLNIVERSE"
      introContent="SOL(Solana) 와 UNIVERS(세계) 를 합성어 SOLNIVERSE입니다."
      imageUrl="/favicon.ico"
      title="솔니버스입니다"
    >
      <p>
        저희 SOLNIVERSE는 SOLANA 블록체인 네트워크를 사용하는 팬텀 월렛을 통해
        서비스를 제공합니다.{" "}
        <Phantom>
          <a href="https://phantom.app/">
            팬텀 월렛 확장 프로그램이 아직 없으신가요?{" "}
          </a>
        </Phantom>
        <br />
        지금 바로 솔니버스와 함께 하세요 !
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
