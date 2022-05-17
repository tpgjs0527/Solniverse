import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import BasicSection, { Title } from "./Tag/BasicSection";

export const Intro = () => {
  return (
    <BasicSection
      size={100}
      introTitle="SOLNIVERSE"
      introContent="SOL : Solana 와 UNIVERSE:세계 를 합성어 SOLNIVERSE입니다."
      imageUrl="/favicon.ico"
      title="솔니버스입니다"
    >
      <p>
        저희 SOLNIVERSE는 블록체인 SOLANA 코인을 통해 후원을 성사시키고
        있습니다.{" "}
        <Phantom>
          <Link to="/">팬텀 월렛 확장 프로그램이 아직 없으신가요?</Link>
        </Phantom>
        당신의 후원이벤트는 이제 우리 Phantom wallet과 함께합니다 예 제생각에는
        겟핍의 소개 내용을 좀 많이 차용해야겠군요
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
